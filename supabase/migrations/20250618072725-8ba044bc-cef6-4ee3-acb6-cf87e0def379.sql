
-- First, let's check and fix the profiles table structure
-- Add the missing unique_id column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unique_id TEXT UNIQUE;

-- Ensure RLS policies exist for the profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;  
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix the generate_unique_id function
CREATE OR REPLACE FUNCTION public.generate_unique_id()
RETURNS text
LANGUAGE plpgsql
AS $$
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
$$;

-- Drop and recreate the trigger function with proper error handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add some logging to help debug
  RAISE LOG 'Creating profile for user: %', NEW.id;
  
  INSERT INTO public.profiles (id, email, full_name, unique_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 
    generate_unique_id()
  );
  
  RAISE LOG 'Profile created successfully for user: %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RAISE;
END;
$$;

-- Create the trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
