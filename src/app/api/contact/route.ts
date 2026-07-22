import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: sanitize(name),
        phone: phone ? sanitize(phone) : null,
        email: sanitize(email),
        message: sanitize(message)
      });
    
    if (error) {
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
