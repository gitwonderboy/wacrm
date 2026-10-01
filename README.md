# Sea View WhatsApp

WhatsApp inbox, contacts, broadcasts and automations for **Sea View Primary
School** staff, built and maintained by [CloseTag](https://closetag.co.za).

It runs on the official WhatsApp Business (Meta Cloud) API, the same number
the school's existing parent chatbot answers on. Where the chatbot is a
self-service menu (hours, calendar, latest newsletter PDF, grade
subscriptions), this app is the staff-facing side: a shared inbox several
people can work from, a contact list with tags and custom fields, template
broadcasts with delivery tracking, and no-code automations.

## Where this came from

This codebase started as a fork of [wacrm](https://github.com/ArnasDon/wacrm)
(MIT, by Arnas Donauskas), taken at upstream commit `c3f8b3f` on 2026-10-01.
The LICENSE keeps the original copyright notice, as MIT requires, with
CloseTag's notice added for the Sea View modifications.

What changed in the conversion to a Sea View-owned codebase:

- `src/lib/brand.ts` is the single place that names the app, the
  organisation, the public site, the support email and the brand colours.
  Every user-facing string, the `<title>` template, the favicon and the
  invite-link fallback read from it.
- A `maroon` colour theme (school maroon `#610018` with gold `#fec913`
  highlights) is the default. The upstream palettes remain selectable.
- Upstream template scaffolding was removed: issue templates, CODEOWNERS,
  code of conduct, security policy, contributing guide, changelog, Hostinger
  marketing assets and the default Next.js SVGs.
- Package identity, repository links and keywords point at this fork.

Nothing in the WhatsApp, Supabase or automation logic was changed in that
step. Behavioural customisation for the school comes next (see below).

## Stack

| Layer | Technology |
|---|---|
| App | Next.js 16 (App Router), React 19, TypeScript 6, Tailwind 4, shadcn/ui |
| Data | Supabase (Postgres, Auth, Storage, RLS); migrations in `supabase/migrations` |
| WhatsApp | Meta Cloud API; HMAC-verified webhook at `/api/whatsapp/webhook` |
| Tests | Vitest (`npm test`), ESLint, `tsc --noEmit`, CI on push and PR |

## Local development

Requires Node 20 or newer (the monorepo uses 22).

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase + Meta values
npm run dev                        # http://localhost:3000
```

Useful scripts:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Environment variables are documented inline in `.env.local.example`.
`ENCRYPTION_KEY` and `META_APP_SECRET` are read at module load, so the
app refuses to start without them.

## How this fits next to the existing Sea View bot

The parent chatbot lives in the monorepo's `backend/` Lambda
(`lib/whatsapp.py`, `lib/whatsapp_subscribers.py`,
`whatsapp/messages/payload.py`) and is driven by the school's admin
dashboard. Both systems want to talk to the same Meta app and phone number,
and **Meta delivers webhooks to one callback URL per app**. That is the
first design decision to make before this app goes live:

1. **Lambda stays the webhook owner and forwards.** The existing `/webhook`
   handler keeps answering the self-service menu and relays every inbound
   event to this app's `/api/whatsapp/webhook` so conversations land in the
   inbox. Least disruptive; the bot keeps working unchanged.
2. **This app owns the webhook and the bot is rebuilt as a Flow.** The
   visual flow builder covers menus, keyword triggers and document replies.
   Grade subscriptions would move from the DynamoDB subscriber table into
   contact tags here. Cleaner long term, more work up front.
3. **Separate phone numbers.** Simplest technically, but parents would see
   two school numbers.

Until that is decided, run this app against a Meta test number so the
production bot is untouched.

Other overlaps to reconcile later:

- Broadcasts: the admin dashboard sends template broadcasts to DynamoDB
  subscribers; this app sends them to Supabase contacts. One list should win.
- Staff accounts: the admin dashboard has its own JWT auth; this app uses
  Supabase Auth with owner/admin/agent/viewer roles. Invite staff by link
  from Settings, Members.

## Deployment

Any Node host works (the upstream project documents Hostinger Managed
Node.js; Vercel and a plain VPS also work). The monorepo's other apps are on
AWS, so AWS Amplify Hosting is the natural fit when the time comes. Whatever
the host, set:

- the Supabase keys and `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_KEY` (generate once, never rotate casually; rotating orphans
  every stored WhatsApp token)
- `META_APP_SECRET`
- `NEXT_PUBLIC_SITE_URL` to the CRM's own public URL so invite links are
  correct
- `AUTOMATION_CRON_SECRET` plus a 5-minute pinger if automations use Wait
  steps

Apply `supabase/migrations/*.sql` in order to a fresh Supabase project
before the first deploy.

## Pulling upstream fixes

The fork point is recorded above. To cherry-pick upstream bug fixes:

```bash
git remote add upstream https://github.com/ArnasDon/wacrm.git   # once
git fetch upstream
git log --oneline c3f8b3f..upstream/main
git cherry-pick <sha>
```

Expect conflicts in the files this fork rebranded (`layout.tsx`,
`sidebar.tsx`, `themes.ts`, `globals.css`, the settings strings). Prefer
cherry-picks over a full merge so the Sea View changes stay intact.

## License

MIT. See `LICENSE` for both copyright notices.
