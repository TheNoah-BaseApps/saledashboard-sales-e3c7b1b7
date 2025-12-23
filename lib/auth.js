import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { query } from './db';

export async function verifyAuth(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    // Get user from database
    const result = await query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [payload.id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error verifying auth:', error);
    return null;
  }
}

export function hasPermission(user, requiredRole) {
  const roleHierarchy = {
    admin: 4,
    manager: 3,
    user: 2,
    viewer: 1,
  };

  const userLevel = roleHierarchy[user?.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}