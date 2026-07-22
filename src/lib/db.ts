import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

// Check if using Supabase or SQLite
const useSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Always initialize SQLite for now (Supabase migration to be done separately)
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'rehab-connect.db');
const db = new Database(dbPath);

// Set UTF-8 encoding
db.pragma('encoding = "UTF-8"');
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      path TEXT NOT NULL,
      category TEXT NOT NULL,
      alt_text TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      session_date DATE NOT NULL,
      session_type TEXT,
      status TEXT NOT NULL DEFAULT 'planned',
      notes TEXT,
      price REAL NOT NULL DEFAULT 0,
      amount_paid REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'pending',
      payment_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      is_approved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_id INTEGER NOT NULL,
      title TEXT,
      description TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
    CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_patient ON sessions(patient_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
    CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
  `);

// Initialize default content
const defaultContent = {
  hero_title: 'Votre santé, notre priorité.',
  hero_subtitle: 'Un cabinet de kinésithérapie professionnelle spécialisé dans la réadaptation fonctionnelle et la rééducation sportive, avec une approche personnalisée pour votre bien-être et votre récupération optimale.',
  therapist_name: 'NYADJO Yao Raymond',
  therapist_title: 'Kinésithérapeute',
  therapist_bio: 'Kinésithérapeute passionné par la réadaptation fonctionnelle et la rééducation sportive. Je m\'engage à accompagner chaque patient vers une récupération optimale grâce à un suivi personnalisé et à des techniques modernes.',
  therapist_education: 'Licence Professionnelle en Sciences de la Santé',
  therapist_mention: 'Réadaptation',
  therapist_school: 'École Nationale des Auxiliaires Médicaux (ENAM)',
  contact_phone: '+228 70 14 11 49',
  contact_whatsapp: '+228 70 14 11 49',
  contact_address: 'LOME,TOGO',
  contact_email: 'nyadjoyaoraymond@gmail.com',
  facebook_url: 'https://facebook.com/rehabconnect',
  instagram_url: 'https://instagram.com/rehabconnect',
  linkedin_url: 'https://linkedin.com/rehabconnect'
};

const stmt = db.prepare('INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)');
Object.entries(defaultContent).forEach(([key, value]) => {
  stmt.run(key, value);
});

// Initialize default services
const defaultServices = [
  { title: 'Réadaptation fonctionnelle', description: 'Programmes personnalisés pour restaurer vos capacités motrices', icon: 'Activity', order_index: 0 },
  { title: 'Rééducation sportive', description: 'Traitement spécialisé pour les athlètes et sportifs', icon: 'HeartPulse', order_index: 1 },
  { title: 'Rééducation post-opératoire', description: 'Suivi adapté après chirurgie pour une récupération optimale', icon: 'Bone', order_index: 2 },
  { title: 'Massages thérapeutiques', description: 'Techniques manuelles pour soulager la douleur et détendre', icon: 'Hand', order_index: 3 }
];

const serviceStmt = db.prepare('INSERT OR IGNORE INTO services (title, description, icon, order_index) VALUES (?, ?, ?, ?)');
defaultServices.forEach(service => {
  serviceStmt.run(service.title, service.description, service.icon, service.order_index);
});

// Initialize admin user (default: admin / admin123)
const passwordHash = bcrypt.hashSync('admin123', 10);
const adminStmt = db.prepare('INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)');
adminStmt.run('admin', passwordHash);

export default db;
export { supabase, useSupabase };
