<p align="center">
  <img src="public/parallax-logo.png" alt="Parallax Logo" width="80" height="80" />
</p>

<h1 align="center">Parallax</h1>

<p align="center">
  <strong>Free, open-source planning poker for agile teams. No sign-up required.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#architecture">Architecture</a> &bull;
  <a href="#contributing">Contributing</a> &bull;
  <a href="#license">License</a>
</p>

---

Parallax is a real-time planning poker tool that lets agile teams estimate stories together without accounts, passwords, or friction. Create a board, share the link, and start voting — all powered by WebSocket-based live sync.

## Features

- **Real-Time Voting** — See who has voted instantly via WebSocket presence sync. No polling, no page refreshes.
- **Multiple Estimation Decks** — Fibonacci, Modified Fibonacci, T-Shirt Sizes, Powers of 2, or build your own custom deck.
- **Issue Management** — Add stories manually, paste Jira links (auto-parsed), or bulk import multiple issues at once.
- **Facilitator Controls** — Start/reveal/reset votes, manage participants, save estimates, change deck type mid-session.
- **Spectator Mode** — Stakeholders can watch the session without influencing estimates.
- **Built-in Timer** — Configurable countdown timer synced across all participants to keep sessions moving.
- **No Sign-Up Required** — Zero accounts, zero data collection, zero friction. Device-based identity only.
- **Auto-Cleanup** — Sessions automatically expire after 24 hours of inactivity.
- **Re-voting** — Change your vote at any time during voting, or re-estimate previously estimated issues.
- **Responsive** — Works on desktop, tablet, and mobile with an adaptive layout.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3) |
| Database & Realtime | [Supabase](https://supabase.com) (Postgres + Realtime WebSockets) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Deployment | [Vercel](https://vercel.com) (serverless) |
| Language | TypeScript (end-to-end) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/whoisarjen/Parallax.git
cd Parallax
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `NUXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `NUXT_SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `NUXT_CRON_SECRET` | Secret for the cleanup cron endpoint |

### 3. Set Up the Database

Open `supabase/migrations/001_initial_schema.sql` and execute it in your Supabase project's **SQL Editor**. This creates:

- 4 tables (`boards`, `participants`, `issues`, `votes`)
- Row Level Security policies (vote hiding until reveal)
- Realtime publication for live sync
- Auto-updating timestamps

### 4. Enable Realtime

In your Supabase Dashboard, go to **Database > Replication** and ensure the `supabase_realtime` publication includes `boards`, `participants`, and `issues`. The migration handles this, but verify it's active.

### 5. Run

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Architecture

### How It Works

```
Create Board  →  Share Link  →  Team Joins  →  Vote  →  Reveal  →  Discuss  →  Save Estimate
```

1. **Create** — Set a session name, choose an estimation deck, enter your display name
2. **Share** — Share the board URL or invite code with your team
3. **Join** — Teammates enter their display name and join (no account needed)
4. **Vote** — Facilitator starts voting on an issue; everyone selects a card independently
5. **Reveal** — Facilitator reveals all votes simultaneously with stats (average, median, mode, agreement %)
6. **Save** — Discuss outliers, re-vote if needed, then save the final estimate

### Data Flow

```
┌─────────────┐     HTTP (initial load)      ┌──────────────┐     service_role     ┌──────────┐
│   Browser    │ ───────────────────────────> │  Nuxt Server │ ──────────────────>  │ Supabase │
│  (Vue SPA)   │                              │  (API routes)│                      │ Postgres │
│             │ <─────────────────────────── │              │ <────────────────── │          │
│             │     WebSocket (all updates)   │              │                      │          │
│             │ <══════════════════════════>  │              │                      │          │
│             │     Supabase Realtime         │              │                      │          │
└─────────────┘                               └──────────────┘                      └──────────┘
```

- **Initial load** — Single HTTP fetch for board + participants + issues
- **All subsequent updates** — Pure WebSocket via Supabase Realtime (zero HTTP polling)
- **Three realtime channels:**
  - **Presence** — Online/offline status for each participant
  - **Broadcast** — Ephemeral events (vote submitted, votes revealed, timer sync)
  - **Postgres Changes** — DB row changes pushed to all subscribers (new participants, issue updates, etc.)

### Security Model

| Concern | Approach |
|---------|----------|
| Identity | Device UUID stored in cookie + localStorage (no auth required) |
| Facilitator auth | Server-generated token, SHA-256 hash stored in DB |
| Vote hiding | Row Level Security — votes only readable when `voting_state = 'revealed'` |
| API writes | All mutations go through Nuxt server routes using `service_role` key (bypasses RLS) |
| Input validation | Server-side sanitization on all user inputs (display names, issue titles, Jira URLs) |

### Project Structure

```
Parallax/
├── app/
│   ├── assets/css/          # Tailwind CSS v4 theme & utilities
│   ├── components/
│   │   ├── board/           # Board UI (voting area, cards, participants, issues, timer)
│   │   ├── common/          # Shared UI (header, footer, dialogs, toast)
│   │   └── landing/         # Landing page sections
│   ├── composables/         # Vue composables (realtime, voting, timer, identity, etc.)
│   ├── layouts/             # Default + board layouts
│   ├── pages/               # index, my-boards, board/[id]
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Board codes, deck configs, vote stats
├── server/
│   ├── api/boards/          # REST API (CRUD, voting, facilitator actions)
│   ├── api/cron/            # Expired board cleanup
│   └── utils/               # Server Supabase client, input validation
├── shared/                  # Constants shared between client & server
├── supabase/migrations/     # Database schema (single migration file)
└── public/                  # Static assets (logo, favicon)
```

### Key Constants

All configurable limits live in a single file (`shared/constants.ts`) so they can be changed in one place:

| Constant | Default | Description |
|----------|---------|-------------|
| `BOARD_EXPIRY_HOURS` | `24` | Hours before an inactive board expires |
| `HARD_DELETE_AFTER_DAYS` | `7` | Days after soft-delete before permanent removal |
| `MAX_BOARDS_PER_DEVICE` | `10` | Maximum boards a single device can create |
| `MAX_PARTICIPANTS_PER_BOARD` | `10` | Maximum participants per board |

> **Note:** The database migration uses a default `INTERVAL '24 hours'` for `expires_at`. If you change `BOARD_EXPIRY_HOURS`, also update the migration or run `ALTER TABLE boards ALTER COLUMN expires_at SET DEFAULT (now() + INTERVAL '<new value> hours');`.

## Deploying to Vercel

1. Push your repo to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables in project settings
4. Deploy

The `vercel.json` includes a cron job that runs every 6 hours to clean up expired boards.

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run `npm run build` to verify everything compiles
5. Commit and push: `git push origin feature/my-feature`
6. Open a Pull Request

### Ideas for Contributions

- Emoji reactions on vote reveal
- Export estimates to CSV
- Jira/Linear integration for syncing issues
- Custom color themes
- Sound effects on vote reveal
- Analytics dashboard for estimation trends

## License

[MIT](LICENSE)
