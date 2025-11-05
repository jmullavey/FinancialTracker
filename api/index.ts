// Vercel serverless function entry point
// This wraps the Express app for Vercel's serverless environment
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import the compiled Express app
let app: any;

async function getApp() {
  if (!app) {
    // Dynamic import to ensure backend is built
    const backendApp = await import('../backend/dist/index.js');
    app = backendApp.default || backendApp;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp();
  return expressApp(req, res);
}
