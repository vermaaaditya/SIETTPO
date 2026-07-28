-- Migration 0003: Add required_skills column to recruitment_inquiries
alter table public.recruitment_inquiries 
add column if not exists required_skills text[] not null default '{}';
