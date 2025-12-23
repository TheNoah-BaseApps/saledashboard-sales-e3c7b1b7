import { NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/website-visits:
 *   get:
 *     summary: Get all website visits
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of website visits
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
      `SELECT * FROM website_visits 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error in GET /api/website-visits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch website visits' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/website-visits:
 *   post:
 *     summary: Create a website visit
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ip
 *               - date
 *             properties:
 *               ip:
 *                 type: string
 *               owner_contact:
 *                 type: string
 *               number_of_visits:
 *                 type: integer
 *               page_visits:
 *                 type: array
 *                 items:
 *                   type: string
 *               website_duration:
 *                 type: integer
 *               location:
 *                 type: string
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Website visit created
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
      ip,
      owner_contact,
      number_of_visits = 1,
      page_visits = [],
      website_duration = 0,
      location,
      time,
      date,
    } = body;

    if (!ip || !date) {
      return NextResponse.json(
        { success: false, error: 'IP and date are required' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO website_visits (
        ip, owner_contact, number_of_visits, page_visits, 
        website_duration, location, time, date, user_id, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *`,
      [
        ip,
        owner_contact,
        number_of_visits,
        page_visits,
        website_duration,
        location,
        time,
        date,
        user.id,
      ]
    );

    // Update or create contact
    if (owner_contact) {
      await client.query(
        `INSERT INTO contacts (contact_info, first_seen, last_activity, total_website_visits, user_id)
         VALUES ($1, NOW(), NOW(), 1, $2)
         ON CONFLICT (contact_info) 
         DO UPDATE SET 
           last_activity = NOW(),
           total_website_visits = contacts.total_website_visits + 1`,
        [owner_contact, user.id]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json(
      {
        success: true,
        message: 'Website visit created successfully',
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in POST /api/website-visits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create website visit' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}