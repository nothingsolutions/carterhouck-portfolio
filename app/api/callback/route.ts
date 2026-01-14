import { NextRequest, NextResponse } from 'next/server';

// This handles the callback from GitHub OAuth
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(`${url.origin}/api/auth`);
  }
  
  // Redirect to the main auth handler with the code
  return NextResponse.redirect(`${url.origin}/api/auth?code=${code}`);
}

