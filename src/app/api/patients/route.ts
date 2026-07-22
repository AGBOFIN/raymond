import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: patients, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
    }

    return NextResponse.json({ patients: patients || [], total: count || 0, page, limit });
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
    
    const { data, error } = await supabase
      .from('patients')
      .insert({
        first_name: sanitize(first_name),
        last_name: sanitize(last_name),
        date_of_birth: date_of_birth || null,
        phone: sanitize(phone),
        email: email ? sanitize(email) : null,
        address: address ? sanitize(address) : null,
        emergency_contact_name: emergency_contact_name ? sanitize(emergency_contact_name) : null,
        emergency_contact_phone: emergency_contact_phone ? sanitize(emergency_contact_phone) : null,
        medical_history: medical_history ? sanitize(medical_history) : null,
        notes: notes ? sanitize(notes) : null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
