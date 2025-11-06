// Vercel serverless function entry point
// This wraps the Express app for Vercel's serverless environment
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import the compiled Express app
let app: any;
let appPromise: Promise<any> | null = null;

async function getApp() {
  if (appPromise) {
    return appPromise;
  }

  appPromise = (async () => {
    if (!app) {
      try {
        // Dynamic import to ensure backend is built
        const backendApp = await import('../backend/dist/index.js');
        app = backendApp.default || backendApp;
        
        // Verify app is an Express app
        if (!app || typeof app !== 'function') {
          throw new Error('Failed to load Express app - invalid export');
        }
        
        // Wait a bit for database initialization to complete
        // The backend exports the app immediately, but database init happens asynchronously
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error('Failed to load backend app:', error);
        throw new Error(`Backend initialization failed: ${error.message}`);
      }
    }
    return app;
  })();

  return appPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    
    // Handle the request
    return new Promise<void>((resolve, reject) => {
      expressApp(req, res, (err: any) => {
        if (err) {
          console.error('Express error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
          }
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error: any) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Server initialization failed',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}
