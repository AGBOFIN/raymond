import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get('approved') === 'true';

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (approvedOnly) {
      query = query.eq('is_approved', true);
    }

    const { data: testimonials } = await query;

    return NextResponse.json(testimonials || []);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
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

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        patient_name: sanitize(patient_name),
        content: sanitize(content),
        rating: rating || 5,
        is_approved: false
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
