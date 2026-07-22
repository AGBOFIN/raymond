import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('[LOGIN] Attempt for username:', username);

    if (!username || !password) {
      console.error('[LOGIN] Missing credentials');
      return NextResponse.json({ error: 'Nom d\'utilisateur et mot de passe requis' }, { status: 400 });
    }

    console.log('[LOGIN] Querying Supabase for user...');
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('[LOGIN] Supabase query error:', error);
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 });
    }

    if (!user) {
      console.error('[LOGIN] User not found in database');
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    console.log('[LOGIN] User found, comparing password...');
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      console.error('[LOGIN] Password mismatch');
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    console.log('[LOGIN] Login successful for user:', user.username);
    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('[LOGIN] Unexpected error:', error);
    return NextResponse.json({ error: 'Erreur de connexion' }, { status: 500 });
  }
}
