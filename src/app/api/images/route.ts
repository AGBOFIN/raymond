import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let stmt;
    if (category) {
      stmt = db.prepare('SELECT * FROM images WHERE category = ? ORDER BY order_index');
      const images = stmt.all(category);
      return NextResponse.json(images);
    } else {
      stmt = db.prepare('SELECT * FROM images ORDER BY category, order_index');
      const images = stmt.all();
      return NextResponse.json(images);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
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
    const stmt = db.prepare(
      'INSERT INTO images (filename, original_name, path, category, alt_text, order_index) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(filename, file.name, relativePath, category, altText || null, parseInt(orderIndex) || 0);

    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid,
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

    const stmt = db.prepare(
      'UPDATE images SET alt_text = COALESCE(?, alt_text), order_index = COALESCE(?, order_index), category = COALESCE(?, category) WHERE id = ?'
    );
    stmt.run(altText, orderIndex, category, id);

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
    const stmt = db.prepare('SELECT * FROM images WHERE id = ?');
    const image = stmt.get(id) as any;

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from database
    const deleteStmt = db.prepare('DELETE FROM images WHERE id = ?');
    deleteStmt.run(id);

    // Delete file from disk
    const filepath = path.join(process.cwd(), 'public', image.path);
    try {
      const { unlink } = await import('fs/promises');
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue even if file deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
