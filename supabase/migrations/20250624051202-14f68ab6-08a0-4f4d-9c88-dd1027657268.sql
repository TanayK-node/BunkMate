
-- Add RLS policy to allow users to view subjects of their friends
CREATE POLICY "Users can view friends subjects" ON public.subjects 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.friends 
      WHERE friends.user_id = auth.uid() 
      AND friends.friend_id = subjects.user_id 
      AND friends.status = 'accepted'
    )
  );
