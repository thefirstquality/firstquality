import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API routes (except auth login)
  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/auth') {
      return NextResponse.next();
    }
    const hasAdminSession = request.cookies.has('admin_session');
    if (!hasAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect admin pages
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const hasAdminSession = request.cookies.has('admin_session');

    // If attempting to access admin dashboard without session, redirect to login
    if (!hasAdminSession && !isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // If authenticated user visits login page, redirect to dashboard
    if (hasAdminSession && isLoginPage) {
      const dashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
