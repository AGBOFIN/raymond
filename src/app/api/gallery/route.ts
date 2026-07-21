import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const stmt = db.prepare(`
      SELECT g.*, i.filename, i.path, i.alt_text 
      FROM gallery g 
      JOIN images i ON g.image_id = i.id 
      ORDER BY g.order_index
    `);
    const gallery = stmt.all();

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_id, title, description, order_index } = body;

    if (!image_id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO gallery (image_id, title, description, order_index) VALUES (?, ?, ?, ?)');
    const result = stmt.run(image_id, title || null, description || null, order_index || 0);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding to gallery:', error);
    return NextResponse.json({ error: 'Failed to add to gallery' }, { status: 500 });
  }
}
