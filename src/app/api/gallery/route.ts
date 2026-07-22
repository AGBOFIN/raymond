import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: gallery } = await supabase
      .from('gallery')
      .select('*, images(filename, path, alt_text)')
      .order('order_index');

    return NextResponse.json(gallery || []);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_id, title, description, order_index } = body;

    if (!image_id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert({
        image_id,
        title: title || null,
        description: description || null,
        order_index: order_index || 0
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to add to gallery' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error adding to gallery:', error);
    return NextResponse.json({ error: 'Failed to add to gallery' }, { status: 500 });
  }
}
