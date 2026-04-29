# WebhookX

A real-time webhook inspection and replay tool.

## Project structure

```
webhookx/
├── server/   # Express + MongoDB backend
└── client/   # Next.js frontend
```

## Quick start

### 1. Start MongoDB
```bash
mongod
```

### 2. Start the server
```bash
cd server
cp .env.example .env
pnpm install
pnpm dev
# Runs on http://localhost:4000
```

### 3. Start the client
```bash
cd client
cp .env.example .env.local
pnpm install
pnpm dev
# Runs on http://localhost:3000
```

## How it works

1. Open the app → click **Create a new endpoint**
2. You get a unique URL: `http://localhost:4000/h/abc123`
3. Point any webhook (Paystack, GitHub, etc.) at that URL
4. Requests appear in real-time via SSE
5. Inspect headers, body, query params
6. Replay any request to a target URL

## Architecture

```
Next.js Client
     ↕ SSE (real-time stream)
Express Server
     ├── POST /h/:channelId         — capture incoming webhooks
     ├── GET  /h/:channelId/stream  — SSE stream
     ├── POST /h/:channelId/replay/:id — replay to target
     └── /api/channels/*            — CRUD
MongoDB
     ├── channels collection (TTL: 24h)
     └── requests collection (TTL: 48h)
```

## Next features to build
- [ ] Auth + persistent channels
- [ ] Redis pub/sub for horizontal scaling
- [ ] Request filtering / search
- [ ] Webhook signature verification display
- [ ] Custom response configuration (status, headers, body)
- [ ] Fly.io deployment + GitHub Actions CI
