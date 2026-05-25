
-- Public read access to wave-photos
CREATE POLICY "Public read wave-photos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'wave-photos');

-- Block all client-side writes; admin endpoints use service role and bypass RLS
CREATE POLICY "Block client inserts on wave-photos"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Block client updates on wave-photos"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Block client deletes on wave-photos"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (false);
