import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let stmt;
    let patients;

    if (search) {
      stmt = db.prepare(`
        SELECT * FROM patients 
        WHERE first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? OR email LIKE ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `);
      const searchPattern = `%${search}%`;
      patients = stmt.all(searchPattern, searchPattern, searchPattern, searchPattern, limit, offset);
    } else {
      stmt = db.prepare('SELECT * FROM patients ORDER BY created_at DESC LIMIT ? OFFSET ?');
      patients = stmt.all(limit, offset);
    }

    // Get total count
    let countStmt;
    let total;
    if (search) {
      countStmt = db.prepare(`
        SELECT COUNT(*) as count FROM patients 
        WHERE first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? OR email LIKE ?
      `);
      const searchPattern = `%${search}%`;
      const countResult = countStmt.get(searchPattern, searchPattern, searchPattern, searchPattern) as any;
      total = countResult.count;
    } else {
      countStmt = db.prepare('SELECT COUNT(*) as count FROM patients');
      const countResult = countStmt.get() as any;
      total = countResult.count;
    }

    return NextResponse.json({ patients, total, page, limit });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      date_of_birth,
      phone,
      email,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      medical_history,
      notes
    } = body;

    if (!first_name || !last_name || !phone) {
      return NextResponse.json({ error: 'First name, last name, and phone are required' }, { status: 400 });
    }

    // Validate phone format (basic validation)
    if (!/^\+?[\d\s-]{8,}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Sanitize inputs to prevent XSS
    const sanitize = (input: string) => input.replace(/[<>]/g, '');
    
    const stmt = db.prepare(`
      INSERT INTO patients (first_name, last_name, date_of_birth, phone, email, address, emergency_contact_name, emergency_contact_phone, medical_history, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      sanitize(first_name),
      sanitize(last_name),
      date_of_birth || null,
      sanitize(phone),
      email ? sanitize(email) : null,
      address ? sanitize(address) : null,
      emergency_contact_name ? sanitize(emergency_contact_name) : null,
      emergency_contact_phone ? sanitize(emergency_contact_phone) : null,
      medical_history ? sanitize(medical_history) : null,
      notes ? sanitize(notes) : null
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
