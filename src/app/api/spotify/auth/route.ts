import type { NextRequest } from 'next/server';
import { env } from '~/env.js';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SCOPES = [
  'user-read-recently-played',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');

export function GET(request: NextRequest): Response {
  const params = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: getRedirectUri(request),
    scope: SCOPES,
    show_dialog: 'true',
  });

  return Response.redirect(`${SPOTIFY_AUTH_URL}?${params.toString()}`);
}

function getRedirectUri(request: NextRequest): string {
  // In Vercel, use headers to get the actual host
  const host =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.host;
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    (request.nextUrl.protocol === 'https:' ? 'https' : 'http');
  const origin = `${protocol}://${host}`;
  return `${origin}/api/spotify/callback`;
}
