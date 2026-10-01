# Alizey Ali — Portfolio

- `client/` — the React + Tailwind frontend exported from Figma (design unchanged).
- `server/` — Express + SQLite backend (Node 22.5+, uses the built-in `node:sqlite`).

## Run it

```bash
npm run install:all
cp server/.env.example server/.env   # set JWT_SECRET and ADMIN_PASSWORD
npm run dev:server                    # API on :4000
npm run dev:client                    # site on :5173 (proxies /api)
```

Production: `npm run build && NODE_ENV=production npm start` — the server also serves `client/dist`.

## API

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | – | Health check |
| GET | `/api/content` | – | All site copy (the frontend renders from this, falling back to built-in text) |
| POST | `/api/contact` | – | Save a message `{name, email, message}` (5/hour/IP, honeypot `website`); emails you if SMTP is set |
| POST | `/api/auth/login` | – | `{password}` → `{token}` (Bearer, 12h) |
| PUT | `/api/content` | admin | Replace site copy (same shape as GET) |
| GET | `/api/messages` | admin | List contact messages |
| PATCH | `/api/messages/:id` | admin | Mark read (`{isRead:false}` to unread) |
| DELETE | `/api/messages/:id` | admin | Delete a message |

Edit copy by fetching `/api/content`, changing it, and PUTting it back with your token. `\n` is a line break; `*word*` is italic.

Tests: `npm test`.
