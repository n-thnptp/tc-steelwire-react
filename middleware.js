// middleware.js
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
    '/login',
    '/signup',
    '/api',
    '/_next/static',
    '/_next/image',
    '/favicon.ico'
];

// Define routes that require authentication
const protectedRoutes = [
    '/order',
    '/purchase',
    '/status',
    '/history',
    '/profile',
    '/location'
];

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const sessionId = request.cookies.get("sessionId")?.value;

    // Allow access to public routes without authentication
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        // If user is authenticated and tries to access login/signup, redirect to home
        if (sessionId && (pathname === '/login' || pathname === '/signup')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // For protected routes, check authentication
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!sessionId) {
            // Redirect to login with return URL
            const url = new URL('/login', request.url);
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }

        try {
            // Get the base URL from the request
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const baseUrl = `${protocol}://${host}`;

            // Validate session
            const response = await fetch(`${baseUrl}/api/auth/validate`, {
                headers: {
                    'Cookie': `sessionId=${sessionId}`,
                },
            });

            if (!response.ok) {
                // Clear invalid session and redirect to login
                const url = new URL('/login', request.url);
                url.searchParams.set('from', pathname);
                const redirectResponse = NextResponse.redirect(url);
                redirectResponse.cookies.delete('sessionId');
                return redirectResponse;
            }

            // Session is valid, get user data
            const data = await response.json();
            const user = data.user;
            console.log(user);
            // Check if the user is an admin
            if (user.role === 'admin' && !pathname.startsWith('/manager')) {
                // Redirect admin to manager order page
                return NextResponse.redirect(new URL('/manager/customer-order', request.url));
            }

            // Session is valid, proceed with user data in headers
            const nextResponse = NextResponse.next();
            nextResponse.headers.set('x-user', JSON.stringify(user));
            return nextResponse;
        } catch (error) {
            console.error('Middleware error:', error);
            // On error, redirect to login
            const url = new URL('/login', request.url);
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }
    }

    // For all other routes, proceed normally
    return NextResponse.next();
}
