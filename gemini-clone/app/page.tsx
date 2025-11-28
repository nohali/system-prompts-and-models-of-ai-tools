import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Gemini Clone</h1>
        <p className="text-muted-foreground max-w-2xl">
          A powerful AI chat interface built with Next.js, Supabase, and Google Gemini AI.
          Features markdown rendering, code syntax highlighting, file uploads, and real-time conversations.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/auth/login">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg">Sign Up</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
