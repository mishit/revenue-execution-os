# Revenue Execution OS

An execution-first outbound command center for a solo B2B GTM operator. The first working slice is the Today command center: ranked next-best actions, daily targets, execution rhythm, calls/revenue, and a searchable action queue.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production direction

The UI is structured for Supabase-backed persistence. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`; never expose a service-role key in browser code. Netlify can build with `npm run build` and publish the Next.js app using the official Next runtime/plugin.

See `BUILD_STATUS.md` for the current implementation boundary and verification status.
