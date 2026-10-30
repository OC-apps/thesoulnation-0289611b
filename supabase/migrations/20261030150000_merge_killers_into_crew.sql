BEGIN;
-- Preserve the existing Crew row when a nickname belongs to both divisions.
DELETE FROM public.roster_members k
USING public.roster_members c
WHERE k.category = 'killers' AND c.category = 'crew'
AND upper(trim(k.nickname)) = upper(trim(c.nickname));
WITH moved AS (
  SELECT id, row_number() OVER (ORDER BY sort_order, created_at, id) AS position
  FROM public.roster_members WHERE category = 'killers'
), offset_value AS (
  SELECT coalesce(max(sort_order), 0) AS value FROM public.roster_members WHERE category = 'crew'
)
UPDATE public.roster_members r
SET category = 'crew', sort_order = (m.position + o.value)::integer
FROM moved m, offset_value o WHERE r.id = m.id;
COMMIT;
