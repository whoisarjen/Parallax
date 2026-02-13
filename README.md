# Parallax - Planning Poker

Free, open-source planning poker for agile teams. No sign-up required.

Estimate stories in real-time with your team using WebSocket-powered live updates. Create a board, share the code, and start voting.

## Features

- **Real-Time Voting** - See who's voted instantly via WebSocket sync
- **Multiple Estimation Decks** - Fibonacci, Modified Fibonacci, T-Shirt Sizes, Powers of 2, or custom
- **Issue Management** - Add stories manually, paste Jira links, or bulk import
- **Spectator Mode** - Stakeholders can watch without influencing estimates
- **Built-in Timer** - Keep sessions moving with configurable countdown timers
- **No Sign-Up Required** - No accounts, no data collection, no friction
- **Facilitator Controls** - Manage participants, reveal votes, save estimates
- **Auto-Cleanup** - Sessions expire after 24 hours of inactivity

## Tech Stack

- [Nuxt 4](https://nuxt.com) - Vue 3 meta-framework
- [Supabase](https://supabase.com) - Postgres database + Realtime WebSockets
- [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS
- [Vercel](https://vercel.com) - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/kamilowczarek/Parallax.git
cd Parallax
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and fill in your Supabase credentials:
```bash
cp .env.example .env
```

4. Run the database migration in your Supabase SQL Editor:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Execute it in your Supabase project's SQL Editor

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NUXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `NUXT_SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `NUXT_CRON_SECRET` | Secret for the cleanup cron endpoint |

### Deploying to Vercel

1. Push to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## How It Works

1. **Create a Board** - Set a session name and choose an estimation deck
2. **Share the Code** - Share the 8-character board code (e.g., `BDFG-2345`) with your team
3. **Estimate Together** - Everyone votes independently, then the facilitator reveals all votes
4. **Reach Consensus** - Review the results, discuss outliers, re-vote if needed, and save the estimate

## Architecture

- **No Authentication** - Users are identified by a device UUID stored in localStorage + cookie
- **Facilitator Security** - Board creators receive a server-generated token for privileged actions
- **Vote Hiding** - Votes are hidden via RLS policies until the facilitator reveals them
- **Real-Time Sync** - Supabase Presence (online status) + Broadcast (vote events) + Postgres Changes (data sync)
- **Board Limits** - Max 10 boards per device, max 10 participants per board

## License

MIT
