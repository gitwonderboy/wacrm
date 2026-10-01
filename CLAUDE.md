@AGENTS.md

# Sea View WhatsApp (wacrm fork) - working notes

Staff-facing WhatsApp CRM for Sea View Primary School, maintained by
CloseTag. Forked from ArnasDon/wacrm at `c3f8b3f` (MIT). Lives in the
monorepo at `wacrm/` but is its own git repository (the monorepo
`.gitignore` excludes `/wacrm/`); remote is `gitwonderboy/wacrm`.
Read `README.md` first for the fork history and the open webhook
ownership decision.

## Conventions

- **Branding lives in `src/lib/brand.ts`.** Never hard-code "Sea View",
  the school URL, the support email or a brand hex in a component; import
  `BRAND`. Theme tokens are the one exception: they live in
  `src/app/globals.css` under `html[data-theme="maroon"]` with metadata in
  `src/lib/themes.ts`.
- **Default theme is `maroon`.** `:root` mirrors it so first paint is right
  before the theme boot script runs. Keep `THEME_IDS`, `THEMES`, the CSS
  blocks and `swatch` values in sync.
- **localStorage keys** use `BRAND.storagePrefix` (`seaview.*`), not the
  upstream `wacrm.*`.
- **Hyphens, not em-dashes or en-dashes**, in anything new (chat, code
  comments, commits, docs). Upstream code still contains em-dashes; do not
  do a bulk rewrite, fix them only in lines you touch.
- **Commits**: no AI attribution lines.
- **Quote style is mixed upstream** (double quotes in `src/lib`, single in
  some settings components). Match the file you are in; `npm run format`
  normalises.

## Verify before committing

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

CI (`.github/workflows/ci.yml`) runs the same four steps with dummy
Supabase and Meta env values. Builds need `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ENCRYPTION_KEY` (64 hex chars) and
`META_APP_SECRET` set, placeholders are fine.

## Relationship to the monorepo backend

The parent chatbot (`../backend/lib/whatsapp.py`) and this app both target
the same Meta app and phone number. Meta allows one webhook URL per app, so
do not point production Meta at this app's `/api/whatsapp/webhook` without
deciding how the Lambda bot keeps receiving events (forwarding from Lambda,
or porting the bot into a Flow). Use a Meta test number for development.

## Upstream fixes

Cherry-pick from `upstream/main` (see README). Avoid full merges; the
rebranded files conflict every time.
