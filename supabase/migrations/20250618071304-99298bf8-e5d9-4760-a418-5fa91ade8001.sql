
-- Recreate the generate_unique_id function to fix the signup error
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

-- Update the handle_new_user function to ensure it works correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, unique_id)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', generate_unique_id());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing profiles that might not have unique_id set
UPDATE profiles 
SET unique_id = generate_unique_id() 
WHERE unique_id IS NULL;
