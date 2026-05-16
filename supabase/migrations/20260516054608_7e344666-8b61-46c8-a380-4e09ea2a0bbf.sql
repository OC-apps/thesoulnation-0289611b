CREATE TABLE public.recruitment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area TEXT NOT NULL,
  nombre_nickname TEXT NOT NULL,
  link_rc TEXT,
  sobre_ti TEXT NOT NULL,
  red_tiktok TEXT,
  red_youtube TEXT,
  red_twitch TEXT,
  red_facebook TEXT,
  red_instagram TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recruitment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a recruitment application"
ON public.recruitment_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);