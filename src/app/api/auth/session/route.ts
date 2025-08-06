// src/app/api/auth/session/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
      const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });
      const options = {
        name: '__session',
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      const response = NextResponse.json({}, { status: 200 });
      response.cookies.set(options);
      return response;

    } catch (error) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
    }
  }

  return NextResponse.json({ error: 'No token provided' }, { status: 401 });
}

export async function DELETE(request: NextRequest) {
  const options = {
    name: '__session',
    value: '',
    maxAge: -1,
  };
  const response = NextResponse.json({}, { status: 200 });
  response.cookies.set(options);
  return response;
}
