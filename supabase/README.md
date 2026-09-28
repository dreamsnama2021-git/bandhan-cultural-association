# Supabase

Database schema for Bandhan Cultural Association (members, family members,
sign-up trigger, RLS policies).

- `migrations/` – SQL applied to the Supabase project. Run in the SQL Editor
  (or `supabase db push`) on a new project.
- Project keys are NOT stored here. See `../.env.example`.
- Auth settings (Site URL, redirect URLs, SMTP) are configured in the Supabase dashboard.
