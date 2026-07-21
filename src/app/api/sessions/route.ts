import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    let stmt;
    let sessions;

    if (patientId) {
      stmt = db.prepare('SELECT * FROM sessions WHERE patient_id = ? ORDER BY session_date DESC');
      sessions = stmt.all(patientId);
    } else {
      stmt = db.prepare('SELECT s.*, p.first_name, p.last_name FROM sessions s JOIN patients p ON s.patient_id = p.id ORDER BY session_date DESC');
      sessions = stmt.all();
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patient_id,
      session_date,
      session_type,
      status,
      notes,
      price,
      amount_paid,
      payment_status,
      payment_date
    } = body;

    if (!patient_id || !session_date) {
      return NextResponse.json({ error: 'Patient ID and session date are required' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO sessions (patient_id, session_date, session_type, status, notes, price, amount_paid, payment_status, payment_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      patient_id,
      session_date,
      session_type || null,
      status || 'planned',
      notes || null,
      price || 0,
      amount_paid || 0,
      payment_status || 'pending',
      payment_date || null
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
