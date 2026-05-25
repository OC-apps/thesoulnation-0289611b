
CREATE TABLE public.waves_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  redes text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  photo_url text NOT NULL,
  social_label text,
  social_href text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.waves_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read waves members"
ON public.waves_members FOR SELECT TO anon, authenticated
USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.waves_members;

INSERT INTO storage.buckets (id, name, public)
VALUES ('wave-photos', 'wave-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "wave photos public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'wave-photos');
