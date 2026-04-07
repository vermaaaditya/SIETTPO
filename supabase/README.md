# Supabase setup (PR1)

This folder contains the PR1 backend foundation for:

- Student login/registration data model (`public.profiles`)
- Recruiter outsider form submissions (`public.recruitment_inquiries`)
- Future role support (`student`, `tpo_admin`)

## Apply migration

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase dashboard.
3. Run the SQL from:

`supabase/migrations/0001_initial_schema.sql`

## Notes

- RLS is enabled on both tables.
- Public form submission is allowed through insert policy on `recruitment_inquiries`.
- Admin-only read/update/delete is gated by JWT claim `role = tpo_admin`.
- Student profiles are self-service by `auth.uid() = profiles.id`.
