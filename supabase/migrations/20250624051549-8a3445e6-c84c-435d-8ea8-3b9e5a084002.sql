
-- Add custom_name column to friends table for user-specific nicknames
ALTER TABLE friends ADD COLUMN custom_name TEXT;

-- Update the existing RLS policy to include custom_name updates
CREATE POLICY "Users can update friends custom names" ON friends 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
