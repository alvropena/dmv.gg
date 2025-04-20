import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// List of cookies that should be client-accessible
const CLIENT_ACCESSIBLE_COOKIES = ['cookies_accepted', 'analytics_enabled', 'marketing_enabled'];

/**
 * GET handler - retrieve a cookie value
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cookieName = searchParams.get('name');
  
  if (!cookieName) {
    return NextResponse.json(
      { error: 'Cookie name is required' },
      { status: 400 }
    );
  }
  
  const cookie = cookies().get(cookieName);
  
  return NextResponse.json({ 
    name: cookieName,
    value: cookie?.value || null,
    exists: !!cookie
  });
}

/**
 * POST handler - set a cookie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, value, options = {} } = body;

    if (!name || value === undefined) {
      return NextResponse.json({ error: 'Name and value are required' }, { status: 400 });
    }

    // Set default cookie options
    const cookieOptions = {
      // Make consent-related cookies client-accessible
      httpOnly: CLIENT_ACCESSIBLE_COOKIES.includes(name) ? false : (options.httpOnly ?? true),
      secure: process.env.NODE_ENV === 'production',
      maxAge: options.maxAge ?? 60 * 60 * 24 * 365, // Default: 1 year
      path: options.path ?? '/',
      sameSite: options.sameSite ?? 'lax',
    };

    // Set the cookie
    cookies().set(name, value, cookieOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting cookie:', error);
    return NextResponse.json({ error: 'Failed to set cookie' }, { status: 500 });
  }
}

/**
 * DELETE handler - delete a cookie
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cookieName = searchParams.get('name');
  
  if (!cookieName) {
    return NextResponse.json(
      { error: 'Cookie name is required' },
      { status: 400 }
    );
  }
  
  cookies().delete(cookieName);
  
  return NextResponse.json({
    success: true,
    message: `Cookie '${cookieName}' has been deleted`,
  });
} 