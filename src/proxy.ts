import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect admin routes except login page
  if (path.startsWith('/admin/dashboard') || path.startsWith('/admin/api')) {
    const adminUser = request.cookies.get('adminUser');
    
    if (!adminUser) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
