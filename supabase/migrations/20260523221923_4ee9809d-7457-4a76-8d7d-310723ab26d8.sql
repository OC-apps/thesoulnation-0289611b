CREATE TYPE public.roster_category AS ENUM ('crew', 'legends', 'killers');

CREATE TABLE public.roster_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  category public.roster_category NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category, nickname)
);

CREATE INDEX idx_roster_members_category_sort ON public.roster_members (category, sort_order, created_at);

ALTER TABLE public.roster_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read roster members"
  ON public.roster_members FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.roster_members;

INSERT INTO public.roster_members (nickname, category, sort_order) VALUES
  ('SOUL MORTAAL', 'killers', 1),
  ('SOUL GALLARD', 'killers', 2),
  ('SOUL RAPID', 'killers', 3),
  ('SOUL SANTHY', 'killers', 4),
  ('SOUL SLADE X', 'killers', 5),
  ('SOUL DIABOLI', 'killers', 6),
  ('SOUL YARBIZ', 'legends', 1),
  ('SOUL MORTAL', 'legends', 2),
  ('SOUL CREED', 'legends', 3),
  ('SOUL EXTRURS', 'legends', 4),
  ('SOUL VELFI', 'crew', 1),
  ('SOUL VOLCANO', 'crew', 2),
  ('SOUL XANS', 'crew', 3),
  ('SOUL PEYERZ', 'crew', 4),
  ('SOUL PAKAL', 'crew', 5),
  ('SOUL BOUNSS', 'crew', 6),
  ('SOUL GHOOST', 'crew', 7),
  ('SOUL NEXUS Z', 'crew', 8),
  ('SOUL XCENFE', 'crew', 9),
  ('SOUL CASTERIZE', 'crew', 10),
  ('SOUL ADVERSL', 'crew', 11),
  ('SOUL ZAINT', 'crew', 13),
  ('SOUL ARID', 'crew', 14),
  ('SOUL RAVENANT', 'crew', 15),
  ('SOUL NOIRR', 'crew', 16);