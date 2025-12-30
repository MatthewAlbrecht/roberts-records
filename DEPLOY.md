# Deployment Guide for Robert's Records

## Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to roberts-records directory**:
   ```bash
   cd roberts-records
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new? → Create new
   - Project name: `roberts-records` (or your choice)
   - Directory: `./` (current directory)
   - Override settings? → No

4. **Set Environment Variables** in Vercel Dashboard:
   
   Go to your project settings → Environment Variables and add:
   
   ```
   NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
   AUTH_USERNAME=<rob-username>
   AUTH_PASSWORD=<rob-password>
   SPOTIFY_CLIENT_ID=<spotify-client-id>
   SPOTIFY_CLIENT_SECRET=<spotify-client-secret>
   NODE_ENV=production
   ```

5. **Update Spotify Redirect URI**:
   
   In your Spotify App settings (https://developer.spotify.com/dashboard):
   - Add your Vercel deployment URL to Redirect URIs:
     - `https://your-project.vercel.app/api/spotify/callback`
   - If using a custom domain:
     - `https://your-domain.com/api/spotify/callback`

6. **Redeploy** (to pick up env vars):
   ```bash
   vercel --prod
   ```

## Production URL

After deployment, your app will be available at:
- `https://your-project.vercel.app`

Update the Spotify redirect URI in Spotify Developer Dashboard to match.

## Notes

- The app uses the same Convex backend as the parent project
- Make sure `NEXT_PUBLIC_CONVEX_URL` points to your production Convex deployment
- Rob's credentials (`AUTH_USERNAME`/`AUTH_PASSWORD`) should be different from yours
- Spotify OAuth credentials can be the same app or a separate one

