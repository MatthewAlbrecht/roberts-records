import { fetchMutation } from 'convex/nextjs';
import { type NextRequest, NextResponse } from 'next/server';
import { env } from '~/env.js';
import { api } from '../../../../../convex/_generated/api';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: getRedirectUri(request),
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/?error=token_exchange_failed', request.url)
      );
    }

    const tokens = (await tokenResponse.json()) as SpotifyTokenResponse;

    // Get user profile
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.redirect(
        new URL('/?error=profile_fetch_failed', request.url)
      );
    }

    const profile = (await profileResponse.json()) as SpotifyUserProfile;

    // Get the session user from cookie
    const sessionToken = request.cookies.get('session')?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login?redirect=/', request.url));
    }

    // Decode session to get userId
    const decoded = Buffer.from(sessionToken, 'base64url').toString();
    const userId = decoded.split(':')[0];

    if (!userId) {
      return NextResponse.redirect(new URL('/login?redirect=/', request.url));
    }

    // Store tokens in Convex
    await fetchMutation(api.spotify.upsertConnection, {
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      spotifyUserId: profile.id,
      displayName: profile.display_name ?? undefined,
    });

    return NextResponse.redirect(new URL('/?connected=true', request.url));
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(new URL('/?error=unknown', request.url));
  }
}

function getRedirectUri(request: NextRequest): string {
  // In Vercel, use headers to get the actual host
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
  const protocol = request.headers.get('x-forwarded-proto') || (request.nextUrl.protocol === 'https:' ? 'https' : 'http');
  const origin = `${protocol}://${host}`;
  return `${origin}/api/spotify/callback`;
}

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

type SpotifyUserProfile = {
  id: string;
  display_name: string | null;
  email: string;
  images: Array<{ url: string }>;
};
