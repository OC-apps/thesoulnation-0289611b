-- Revoke any direct SELECT grants from anon/authenticated roles
REVOKE SELECT ON public.recruitment_submissions FROM anon, authenticated;

-- Explicit deny SELECT policy (defense in depth)
DROP POLICY IF EXISTS "deny all reads on recruitment_submissions" ON public.recruitment_submissions;
CREATE POLICY "deny all reads on recruitment_submissions"
ON public.recruitment_submissions
FOR SELECT
TO anon, authenticated
USING (false);
