# How to Enable "Sign in with Google"

To make the Login page work, you need to configure Supabase and Google Cloud.

## 1. Supabase Credentials
You need to add the following to `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

You can find these in **Supabase Dashboard** -> **Settings (Cog Icon)** -> **API**.

## 2. Google OAuth Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Project (or use an existing one).
3. Go to **APIs & Services** -> **OAuth consent screen**.
   - Select **External**.
   - Fill in the App Name ("FormSync AI") and support email.
4. Go to **Credentials** -> **Create Credentials** -> **OAuth Client ID**.
   - Application type: **Web application**.
   - Name: `Supabase Auth`.
   - **Authorized JavaScript origins**: `https://<your-project>.supabase.co` (See Supabase -> Auth -> Providers -> Google for exact URL).
   - **Authorized redirect URIs**: `https://<your-project>.supabase.co/auth/v1/callback`.
5. Copy the **Client ID** and **Client Secret**.

## 3. Enable in Supabase
1. Go to **Supabase Dashboard** -> **Authentication** -> **Providers**.
2. Select **Google**.
3. Toggle "Enable Google".
4. Paste the **Client ID** and **Client Secret** from the previous step.
5. Click **Save**.

## 4. Test It
1. Restart your frontend server (`npm run dev` in `apps/web` or restart `run_lite.sh`).
2. Go to `http://localhost:3000/login`.
3. Click "Sign in with Google".
