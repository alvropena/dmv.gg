import { cookies } from 'next/headers';

/**
 * Set a cookie on the server side
 * @param name The name of the cookie
 * @param value The value to store in the cookie
 * @param options Optional configuration for the cookie
 */
export function setCookie(
  name: string, 
  value: string, 
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
) {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax' as const,
  };

  const cookieOptions = { ...defaultOptions, ...options };
  
  cookies().set(name, value, cookieOptions);
}

/**
 * Get a cookie value on the server side
 * @param name The name of the cookie to retrieve
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string) {
  return cookies().get(name)?.value || null;
}

/**
 * Delete a cookie on the server side
 * @param name The name of the cookie to delete
 */
export function deleteCookie(name: string) {
  cookies().delete(name);
} 