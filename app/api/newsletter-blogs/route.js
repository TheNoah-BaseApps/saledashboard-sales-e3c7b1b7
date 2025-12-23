import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/newsletter-blogs:
 *   get:
 *     summary: Get all newsletter blogs
 *     description: Retrieve a paginated list of all newsletter blog entries
 *     tags: [Newsletter Blogs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let queryText = 'SELECT * FROM newsletter_blogs';
    let params = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` WHERE status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    
    const countResult = await query(
      status 
        ? 'SELECT COUNT(*) FROM newsletter_blogs WHERE status = $1'
        : 'SELECT COUNT(*) FROM newsletter_blogs',
      status ? [status] : []
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching newsletter blogs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/newsletter-blogs:
 *   post:
 *     summary: Create a new newsletter blog entry
 *     description: Create a new newsletter blog subscription or entry
 *     tags: [Newsletter Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               frequency:
 *                 type: string
 *               status:
 *                 type: string
 *               newsletter_name:
 *                 type: string
 *               blogs:
 *                 type: string
 *     responses:
 *       201:
 *         description: Newsletter blog entry created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, location, time, date, frequency, status, newsletter_name, blogs } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO newsletter_blogs 
       (email, location, time, date, frequency, status, newsletter_name, blogs) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [email, location || null, time || null, date || null, frequency || null, status || 'active', newsletter_name || null, blogs || null]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating newsletter blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}