const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Simple in-memory rate limiter
const rateLimit = {
  windowMs: 60 * 1000, // 1 minute window
  maxRequests: 100, // max 100 requests per window
  requests: new Map(),

  check(ip) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Clean old entries
    if (this.requests.size > 10000) {
      for (const [key, data] of this.requests) {
        if (data.timestamp < windowStart) {
          this.requests.delete(key);
        }
      }
    }

    const current = this.requests.get(ip);
    if (!current || current.timestamp < windowStart) {
      this.requests.set(ip, { count: 1, timestamp: now });
      return true;
    }

    if (current.count >= this.maxRequests) {
      return false;
    }

    current.count++;
    return true;
  }
};

// Content Security Policy
const getCSP = (isDev) => {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.infura.io wss://*.infura.io https://*.walletconnect.com wss://*.walletconnect.com https://api.opensea.io https://*.firebase.googleapis.com https://*.firebaseio.com",
    "frame-src 'self' https://*.walletconnect.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];

  if (isDev) {
    // Relax some policies for development
    directives[1] = "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
    directives.pop(); // Remove upgrade-insecure-requests in dev
  }

  return directives.join('; ');
};

app.prepare().then(() => {
  createServer((req, res) => {
    // Get client IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               req.socket?.remoteAddress ||
               'unknown';

    // Rate limiting check
    if (!rateLimit.check(ip)) {
      res.writeHead(429, { 'Content-Type': 'text/plain' });
      res.end('Too Many Requests. Please try again later.');
      return;
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', getCSP(dev));

    // Strict Transport Security (only in production)
    if (!dev) {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // CORS - configure appropriately for production
    const allowedOrigins = dev
      ? ['http://localhost:3000']
      : [process.env.ALLOWED_ORIGIN || 'https://www.travelerloot.com'];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    handle(req, res);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
