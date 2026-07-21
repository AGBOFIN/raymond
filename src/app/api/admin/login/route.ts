import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('Login attempt for username:', username);
    
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json({ error: 'Nom d\'utilisateur et mot de passe requis' }, { status: 400 });
    }
    
    const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?');
    const user = stmt.get(username) as any;
    
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }
    
    console.log('Comparing password with hash...');
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }
    
    console.log('Login successful for user:', user.username);
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, username: user.username } 
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Erreur de connexion' }, { status: 500 });
  }
}
