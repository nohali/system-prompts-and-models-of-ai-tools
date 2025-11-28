import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateResponse } from "@/lib/gemini-client";
import { Message } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId } = await request.json();

    if (!messages || !conversationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responseText = await generateResponse(messages);

    const { data: assistantMessage, error: insertError } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          role: "assistant",
          content: responseText,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(assistantMessage);
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
