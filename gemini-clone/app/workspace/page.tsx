"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/sidebar/sidebar";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { Conversation, Message } from "@/types";

function WorkspaceContent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const supabase = createClient();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [conversationId]);

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", id)
        .single();

      if (convError) throw convError;
      setCurrentConversation(conversation);

      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messages || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!workspace) return;

      const { data: conversation, error } = await supabase
        .from("conversations")
        .insert([
          {
            workspace_id: workspace.id,
            user_id: user.id,
            title: "New Conversation",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await loadConversations();
      router.push(`/workspace?conversation=${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation) {
      await createNewConversation();
      return;
    }

    setSending(true);

    try {
      const { data: userMessage, error: userError } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: currentConversation.id,
            role: "user",
            content,
          },
        ])
        .select()
        .single();

      if (userError) throw userError;

      setMessages((prev) => [...prev, userMessage]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId: currentConversation.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const assistantMessage = await response.json();

      setMessages((prev) => [...prev, assistantMessage]);

      const title = messages.length === 0
        ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
        : currentConversation.title;

      await supabase
        .from("conversations")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", currentConversation.id);

      await loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onNewConversation={createNewConversation}
      />

      <div className="flex flex-1 flex-col">
        {currentConversation ? (
          <>
            <MessageList messages={messages} />
            <MessageInput onSendMessage={sendMessage} disabled={sending} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Gemini Clone</h2>
              <p>Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
