-- Migration: Add linkedin_url to site_settings table
-- Execute this script in your Supabase SQL Editor if not already applied

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT 'https://linkedin.com/company/firstquality';
