import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization');
    
    // Check if ADMIN_PASSWORD is set
    const password = process.env.ADMIN_PASSWORD;
    
    // If no password is set, allow access (for development)
    if (!password) {
      return NextResponse.next();
    }
    
    // Check for basic auth
    if (authHeader) {
      const authValue = authHeader.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');
      
      // Username can be anything, just check password
      if (pwd === password) {
        return NextResponse.next();
      }
    }
    
    // Request authentication
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};

