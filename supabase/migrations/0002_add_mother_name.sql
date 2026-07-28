-- Migration: Add mother_name column to student profiles
-- This ensures the DB can store both father's and mother's names.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mother_name TEXT;
ALTER TABLE public.student_profiles ADD COLUMN IF NOT EXISTS mother_name TEXT;
