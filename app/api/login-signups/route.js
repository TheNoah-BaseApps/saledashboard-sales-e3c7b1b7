import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/login-signups:
 *   get:
 *     summary: Get all login/signup activities
 *     tags: [Login Signups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of login/signup activities
 */
export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT * FROM login_signups 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in GET /api/login-signups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch login/signup activities' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/login-signups:
 *   post:
 *     summary: Create a login/signup activity
 *     tags: [Login Signups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - date
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Login/signup activity created
 */
export async function POST(request) {
  const client = await getClient();
  
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, email, location, time, date } = body;

    if (!username || !email || !date) {
      return NextResponse.json(
        { success: false, error: 'Username, email, and date are required' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO login_signups (
        username, email, location, time, date, user_id, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`,
      [username, email, location, time, date, user.id]
    );

    // Update or create contact
    await client.query(
      `INSERT INTO contacts (contact_info, first_seen, last_activity, has_registered, user_id)
       VALUES ($1, NOW(), NOW(), true, $2)
       ON CONFLICT (contact_info) 
       DO UPDATE SET 
         last_activity = NOW(),
         has_registered = true`,
      [email, user.id]
    );

    await client.query('COMMIT');

    return NextResponse.json(
      {
        success: true,
        message: 'Login/signup activity created successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in POST /api/login-signups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create login/signup activity' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}