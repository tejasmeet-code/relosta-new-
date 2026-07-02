Supabase setup
---------------

1. Create a project at https://app.supabase.com and open the project.
2. Go to Settings → API and copy the `Project URL` and `anon` `public` key.
3. In this repo, create a `.env.local` file at the project root with:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

4. Open the SQL editor in Supabase and run the contents of `supabase.schema.sql` to create tables and temporary RLS policies for testing.

5. Install deps and run locally:

```bash
npm install
npm run dev
```

6. For production, remove permissive RLS policies and either:
- create strict RLS rules that only allow safe operations with the anon key, or
- proxy write operations through a server that uses the service role key.
