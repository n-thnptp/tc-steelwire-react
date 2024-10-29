import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        // Match all paths except API routes and static files
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

export async function middleware(request) {
    const sessionId = request.cookies.get("sessionId")?.value;
    
    if (!sessionId) {
        return NextResponse.next();
    }

    try {
        // Get the base URL from the request
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        // Call the validation API endpoint
        const response = await fetch(`${baseUrl}/api/auth/validate`, {
            headers: {
                'Cookie': `sessionId=${sessionId}`,
            },
        });

        if (!response.ok) {
            return NextResponse.next();
        }

        const data = await response.json();
        const nextResponse = NextResponse.next();
        
        // Set the user data in the header
        nextResponse.headers.set('x-user', JSON.stringify(data.user));
        return nextResponse;
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.next();
    }
}