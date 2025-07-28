# AI Memo App

AI-powered memo application built with Next.js, TypeScript, Tailwind CSS, Supabase, and Drizzle ORM.

## Features

- 🤖 AI-powered memo summarization and categorization
- 🎤 Speech-to-text functionality
- 🔐 Secure authentication with Supabase
- 📱 Responsive design with Tailwind CSS
- 🗄️ Type-safe database operations with Drizzle ORM
- 🚀 Fast development with Next.js App Router

## Tech Stack

- **Frontend/Backend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **AI Service**: Claude API (Anthropic)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Claude API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ai-memo-app.git
cd ai-memo-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=your_database_connection_string

# Claude API Configuration
ANTHROPIC_API_KEY=your_claude_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

5. Set up the database:

```bash
npm run db:generate
npm run db:push
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push schema to database

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── memo/           # Memo-related components
│   ├── auth/           # Authentication components
│   └── layout/         # Layout components
├── lib/                # Library configurations
│   └── supabase.ts     # Supabase client
├── db/                 # Database configuration
│   ├── index.ts        # Database connection
│   └── schema.ts       # Database schema
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Database Schema

- **users** - User accounts and profiles
- **memos** - Memo content and metadata
- **categories** - Memo categories
- **tags** - Memo tags
- **memo_tags** - Many-to-many relationship between memos and tags

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
