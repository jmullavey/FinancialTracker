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
        // Use dynamic import which works in both CommonJS and ES module contexts
        // In Vercel's serverless environment, this handles module resolution correctly
        const backendModule = await import('../backend/dist/index.js');
        
        // Extract the app - handle both CommonJS and ES module exports
        app = backendModule.default || backendModule;
        
        // If app is still not a function, it might be wrapped
        if (app && typeof app !== 'function' && app.default) {
          app = app.default;
        }
        
        // Verify app is an Express app
        if (!app || typeof app !== 'function') {
          console.error('Backend export structure:', {
            hasDefault: !!backendModule?.default,
            hasModule: !!backendModule,
            type: typeof backendModule,
            appType: typeof app,
            keys: Object.keys(backendModule || {})
          });
          throw new Error('Failed to load Express app - invalid export');
        }
        
        // Wait a bit for database initialization to complete
        // The backend exports the app immediately, but database init happens asynchronously
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error: any) {
        console.error('Failed to load backend app:', error);
        console.error('Error stack:', error.stack);
        throw new Error(`Backend initialization failed: ${error.message}`);
      }
    }
    return app;
  })();

  return appPromise;
}

// Track database initialization
let dbInitPromise: Promise<void> | null = null;

async function ensureDatabaseInitialized() {
  if (!dbInitPromise) {
    // Import the backend module to trigger initialization
    try {
      const backendModule = await import('../backend/dist/index.js');
      // The backend module will start initialization when imported
      // Wait a moment for it to complete
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Failed to ensure database initialization:', error);
    }
  }
  return dbInitPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure database is initialized before handling request
    await ensureDatabaseInitialized();
    
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
