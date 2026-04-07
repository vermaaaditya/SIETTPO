# SIET TPO Website

Official Training & Placement Office website for **State Institute of Engineering & Technology (SIET), Panchkula**.

## Overview

This is a React + Vite web app for the SIET Training & Placement Cell.  
It presents recruiter-focused information, student-facing pages, event galleries, and downloadable policy documents.

## Key Features

- Home page with SIET branding and placement highlights
- Recruiter-facing brochure and policy document pages
- Code of Conduct, Declaration, and Resume Template PDF previews/downloads
- Event gallery section
- Bilingual interface (English/Hindi)
- Student login interface (UI flow)
- Student auth integration with Supabase (email/password)
- Student profile persistence in `public.profiles`

## Tech Stack

- React
- Vite
- React Router
- Firebase (configured scaffold)
- Supabase (auth + database)

## Run Locally

```bash
npm install
npm run dev
```

Create local env:

```bash
cp .env.example .env.local
```

Build:

```bash
npm run build
```

## Project Structure

```text
SIETTPO/
├── public/          # Static assets (images, PDFs)
├── supabase/        # SQL migrations for backend foundation
├── src/
│   ├── components/  # UI and section components
│   ├── contexts/    # Language context
│   ├── pages/       # Route pages
│   ├── styles/      # Global styles
│   ├── App.jsx      # Route definitions
│   └── translations.js
├── index.html
└── package.json
```

## Supabase Backend Foundation (PR1)

This repository includes the first Supabase backend foundation for:

- Student account profile storage (insiders)
- Recruitment inquiry storage from outsider recruiters
- Future-ready role model with `tpo_admin`

Included files:

- `supabase/migrations/0001_initial_schema.sql` (schema + RLS policies)
- `supabase/README.md` (how to apply migration)
- `.env.example` (frontend env contract)

Required frontend env keys:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Vercel + Supabase `.env` setup (for proper integration)

1. In Supabase Dashboard → **Project Settings** → **API**, copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
2. In Vercel Dashboard → your project → **Settings** → **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon public key
3. Select environments where needed (`Production`, `Preview`, `Development`) and save.
4. Redeploy the Vercel project so the new variables are applied.
5. (Important) In Supabase Auth settings, add your Vercel domain to:
   - **Site URL**
   - **Redirect URLs** (include preview URL pattern if used)

## Contributors

This project was worked on by **Manish, Nishith, Rishabh, Heemanshu, and Aaditya Verma**.
