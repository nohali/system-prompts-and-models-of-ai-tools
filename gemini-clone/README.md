# Gemini Clone

A full-featured clone of Google Gemini's chat interface, built with Next.js 14, Supabase, and the Google Gemini API. This application replicates the core functionality of Gemini with additional features like workspaces, file uploads, and persistent conversation history.

## Features

- **Authentication**: Secure email/password authentication with Supabase Auth
- **Real-time Chat**: Interactive chat interface with the Google Gemini AI
- **Markdown Support**: Full markdown rendering with syntax-highlighted code blocks
- **Code Highlighting**: Beautiful syntax highlighting for multiple programming languages
- **File Management**: Upload and manage files with Supabase Storage
- **Workspaces**: Organize conversations into workspaces
- **Conversation History**: All conversations are persisted and accessible
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Fully themed with support for light and dark modes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **UI**: TailwindCSS 4, Shadcn/ui components, Radix UI
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth + Storage)
- **AI**: Google Gemini API with CLI system prompt
- **Deployment**: Optimized for Vercel

## Prerequisites

Before you begin, ensure you have the following:

1. Node.js 18+ installed
2. A Supabase account and project ([supabase.com](https://supabase.com))
3. A Google Gemini API key ([makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey))

## Setup Instructions

### 1. Clone the Repository

```bash
cd gemini-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

The `.env.local` file has been created with your Supabase credentials. You need to add your Gemini API key:

```env
# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here  # ← ADD THIS
```

To get your Gemini API key:
1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy it to your `.env.local` file

### 4. Database Setup

The database schema has already been created with the following tables:
- `workspaces` - User workspaces for organizing conversations
- `conversations` - Chat conversations
- `messages` - Individual messages in conversations
- `files` - File metadata for uploads

Storage bucket for files has also been configured with appropriate security policies.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
gemini-clone/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── signup/
│   │       └── page.tsx          # Signup page
│   ├── workspace/
│   │   └── page.tsx              # Main workspace/chat interface
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── chat/
│   │   ├── message.tsx           # Message component
│   │   ├── message-input.tsx    # Message input component
│   │   ├── message-list.tsx     # Message list component
│   │   └── file-upload.tsx      # File upload component
│   ├── sidebar/
│   │   └── sidebar.tsx           # Sidebar with conversations
│   ├── ui/                       # Shadcn/ui components
│   └── markdown-renderer.tsx    # Markdown rendering component
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client (browser)
│   │   ├── server.ts             # Supabase client (server)
│   │   └── middleware.ts         # Supabase middleware utilities
│   ├── gemini-client.ts          # Gemini API integration
│   └── utils.ts                  # Utility functions
├── types/
│   └── index.ts                  # TypeScript type definitions
├── proxy.ts                      # Next.js proxy (auth middleware)
└── README.md                     # This file
```

## Key Features Explained

### Gemini CLI System Prompt Integration

The application uses the actual Gemini CLI system prompt found in the repository, providing specialized behavior for software engineering tasks. This prompt configures the AI to:

- Follow existing code conventions
- Provide concise, direct responses
- Handle file operations safely
- Explain critical operations before execution
- Prioritize security and best practices

### Supabase Integration

The application leverages Supabase for:

- **Authentication**: Secure user authentication with email/password
- **Database**: PostgreSQL database with Row Level Security (RLS) enabled
- **Storage**: File uploads with secure access policies
- **Real-time**: Potential for real-time features in future updates

All data is protected with RLS policies ensuring users can only access their own data.

### Markdown and Code Rendering

Messages from the AI are rendered with:

- Full markdown support (headers, lists, links, images, etc.)
- Syntax-highlighted code blocks for multiple languages
- Copy-to-clipboard functionality for code blocks
- GitHub-style code rendering

## Usage

1. **Sign Up**: Create a new account on the signup page
2. **Start Chatting**: Click "New Chat" to start a conversation
3. **Upload Files**: Use the file upload component to attach files
4. **Organize**: Conversations are automatically organized in workspaces
5. **Search**: Browse your conversation history in the sidebar

## Deployment

### Deploy to Vercel

The easiest way to deploy this application is with Vercel:

```bash
npm install -g vercel
vercel
```

Make sure to add your environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Ensure all dependencies are installed: `npm install`
2. Check that environment variables are set correctly
3. Verify your Gemini API key is valid
4. Check Supabase connection

### Authentication Issues

If authentication isn't working:

1. Verify Supabase credentials in `.env.local`
2. Check that RLS policies are enabled on all tables
3. Ensure email confirmation is disabled in Supabase (for development)

### API Rate Limits

The Gemini API has rate limits. If you hit them:

1. Wait a few minutes before trying again
2. Consider implementing rate limiting on the client side
3. Upgrade your Gemini API plan if needed

## Future Enhancements

Potential features to add:

- [ ] Real-time collaboration on conversations
- [ ] Voice input/output
- [ ] Image generation integration
- [ ] Advanced code editing with Monaco editor
- [ ] Export conversations to PDF/Markdown
- [ ] Conversation sharing
- [ ] Custom system prompts per workspace
- [ ] Plugin system for tools
- [ ] Streaming responses for better UX

## License

This project is for educational purposes. Please respect Google's Gemini API terms of service and Supabase's usage policies.

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Review Gemini API documentation: [ai.google.dev](https://ai.google.dev)
4. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using Next.js, Supabase, and Google Gemini AI
