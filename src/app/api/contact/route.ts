import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Sanitize inputs to prevent XSS
    const sanitize = (input: string) => input.replace(/[<>]/g, '');
    
    const stmt = db.prepare('INSERT INTO contact_messages (name, phone, email, message) VALUES (?, ?, ?, ?)');
    stmt.run(sanitize(name), phone ? sanitize(phone) : null, sanitize(email), sanitize(message));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
