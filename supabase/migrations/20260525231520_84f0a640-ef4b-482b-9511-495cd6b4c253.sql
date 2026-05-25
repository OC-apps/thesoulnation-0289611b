CREATE TABLE public.waves_hidden (
  name text PRIMARY KEY,
  hidden_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waves_hidden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read waves hidden"
ON public.waves_hidden FOR SELECT
TO anon, authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.waves_hidden;