import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('images')
      .select('*')
      .order('category, order_index');

    if (category) {
      query = query.eq('category', category);
    }

    const { data: images } = await query;
    return NextResponse.json(images || []);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const altText = formData.get('altText') as string;
    const orderIndex = formData.get('orderIndex') as string;

    if (!file || !category) {
      return NextResponse.json({ error: 'File and category are required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed' }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const relativePath = `/uploads/${category}/${filename}`;
    const { data, error } = await supabase
      .from('images')
      .insert({
        filename,
        original_name: file.name,
        path: relativePath,
        category,
        alt_text: altText || null,
        order_index: parseInt(orderIndex) || 0
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      id: data.id,
      path: relativePath 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, altText, orderIndex, category } = body;

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (altText !== undefined) updateData.alt_text = altText;
    if (orderIndex !== undefined) updateData.order_index = orderIndex;
    if (category !== undefined) updateData.category = category;

    const { error } = await supabase
      .from('images')
      .update(updateData)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    // Get image info before deleting
    const { data: image } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from database
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }

    // Delete file from disk
    const filepath = path.join(process.cwd(), 'public', image.path);
    try {
      const { unlink } = await import('fs/promises');
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
