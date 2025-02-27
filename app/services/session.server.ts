import { createCookieSessionStorage } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: '__session',
        // secrets: [process.env.SESSION_SECRET!],
        secrets: [process.env.SESSION_SECRET],
        sameSite: 'lax',
        maxAge: 60,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
