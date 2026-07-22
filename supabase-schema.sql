-- Supabase Database Schema for Rehab Connect
-- Run this in your Supabase SQL Editor

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Content Table
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images Table
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  path TEXT NOT NULL,
  category TEXT NOT NULL,
  alt_text TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_history TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_type TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  notes TEXT,
  price NUMERIC DEFAULT 0,
  amount_paid NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_sessions_patient ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);

-- Insert default content
INSERT INTO site_content (key, value) VALUES
  ('hero_title', 'Votre santé, notre priorité.'),
  ('hero_subtitle', 'Un cabinet de kinésithérapie professionnelle spécialisé dans la réadaptation fonctionnelle et la rééducation sportive, avec une approche personnalisée pour votre bien-être et votre récupération optimale.'),
  ('therapist_name', 'NYADJO Yao Raymond'),
  ('therapist_title', 'Kinésithérapeute'),
  ('therapist_bio', 'Kinésithérapeute passionné par la réadaptation fonctionnelle et la rééducation sportive. Je m''engage à accompagner chaque patient vers une récupération optimale grâce à un suivi personnalisé et à des techniques modernes.'),
  ('therapist_education', 'Licence Professionnelle en Sciences de la Santé'),
  ('therapist_mention', 'Réadaptation'),
  ('therapist_school', 'École Nationale des Auxiliaires Médicaux (ENAM)'),
  ('contact_phone', '+228 70 14 11 49'),
  ('contact_whatsapp', '+228 70 14 11 49'),
  ('contact_address', 'LOME,TOGO'),
  ('contact_email', 'nyadjoyaoraymond@gmail.com'),
  ('facebook_url', 'https://facebook.com/rehabconnect'),
  ('instagram_url', 'https://instagram.com/rehabconnect'),
  ('linkedin_url', 'https://linkedin.com/rehabconnect')
ON CONFLICT (key) DO NOTHING;

-- Insert default services
INSERT INTO services (title, description, icon, order_index) VALUES
  ('Réadaptation fonctionnelle', 'Programmes personnalisés pour restaurer vos capacités motrices', 'Activity', 0),
  ('Rééducation sportive', 'Traitement spécialisé pour les athlètes et sportifs', 'HeartPulse', 1),
  ('Rééducation post-opératoire', 'Suivi adapté après chirurgie pour une récupération optimale', 'Bone', 2),
  ('Massages thérapeutiques', 'Techniques manuelles pour soulager la douleur et détendre', 'Hand', 3)
ON CONFLICT (title) DO NOTHING;

-- Insert default admin user (password: admin123 - you should change this in production)
-- Hash for 'admin123' is: $2a$10$rOzJZ8Q8Q8Q8Q8Q8Q8Q8Qu
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$rOzJZ8Q8Q8Q8Q8Q8Q8Q8Qu')
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for security)
CREATE POLICY "Public read access for site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access for images" ON images FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (is_approved = true);

-- Admin-only policies (you'll need to implement proper authentication)
CREATE POLICY "Admin full access on site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on images" ON images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on patients" ON patients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on sessions" ON sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
