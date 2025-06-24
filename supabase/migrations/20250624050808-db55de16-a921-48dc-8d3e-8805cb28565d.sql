
-- Add RLS policy to allow users to search for other profiles by friend_code
CREATE POLICY "Users can search profiles by friend code" ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    (auth.uid() = id OR friend_code IS NOT NULL)
  );
