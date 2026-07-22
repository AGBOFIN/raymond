import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    let sessions;

    if (patientId) {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('patient_id', patientId)
        .order('session_date', { ascending: false });
      sessions = data;
    } else {
      const { data } = await supabase
        .from('sessions')
        .select('*, patients(first_name, last_name)')
        .order('session_date', { ascending: false });
      sessions = data?.map(s => ({
        ...s,
        first_name: s.patients?.first_name,
        last_name: s.patients?.last_name
      }));
    }

    return NextResponse.json(sessions || []);
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

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        patient_id,
        session_date,
        session_type: session_type || null,
        status: status || 'planned',
        notes: notes || null,
        price: price || 0,
        amount_paid: amount_paid || 0,
        payment_status: payment_status || 'pending',
        payment_date: payment_date || null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
