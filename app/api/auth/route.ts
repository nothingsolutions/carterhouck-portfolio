import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  // Step 1: If no code, redirect to GitHub for authorization
  if (!code) {
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', GITHUB_CLIENT_ID || '');
    authUrl.searchParams.set('scope', 'repo user');
    authUrl.searchParams.set('redirect_uri', `${url.origin}/api/auth`);
    
    return NextResponse.redirect(authUrl.toString());
  }
  
  // Step 2: Exchange code for access token
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    
    const data = await tokenResponse.json();
    
    if (data.error) {
      return new NextResponse(`Error: ${data.error_description || data.error}`, { status: 400 });
    }
    
    // Step 3: Return the token to Decap CMS
    const script = `
      <script>
        (function() {
          function recieveMessage(e) {
            console.log("recieveMessage %o", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}',
              e.origin
            );
            window.removeEventListener("message", recieveMessage, false);
          }
          window.addEventListener("message", recieveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;
    
    return new NextResponse(script, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return new NextResponse('Authentication failed', { status: 500 });
  }
}

