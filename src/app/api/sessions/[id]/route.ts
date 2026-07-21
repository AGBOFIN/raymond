import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
    const session = stmt.get(id) as any;

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      session_date,
      session_type,
      status,
      notes,
      price,
      amount_paid,
      payment_status,
      payment_date
    } = body;

    const stmt = db.prepare(`
      UPDATE sessions 
      SET session_date = COALESCE(?, session_date), 
          session_type = COALESCE(?, session_type), 
          status = COALESCE(?, status), 
          notes = COALESCE(?, notes), 
          price = COALESCE(?, price), 
          amount_paid = COALESCE(?, amount_paid), 
          payment_status = COALESCE(?, payment_status), 
          payment_date = COALESCE(?, payment_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(
      session_date,
      session_type,
      status,
      notes,
      price,
      amount_paid,
      payment_status,
      payment_date,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
