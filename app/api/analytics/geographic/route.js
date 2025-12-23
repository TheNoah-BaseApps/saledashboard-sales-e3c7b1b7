import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/analytics/geographic:
 *   get:
 *     summary: Get geographic analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Geographic analytics
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

    const locationResult = await query(
      `SELECT 
         COALESCE(location, 'Unknown') as location,
         COUNT(DISTINCT CASE WHEN source = 'website' THEN id END) as website_visits,
         COUNT(DISTINCT CASE WHEN source = 'store' THEN id END) as store_visits,
         COUNT(DISTINCT CASE WHEN source = 'signup' THEN id END) as signups,
         COUNT(*) as total
       FROM (
         SELECT id, location, 'website' as source FROM website_visits WHERE user_id = $1
         UNION ALL
         SELECT id, location, 'store' as source FROM store_visits WHERE user_id = $1
         UNION ALL
         SELECT id, location, 'signup' as source FROM login_signups WHERE user_id = $1
       ) AS all_locations
       GROUP BY location
       ORDER BY total DESC
       LIMIT 10`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      data: {
        locationBreakdown: locationResult.rows,
        topLocations: locationResult.rows.slice(0, 5),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/analytics/geographic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch geographic analytics' },
      { status: 500 }
    );
  }
}