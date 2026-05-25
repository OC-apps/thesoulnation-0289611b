CREATE TABLE public.waves_socials (
  name text PRIMARY KEY,
  tiktok_url text,
  twitch_url text,
  youtube_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waves_socials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read waves socials"
ON public.waves_socials FOR SELECT
TO anon, authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.waves_socials;