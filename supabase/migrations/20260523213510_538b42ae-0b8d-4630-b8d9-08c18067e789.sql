CREATE TABLE public.live_status (
  member_id TEXT PRIMARY KEY,
  is_live BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.live_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read live status"
ON public.live_status FOR SELECT
TO anon, authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.live_status;