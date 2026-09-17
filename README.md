# AI Galaxy

A React, Vite, Tailwind CSS, React Router, and Supabase app for discovering, saving, and comparing AI tools.

## What's included

- Landing page with animated galaxy background, trending tools, categories, and a featured workflow
- AI Tool Directory with 113 tools, search, category filters, pricing filters, saved favorites, and compare actions
- Tool Detail pages with descriptions, use cases, outlooks, pros/cons, alternatives, and tool logos
- Compare page for up to 4 tools side by side
- Find My AI quiz
- AI Workflows
- Dashboard with Supabase-synced saved tools and compare state
- Supabase Auth login, Google OAuth, and verified email registration
- AI News static sample page

Prompt Library, Resume Builder, and Testimonials were removed from the active website.

## Getting started

Do not open the root `index.html` directly. This is a Vite React app, so run the dev server:

```bash
npm install
npm run dev
```

Then open the local URL Vite prints, usually:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

## Supabase setup

The app reads Supabase credentials from `.env`:

```bash
VITE_SUPABASE_URL=https://ovlzfchwneswstziaykh.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run `supabase-schema.sql` in the Supabase SQL editor if the `profiles` table or row-level-security policies are missing.

Enable email confirmations in Supabase Auth so password registrations are not usable until the user clicks the verification link:

- Authentication > Providers > Email > Confirm email: enabled
- Authentication > URL Configuration > Site URL: your deployed site URL
- Authentication > URL Configuration > Redirect URLs: your deployed site URL and local dev URL, for example `http://localhost:5173/login`

Enable Google sign-in in Supabase Auth:

- Authentication > Providers > Google: enabled
- Add your Google OAuth client ID and client secret in the Supabase dashboard.
- In Google Cloud Console, add the callback URL shown by Supabase for the Google provider.

The frontend still only needs these public environment variables:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Do not put the Google client secret in `.env`; keep it only in Supabase.

The `profiles` table is keyed by `auth.users.id` and stores:

- `email`
- `full_name`
- `saved_items`
- `compare_items`
- `updated_at`

After login/register, the app creates or loads the current user's profile row and automatically syncs saved favorites and compare list updates to Supabase.

Visitors can browse and open the first 10 AI tools without an account. Tool 11 and beyond redirect to login/registration.

## Tech

React 19 - Vite - Tailwind CSS v4 - React Router v7 - Supabase Auth and Database
