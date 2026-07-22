import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approved') === 'true';

    let stmt;
    if (approvedOnly) {
      stmt = db.prepare('SELECT * FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC');
    } else {
      stmt = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC');
    }
    const testimonials = stmt.all();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // Return empty array instead of error to prevent crashes
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient_name, content, rating } = body;

    if (!patient_name || !content) {
      return NextResponse.json({ error: 'Patient name and content are required' }, { status: 400 });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Sanitize inputs to prevent XSS
    const sanitize = (input: string) => input.replace(/[<>]/g, '');

    const stmt = db.prepare('INSERT INTO testimonials (patient_name, content, rating, is_approved) VALUES (?, ?, ?, 0)');
    const result = stmt.run(sanitize(patient_name), sanitize(content), rating || 5);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
