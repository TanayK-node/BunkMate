
-- First, let's drop and recreate the trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure the generate_unique_id function exists and works
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
