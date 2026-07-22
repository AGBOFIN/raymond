import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: session, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !session) {
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

    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (session_date !== undefined) updateData.session_date = session_date;
    if (session_type !== undefined) updateData.session_type = session_type;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (price !== undefined) updateData.price = price;
    if (amount_paid !== undefined) updateData.amount_paid = amount_paid;
    if (payment_status !== undefined) updateData.payment_status = payment_status;
    if (payment_date !== undefined) updateData.payment_date = payment_date;

    const { error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }

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
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
