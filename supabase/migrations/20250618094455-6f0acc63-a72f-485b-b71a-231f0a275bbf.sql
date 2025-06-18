
-- First, create the generate_unique_id function that's missing
CREATE OR REPLACE FUNCTION generate_unique_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    id_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 5-digit number (10000-99999)
        new_id := LPAD((RANDOM() * 89999 + 10000)::INTEGER::TEXT, 5, '0');
        
        -- Check if ID already exists
        SELECT EXISTS(SELECT 1 FROM profiles WHERE unique_id = new_id) INTO id_exists;
        
        -- Exit loop if ID is unique
        IF NOT id_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger function for assigning unique IDs
CREATE OR REPLACE FUNCTION assign_unique_id_to_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Assign unique ID if not already set
    IF NEW.unique_id IS NULL OR NEW.unique_id = '' THEN
        NEW.unique_id := generate_unique_id();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires before INSERT on profiles
DROP TRIGGER IF EXISTS trigger_assign_unique_id ON profiles;
CREATE TRIGGER trigger_assign_unique_id
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_unique_id_to_new_user();

-- Update the handle_new_user function to work properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  -- unique_id will be auto-assigned by the trigger_assign_unique_id trigger
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
