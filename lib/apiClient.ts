/**
 * Centralized API client that handles token expiration
 * Automatically renews tokens when they expire
 */

import { User } from '@/types/User';

let logoutCallback: (() => void) | null = null;
let refreshCallback: ((user: User) => void) | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setLogoutCallback(callback: () => void) {
  logoutCallback = callback;
}

export function clearLogoutCallback() {
  logoutCallback = null;
}

export function setRefreshCallback(callback: (user: User) => void) {
  refreshCallback = callback;
}

export function clearRefreshCallback() {
  refreshCallback = null;
}

/**
 * Handles logout and redirects to home page
 * Calls server-side logout endpoint to revoke refresh token,
 * removes token and user from localStorage, calls logoutCallback if provided,
 * and performs delayed redirect to '/' only when pathname !== '/'
 */
async function handleLogoutRedirect() {
  // Call server-side logout to revoke refresh token
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies to revoke refresh token
    });
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Continue with client-side cleanup even if API call fails
  }

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  if (logoutCallback) {
    logoutCallback();
  }

  setTimeout(() => {
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }, 100);
}

/**
 * Attempts to refresh the expired token using refresh token from httpOnly cookie
 * Returns true if refresh was successful, false otherwise
 */
async function refreshToken(): Promise<boolean> {
  // If already refreshing, wait for the existing refresh
  if (refreshPromise) {
    return refreshPromise;
  }

  // Start refresh process
  // Refresh token is sent automatically via httpOnly cookie
  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in request
      });

      if (!response.ok) {
        // Refresh failed - user needs to log in again
        handleLogoutRedirect();
        return false;
      }

      const data = await response.json();

      // Update access token and user in localStorage
      // Refresh token is automatically updated in httpOnly cookie by server
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          // Notify refresh callback to update user state
          if (refreshCallback) {
            refreshCallback(data.user);
          }
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Refresh failed
      handleLogoutRedirect();
      return false;
    } finally {
      // Clear refresh promise so future requests can trigger refresh again
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Fetcher function that handles authentication and token expiration
 * Automatically refreshes expired tokens
 */
export async function apiFetcher<T = unknown>(url: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('apiFetcher can only be used on the client side');
  }

  const token = localStorage.getItem('token');

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for refresh token
  });

  // Handle token expiration (401 Unauthorized)
  if (response.status === 401) {
    // Skip refresh for auth endpoints to avoid infinite loops
    if (url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/auth/register')) {
      // Clear stored auth data
      handleLogoutRedirect();
      throw new Error('Authentication failed. Please log in again.');
    }

    // Try to refresh token (only once per request)
    if (retryCount === 0) {
      const refreshSuccess = await refreshToken();

      if (refreshSuccess) {
        // Retry the original request with the new token
        const newToken = localStorage.getItem('token');
        const newHeaders = new Headers(options.headers);
        if (newToken) {
          newHeaders.set('Authorization', `Bearer ${newToken}`);
        }

        const retryResponse = await fetch(url, {
          ...options,
          headers: newHeaders,
          credentials: 'include', // Include cookies for refresh token
        });

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.message || errorData.error || `Request failed with status ${retryResponse.status}`);
        }

        return retryResponse.json();
      }
    }

    // If refresh failed or already retried, throw error
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * SWR-compatible fetcher
 */
export const swrFetcher = (url: string) => apiFetcher(url);
