import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/analytics/funnel:
 *   get:
 *     summary: Get funnel conversion statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Funnel statistics
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

    const websiteVisitsResult = await query(
      'SELECT COUNT(*) as count FROM website_visits WHERE user_id = $1',
      [user.id]
    );

    const storeVisitsResult = await query(
      'SELECT COUNT(*) as count FROM store_visits WHERE user_id = $1',
      [user.id]
    );

    const signupsResult = await query(
      'SELECT COUNT(*) as count FROM login_signups WHERE user_id = $1',
      [user.id]
    );

    const totalWebsiteVisits = parseInt(websiteVisitsResult.rows[0].count) || 0;
    const totalStoreVisits = parseInt(storeVisitsResult.rows[0].count) || 0;
    const totalSignups = parseInt(signupsResult.rows[0].count) || 0;

    const websiteToStoreRate = totalWebsiteVisits > 0 
      ? (totalStoreVisits / totalWebsiteVisits) * 100 
      : 0;

    const storeToSignupRate = totalStoreVisits > 0 
      ? (totalSignups / totalStoreVisits) * 100 
      : 0;

    const conversionRate = totalWebsiteVisits > 0 
      ? (totalSignups / totalWebsiteVisits) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalWebsiteVisits,
        totalStoreVisits,
        totalSignups,
        websiteToStoreRate,
        storeToSignupRate,
        conversionRate,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/analytics/funnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch funnel analytics' },
      { status: 500 }
    );
  }
}