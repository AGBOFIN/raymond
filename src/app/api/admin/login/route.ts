import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Nom d\'utilisateur et mot de passe requis' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Erreur de connexion' }, { status: 500 });
  }
}
