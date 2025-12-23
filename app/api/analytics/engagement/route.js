import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/analytics/engagement:
 *   get:
 *     summary: Get engagement metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Engagement metrics
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

    const avgSessionDurationResult = await query(
      'SELECT AVG(website_duration) as avg FROM website_visits WHERE user_id = $1',
      [user.id]
    );

    const avgPageViewsResult = await query(
      'SELECT AVG(array_length(page_visits, 1)) as avg FROM website_visits WHERE user_id = $1 AND page_visits IS NOT NULL',
      [user.id]
    );

    const avgStoreVisitsResult = await query(
      'SELECT AVG(number_of_visits) as avg FROM store_visits WHERE user_id = $1',
      [user.id]
    );

    const activeDaysResult = await query(
      `SELECT COUNT(DISTINCT date) as count 
       FROM (
         SELECT date FROM website_visits WHERE user_id = $1
         UNION
         SELECT date FROM store_visits WHERE user_id = $1
         UNION
         SELECT date FROM login_signups WHERE user_id = $1
       ) AS all_dates`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      data: {
        avgSessionDuration: parseFloat(avgSessionDurationResult.rows[0].avg) || 0,
        avgPageViews: parseFloat(avgPageViewsResult.rows[0].avg) || 0,
        avgStoreVisits: parseFloat(avgStoreVisitsResult.rows[0].avg) || 0,
        activeDays: parseInt(activeDaysResult.rows[0].count) || 0,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/analytics/engagement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch engagement analytics' },
      { status: 500 }
    );
  }
}