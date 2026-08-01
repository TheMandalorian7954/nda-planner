# 🛜 Running NDA OS Fully Offline & Locally

Everything in this app runs on **your own machine** — no cloud, no accounts needed.
Your progress, tasks, habits, mock scores — all stored in a local database folder on
your computer.

## What you need

- **Node.js 18+** (includes `npm`). Download from https://nodejs.org
  (this is the *only* step that needs internet — do it once, before going offline).

## One-time setup

1. Unzip the project (e.g. `nda-os.zip`) anywhere on your computer.
2. Open a terminal in that folder and install dependencies:
   ```bash
   npm install
   ```
3. That's it. This also bundles the fonts locally, so no Google Fonts CDN needed.

## Start the app (offline from here on)

You need **two terminal windows** open in the project folder, running two commands:

**Terminal 1 — the local database (Convex):**
```bash
npx convex dev
```
- This starts a **local backend** at `http://127.0.0.1:3210` and creates a
  `.env.local` file automatically (so the app knows where the DB is).
- Your data lives in a local folder (`.convex/`) on your computer — fully private,
  zero internet.
- Keep this window running. ⚠️ Note: the first run may ask about
  codegen — press Enter / accept defaults.

**Terminal 2 — the app (Vite):**
```bash
npm run dev
```
- Vite prints a local address, usually `http://localhost:5173`. Open it in your
  browser.

## Signing in (works with no internet)

On the login page, click **"Continue as guest"** (anonymous sign-in). That's it —
you're in the dashboard and everything works offline.

> ℹ️ The email-OTP login needs the internet (it sends you an email code). For a
> fully offline setup, just use the guest button — your data is still stored in
> the local database and stays between sessions.

## Stopping the app

- In Terminal 2: press `Ctrl+C` (stops the app).
- In Terminal 1: press `Ctrl+C` (stops the local database — this is safe, your
  data is saved on disk).

Next time you start again, just repeat the two `npx convex dev` / `npm run dev`
commands — all your progress is still there.

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm run dev` shows an error about `VITE_CONVEX_URL` | Delete the `.env.local` file if one exists, then run `npx convex dev` first and keep it running, then `npm run dev` in the other window. |
| Blank page / Convex errors in console | Make sure **Terminal 1** (`npx convex dev`) is still running, then refresh the browser. |
| "Port already in use" | Something else uses port 5173 or 3210 — close it, or the app will pick another port (check the Vite output for the URL). |

## Facts about this build

- **Fonts**: Caveat + Source Serif 4 are bundled in the repo (`@fontsource`) — no CDN calls.
- **Database**: local Convex backend, data in the project's `.convex/` folder.
- **Auth**: anonymous/guest sign-in is fully local; email OTP requires internet.
- **No telemetry/monitoring calls that matter**: the optional VLY monitoring URL
  only fires on runtime errors and fails silently offline.

Enjoy your offline NDA training OS! 🎯
