
-- Add friend_code column to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS friend_code VARCHAR(5) UNIQUE;

-- Create the friends table
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, friend_id)
);

-- Create index for friend_code lookups
CREATE INDEX IF NOT EXISTS idx_profiles_friend_code ON public.profiles(friend_code);

-- Create function to generate unique 5-digit friend codes
CREATE OR REPLACE FUNCTION generate_friend_code() RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 5-digit number
        new_code := LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
        
        -- Check if this code already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE friend_code = new_code) INTO code_exists;
        
        -- If it doesn't exist, we can use it
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-assign friend_code for new profiles
CREATE OR REPLACE FUNCTION assign_friend_code() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.friend_code IS NULL OR NEW.friend_code = '' THEN
        NEW.friend_code := generate_friend_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS auto_assign_friend_code ON public.profiles;
CREATE TRIGGER auto_assign_friend_code
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_friend_code();

-- Update existing profiles without friend_code
UPDATE public.profiles 
SET friend_code = generate_friend_code() 
WHERE friend_code IS NULL OR friend_code = '';

-- Make friend_code required
ALTER TABLE public.profiles ALTER COLUMN friend_code SET NOT NULL;

-- Enable RLS on friends table
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for friends table
DROP POLICY IF EXISTS "Users can manage their own friends" ON public.friends;
CREATE POLICY "Users can manage their own friends" ON public.friends 
  FOR ALL USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friends TO authenticated;
