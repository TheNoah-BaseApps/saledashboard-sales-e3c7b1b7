import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/store-visits:
 *   get:
 *     summary: Get all store visits
 *     tags: [Store Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of store visits
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
      `SELECT * FROM store_visits 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in GET /api/store-visits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store visits' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/store-visits:
 *   post:
 *     summary: Create a store visit
 *     tags: [Store Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner_contact
 *               - location
 *               - date
 *             properties:
 *               owner_contact:
 *                 type: string
 *               number_of_visits:
 *                 type: integer
 *               location:
 *                 type: string
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store visit created
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
    const {
      owner_contact,
      number_of_visits = 1,
      location,
      time,
      date,
    } = body;

    if (!owner_contact || !location || !date) {
      return NextResponse.json(
        { success: false, error: 'Owner contact, location, and date are required' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO store_visits (
        owner_contact, number_of_visits, location, time, date, user_id, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`,
      [owner_contact, number_of_visits, location, time, date, user.id]
    );

    // Update or create contact
    await client.query(
      `INSERT INTO contacts (contact_info, first_seen, last_activity, total_store_visits, user_id)
       VALUES ($1, NOW(), NOW(), 1, $2)
       ON CONFLICT (contact_info) 
       DO UPDATE SET 
         last_activity = NOW(),
         total_store_visits = contacts.total_store_visits + 1`,
      [owner_contact, user.id]
    );

    await client.query('COMMIT');

    return NextResponse.json(
      {
        success: true,
        message: 'Store visit created successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in POST /api/store-visits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create store visit' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}