import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AdminUser {
  userId: string;
  email: string;
  role: 'admin' | 'employee' | 'super_admin';
}

export function verifyAdminToken(request: NextRequest): AdminUser | null {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as AdminUser;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function requireAdmin(handler: (request: NextRequest, user: AdminUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = verifyAdminToken(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(request, user);
  };
}

export function requireRole(allowedRoles: AdminUser['role'][] = ['admin', 'super_admin']) {
  return (handler: (request: NextRequest, user: AdminUser) => Promise<Response>) => {
    return async (request: NextRequest) => {
      const user = verifyAdminToken(request);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      if (!allowedRoles.includes(user.role)) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return handler(request, user);
    };
  };
}