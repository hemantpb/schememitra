-- SchemeMitra PostgreSQL Schema Migration for Supabase

-- 1. Schemes Table
CREATE TABLE IF NOT EXISTS public.schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  ministry TEXT NOT NULL,
  department TEXT,
  description TEXT NOT NULL,
  sectors TEXT[] NOT NULL,
  sub_sectors TEXT[],
  states TEXT[] NOT NULL,
  scheme_type TEXT NOT NULL,
  objectives TEXT[] NOT NULL,
  benefit_summary TEXT NOT NULL,
  benefit_amount TEXT,
  beneficiary TEXT,
  enterprise_sizes TEXT[] NOT NULL,
  business_stages TEXT[],
  required_registrations TEXT[],
  documents TEXT[] NOT NULL,
  application_steps TEXT[] NOT NULL,
  application_url TEXT NOT NULL,
  official_source_url TEXT NOT NULL,
  guideline_url TEXT,
  last_verified_at DATE NOT NULL DEFAULT CURRENT_DATE,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Eligibility Rules Table
CREATE TABLE IF NOT EXISTS public.eligibility_rules (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  scheme_id TEXT REFERENCES public.schemes(id) ON DELETE CASCADE,
  field TEXT NOT NULL,
  operator TEXT NOT NULL,
  value JSONB NOT NULL,
  weight INTEGER NOT NULL DEFAULT 10,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Scheme Sources Audit Table
CREATE TABLE IF NOT EXISTS public.scheme_sources (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  scheme_id TEXT REFERENCES public.schemes(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  document_url TEXT,
  last_verified_at DATE NOT NULL DEFAULT CURRENT_DATE,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector TEXT,
  state TEXT,
  district TEXT,
  enterprise_size TEXT,
  annual_turnover NUMERIC,
  employee_count INTEGER,
  business_age INTEGER,
  registrations TEXT[],
  objectives TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to schemes
CREATE POLICY "Allow public read access to schemes" ON public.schemes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to eligibility rules" ON public.eligibility_rules FOR SELECT USING (true);
CREATE POLICY "Allow public read access to sources" ON public.scheme_sources FOR SELECT USING (true);
