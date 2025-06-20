
-- Add the missing unique_id column to the profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unique_id TEXT UNIQUE;

-- Update existing profiles to have unique IDs if they don't have one
UPDATE profiles 
SET unique_id = generate_unique_id() 
WHERE unique_id IS NULL OR unique_id = '';

-- Make sure unique_id is required going forward
ALTER TABLE profiles ALTER COLUMN unique_id SET NOT NULL;

-- Create the friends table that doesn't exist yet
CREATE TABLE friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_name TEXT,
  unique_id TEXT,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS on friends table
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for friends table
CREATE POLICY "Users can view own friends" ON friends 
  FOR ALL USING (auth.uid() = user_id);
