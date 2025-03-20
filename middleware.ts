
import { NextResponse, NextRequest } from 'next/server';
import { parse } from 'cookie';

export function middleware(req: NextRequest) {
    const cookies = parse(req.headers.get('cookie') || '');  
    const token = cookies.token;
    const role = cookies.role;  

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));  
    }

    const url = req.nextUrl.clone();

    if (role === 'admin') {
        if (url.pathname.startsWith('/courier') || url.pathname.startsWith('/accounting') || url.pathname.startsWith('/coordinator')) {
            return NextResponse.redirect(new URL('/admin', req.url));  
        }
    } else if (role === 'courier') {
        if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/accounting') || url.pathname.startsWith('/coordinator')) {
            return NextResponse.redirect(new URL('/courier/manage-order', req.url));  
        }
    } else if (role === 'accounting') {
        if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/courier') || url.pathname.startsWith('/coordinator')) {
            return NextResponse.redirect(new URL('/accounting', req.url)); 
        }
    } else if (role === 'coordinator') {
        if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/courier') || url.pathname.startsWith('/accounting')) {
            return NextResponse.redirect(new URL('/coordinator', req.url)); 
        }
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: ['/admin/:path*', '/(courier|accounting|coordinator)/:path*'],
};
