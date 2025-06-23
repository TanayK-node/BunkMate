
-- Fix the friends table schema
-- First, clear any existing data that might be invalid
DELETE FROM public.friends;

-- Drop the existing foreign key constraint if it exists
ALTER TABLE public.friends DROP CONSTRAINT IF EXISTS friends_friend_id_fkey;

-- Change friend_id from text to uuid
ALTER TABLE public.friends ALTER COLUMN friend_id TYPE uuid USING friend_id::uuid;

-- Add the correct foreign key constraint
ALTER TABLE public.friends ADD CONSTRAINT friends_friend_id_fkey 
    FOREIGN KEY (friend_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also ensure user_id foreign key is correct
ALTER TABLE public.friends DROP CONSTRAINT IF EXISTS friends_user_id_fkey;
ALTER TABLE public.friends ADD CONSTRAINT friends_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
