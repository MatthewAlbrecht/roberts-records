# Robert's Records

Album tracking app for Rob. Standalone Next.js app sharing the same Convex backend.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` to `.env` and fill in:
   - Convex deployment URL
   - Auth credentials for Rob
   - Spotify OAuth credentials

3. Run dev server:

```bash
pnpm dev
```

App runs on port 4444.

## Features

- Track album listening history
- Rate albums (1-15 tier system)
- Sync from Spotify
- Browse all albums
- View recently played tracks
