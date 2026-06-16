import { getHtml } from './html';

export interface Env {
  ENVIRONMENT: string;
  GITHUB_REPO_URL: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const githubRepoUrl = env.GITHUB_REPO_URL || "https://github.com/rifkisururi/notification-forwader";

    // Handle APK Download Redirect
    if (url.pathname === '/download') {
      const downloadUrl = `${githubRepoUrl}/releases/latest/download/app-release.apk`;
      return Response.redirect(downloadUrl, 302);
    }

    // Serve Landing Page
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = getHtml(githubRepoUrl);
      
      const response = new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          
          // Security Headers
          'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'self'",
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
        }
      });
      
      return response;
    }

    // Fallback 404
    return new Response('Halaman Tidak Ditemukan (404)', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
};
