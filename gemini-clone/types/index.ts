export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  workspace_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface FileRecord {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  storage_path: string;
  mime_type: string;
  size: number;
  created_at: string;
}
