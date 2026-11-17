# Coy – Discover tab (SDE Intern Assignment)

Swipe-based discovery feature: React (Vite) + Node/Express + JSON-file storage.

## Run
```bash
npm run install:all
npm run dev      # API on :4000, app on http://localhost:5173
```
Open on your phone via the "Network" URL Vite prints (same Wi-Fi).

## Features
- 36 seeded profiles (name, age, photo, bio, city/college, interests); every 3rd one already liked you
- Drag-to-swipe (touch + mouse) with LIKE/PASS stamps, plus ✕ / ♥ buttons
- Swiped profiles never come back; empty state with "Reset demo"
- "It's a match!" screen on mutual like; Matches list
- State persists in `server/data/db.json`

## API
| Method | Route | Description |
|---|---|---|
| GET | `/feed` | profiles not yet swiped on |
| POST | `/swipe` `{profileId, direction: "like"\|"pass"}` | returns `{matched, profile}` |
| GET | `/matches` | mutual matches only |
| POST | `/reset` | restart demo |

(All also available under `/api/...`.)

## Privacy ("core promise of Coy")
The `likedMe` flag exists only on the server. It is stripped from every response, so the client can never learn who liked you before a mutual match.
