import { Express, RequestHandler } from "express";

// Temporary authentication bypass for testing
export const testAuth: RequestHandler = (req: any, res, next) => {
  // Create a fake user session for testing
  req.user = {
    id: '44415082', // Using existing admin user ID
    email: 'hello@roxzmedia.com',
    firstName: 'Admin',
    lastName: 'User',
    claims: {
      sub: '44415082',
      email: 'hello@roxzmedia.com',
      first_name: 'Admin',
      last_name: 'User'
    }
  };
  req.isAuthenticated = () => true;
  next();
};

export function setupTestAuth(app: Express) {
  console.log('🚧 TEST AUTH MODE ENABLED - BYPASSING AUTHENTICATION');
  
  // Override the broken isAuthenticated middleware
  app.use((req: any, res, next) => {
    req.login = (user: any, callback: any) => callback();
    req.logout = (callback: any) => callback();
    next();
  });
}