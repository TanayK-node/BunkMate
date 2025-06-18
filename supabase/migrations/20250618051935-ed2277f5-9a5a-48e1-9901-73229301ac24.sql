
-- Add unique_id column to profiles table
ALTER TABLE profiles ADD COLUMN unique_id TEXT UNIQUE;

-- Create friends table
CREATE TABLE friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_name TEXT,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Enable RLS on friends table
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for friends table
CREATE POLICY "Users can view own friends" ON friends 
  FOR ALL USING (auth.uid() = user_id);

-- Function to generate unique 5-digit ID
CREATE OR REPLACE FUNCTION generate_unique_id() 
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  id_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 5-digit number
    new_id := LPAD((RANDOM() * 99999)::INTEGER::TEXT, 5, '0');
    
    -- Check if this ID already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE unique_id = new_id) INTO id_exists;
    
    -- If ID doesn't exist, we can use it
    IF NOT id_exists THEN
      RETURN new_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles to have unique IDs
UPDATE profiles 
SET unique_id = generate_unique_id() 
WHERE unique_id IS NULL;

-- Update the handle_new_user function to include unique_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, unique_id)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', generate_unique_id());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
