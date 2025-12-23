import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/call-interactions:
 *   get:
 *     summary: Get all call interactions
 *     description: Retrieve a paginated list of all call interactions with filtering
 *     tags: [Call Interactions]
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
 *         name: min_purchase_intent
 *         schema:
 *           type: integer
 *         description: Minimum purchase intent score
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
    const minPurchaseIntent = searchParams.get('min_purchase_intent');

    let queryText = 'SELECT * FROM call_interactions WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (sentiment) {
      queryText += ` AND sentiment = $${paramIndex}`;
      params.push(sentiment);
      paramIndex++;
    }

    if (minPurchaseIntent) {
      queryText += ` AND purchase_intent_score >= $${paramIndex}`;
      params.push(parseInt(minPurchaseIntent));
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    
    let countQuery = 'SELECT COUNT(*) FROM call_interactions WHERE 1=1';
    let countParams = [];
    let countParamIndex = 1;
    
    if (sentiment) {
      countQuery += ` AND sentiment = $${countParamIndex}`;
      countParams.push(sentiment);
      countParamIndex++;
    }
    if (minPurchaseIntent) {
      countQuery += ` AND purchase_intent_score >= $${countParamIndex}`;
      countParams.push(parseInt(minPurchaseIntent));
    }
    
    const countResult = await query(countQuery, countParams);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching call interactions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/call-interactions:
 *   post:
 *     summary: Create a new call interaction
 *     description: Log a new call interaction with transcripts and sentiment
 *     tags: [Call Interactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               email_ids:
 *                 type: string
 *               name:
 *                 type: string
 *               call_duration:
 *                 type: string
 *               voice_recordings:
 *                 type: string
 *               transcripts:
 *                 type: string
 *               summary:
 *                 type: string
 *               sentiment:
 *                 type: string
 *               action_items:
 *                 type: string
 *               purchase_intent_score:
 *                 type: integer
 *               sales_highlights:
 *                 type: string
 *     responses:
 *       201:
 *         description: Call interaction created successfully
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { time, date, email_ids, name, call_duration, voice_recordings, transcripts, summary, sentiment, action_items, purchase_intent_score, sales_highlights } = body;

    const result = await query(
      `INSERT INTO call_interactions 
       (time, date, email_ids, name, call_duration, voice_recordings, transcripts, summary, sentiment, action_items, purchase_intent_score, sales_highlights) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [time || null, date || null, email_ids || null, name || null, call_duration || null, voice_recordings || null, transcripts || null, summary || null, sentiment || null, action_items || null, purchase_intent_score || null, sales_highlights || null]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating call interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}