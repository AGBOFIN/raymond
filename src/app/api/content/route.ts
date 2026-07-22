import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: content } = await supabase
      .from('site_content')
      .select('key, value');
    
    const contentObj = content?.reduce((acc: Record<string, string>, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {}) || {};
    
    return NextResponse.json(contentObj, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({}, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;
    
    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('site_content')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);
    
    if (error) {
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
