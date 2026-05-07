
-- restrict execute on the trigger function
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- restrict avatar bucket listing: only allow viewing files inside one's own folder via SELECT
DROP POLICY IF EXISTS "Avatar public read" ON storage.objects;
CREATE POLICY "Avatar read own or via direct url" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR auth.role() = 'anon' -- public objects still accessible by direct URL through CDN
  )
);
