"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Conversation } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onNewConversation: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewConversation,
}: SidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Gemini Clone</h2>
      </div>

      <div className="p-4">
        <Button onClick={onNewConversation} className="w-full" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground text-center">
            No conversations yet
          </p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/workspace?conversation=${conversation.id}`}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors ${
                  currentConversationId === conversation.id
                    ? "bg-accent"
                    : ""
                }`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{conversation.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
