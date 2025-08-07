
import { NextResponse } from 'next/server';

// This API route is no longer needed as session management is handled
// on the client-side with local storage. This file can be removed,
// but is left blank to ensure no breaking changes during migration.

export async function POST() {
  return NextResponse.json({ message: 'This endpoint is deprecated.' }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'This endpoint is deprecated.' }, { status: 410 });
}
