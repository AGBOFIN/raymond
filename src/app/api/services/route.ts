import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .order('order_index');
    
    return NextResponse.json(services || [], {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json([], {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, icon, order_index } = body;
    
    if (!title || !icon) {
      return NextResponse.json({ error: 'Title and icon are required' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('services')
      .insert({ title, description, icon, order_index: order_index || 0 })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, icon, order_index } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('services')
      .update({ title, description, icon, order_index, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
