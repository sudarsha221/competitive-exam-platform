# Teacher invitations

## Database

Apply `supabase/migrations/0002_admin_provision_teacher.sql` after the initial schema. It adds an authenticated-Admin-only provisioning function; it does not change or disable existing RLS policies.

## Application URL

Set the server-only `APP_BASE_URL` environment variable to the canonical application origin, for example `https://app.example.com`. For local development, use `http://localhost:3000`. Do not add a `NEXT_PUBLIC_` prefix to service-role credentials.

## Supabase Auth dashboard

In **Authentication → URL Configuration**:

- Set **Site URL** to the canonical application origin.
- Add the exact invitation callback path to **Redirect URLs**, for example `https://app.example.com/auth/invite` and, for local development, `http://localhost:3000/auth/invite`.

In **Authentication → Providers → Email**:

- Enable email authentication and verify the project’s email delivery configuration.
- Configure custom SMTP with a verified sender/domain and production-appropriate rate limits; do not assume the default test mailer is suitable for production.
- Set the **Invite user** email template link to `<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=invite">Accept invitation</a>`. This uses the one-time invite token hash with the installed client’s `verifyOtp({ type: "invite" })` flow; do not use a raw token or the generic confirmation URL for this callback.

The invitation uses Supabase Auth’s admin invite API and redirects to `/auth/invite`. The existing browser client uses `@supabase/supabase-js` with PKCE; the invite callback verifies the one-time token hash directly, then requires a teacher role/profile before allowing password setup. The common login page remains the sign-in entry point.
