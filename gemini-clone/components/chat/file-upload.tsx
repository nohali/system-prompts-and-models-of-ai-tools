"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Paperclip, X, FileIcon } from "lucide-react";

interface FileUploadProps {
  workspaceId: string;
  onFileUploaded?: (fileId: string) => void;
}

export function FileUpload({ workspaceId, onFileUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      for (const file of selectedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: fileRecord, error: insertError } = await supabase
          .from("files")
          .insert([
            {
              workspace_id: workspaceId,
              user_id: user.id,
              name: file.name,
              storage_path: filePath,
              mime_type: file.type,
              size: file.size,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        if (onFileUploaded && fileRecord) {
          onFileUploaded(fileRecord.id);
        }
      }

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm"
            >
              <FileIcon className="h-4 w-4" />
              <span className="max-w-[200px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Paperclip className="mr-2 h-4 w-4" />
          Select Files
        </Button>

        {selectedFiles.length > 0 && (
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : `Upload ${selectedFiles.length} file(s)`}
          </Button>
        )}
      </div>
    </div>
  );
}
