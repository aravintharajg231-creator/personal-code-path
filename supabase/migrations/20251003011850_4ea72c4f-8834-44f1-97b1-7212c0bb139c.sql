-- Phase 1: Critical Database Schema Fixes

-- Step 1: Update existing NULL values before making columns non-nullable
-- Delete orphaned user_progress records without user_id or lesson_id
DELETE FROM public.user_progress WHERE user_id IS NULL OR lesson_id IS NULL;

-- Delete orphaned lessons without language_id (if any)
DELETE FROM public.lessons WHERE language_id IS NULL;

-- Step 2: Make foreign keys non-nullable
ALTER TABLE public.user_progress 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN lesson_id SET NOT NULL;

ALTER TABLE public.lessons 
  ALTER COLUMN language_id SET NOT NULL;

-- Step 3: Add missing RLS policies

-- INSERT policy for profiles (for edge cases like admin creation)
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- DELETE policies for proper data lifecycle management (GDPR compliance)
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

CREATE POLICY "Users can delete their own stats"
ON public.user_stats
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON public.user_progress
FOR DELETE
USING (auth.uid() = user_id);