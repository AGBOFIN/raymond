import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes except the login page
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin/patients') || pathname.startsWith('/admin/sessions') || pathname.startsWith('/admin/images') || pathname.startsWith('/admin/testimonials')) {
    const adminUser = request.cookies.get('adminUser');
    
    if (!adminUser) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/patients/:path*',
    '/admin/sessions/:path*',
    '/admin/images/:path*',
    '/admin/testimonials/:path*',
  ],
};
