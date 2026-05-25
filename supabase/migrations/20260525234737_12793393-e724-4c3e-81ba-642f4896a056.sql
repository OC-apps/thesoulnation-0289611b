ALTER TABLE public.waves_socials
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS redes text;