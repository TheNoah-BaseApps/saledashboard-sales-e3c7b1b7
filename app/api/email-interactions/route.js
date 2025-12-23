import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/email-interactions:
 *   get:
 *     summary: Get all email interactions
 *     description: Retrieve a paginated list of all email interactions with filtering
 *     tags: [Email Interactions]
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
 *         name: sentiment
 *         schema:
 *           type: string
 *         description: Filter by sentiment
 *       - in: query
 *         name: thread
 *         schema:
 *           type: string
 *         description: Filter by thread
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sentiment = searchParams.get('sentiment');
    const thread = searchParams.get('thread');

    let queryText = 'SELECT * FROM email_interactions WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (sentiment) {
      queryText += ` AND sentiment = $${paramIndex}`;
      params.push(sentiment);
      paramIndex++;
    }

    if (thread) {
      queryText += ` AND thread = $${paramIndex}`;
      params.push(thread);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    
    let countQuery = 'SELECT COUNT(*) FROM email_interactions WHERE 1=1';
    let countParams = [];
    let countParamIndex = 1;
    
    if (sentiment) {
      countQuery += ` AND sentiment = $${countParamIndex}`;
      countParams.push(sentiment);
      countParamIndex++;
    }
    if (thread) {
      countQuery += ` AND thread = $${countParamIndex}`;
      countParams.push(thread);
    }
    
    const countResult = await query(countQuery, countParams);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching email interactions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/email-interactions:
 *   post:
 *     summary: Create a new email interaction
 *     description: Log a new email interaction with thread tracking
 *     tags: [Email Interactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_ids:
 *                 type: string
 *               email_domain:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               attachments:
 *                 type: string
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               thread:
 *                 type: string
 *               summary:
 *                 type: string
 *               sentiment:
 *                 type: string
 *               sender_id:
 *                 type: string
 *               receiver_id:
 *                 type: string
 *               cc_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Email interaction created successfully
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email_ids, email_domain, subject, message, attachments, time, date, thread, summary, sentiment, sender_id, receiver_id, cc_id } = body;

    const result = await query(
      `INSERT INTO email_interactions 
       (email_ids, email_domain, subject, message, attachments, time, date, thread, summary, sentiment, sender_id, receiver_id, cc_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
       RETURNING *`,
      [email_ids || null, email_domain || null, subject || null, message || null, attachments || null, time || null, date || null, thread || null, summary || null, sentiment || null, sender_id || null, receiver_id || null, cc_id || null]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating email interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}