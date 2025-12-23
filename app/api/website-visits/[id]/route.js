import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/website-visits/{id}:
 *   get:
 *     summary: Get a website visit by ID
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Website visit details
 *       404:
 *         description: Website visit not found
 */
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      'SELECT * FROM website_visits WHERE id = $1 AND user_id = $2',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Website visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in GET /api/website-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch website visit' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/website-visits/{id}:
 *   put:
 *     summary: Update a website visit
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Website visit updated
 */
export async function PUT(request, { params }) {
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
      number_of_visits,
      page_visits,
      website_duration,
      location,
      time,
      date,
    } = body;

    const result = await query(
      `UPDATE website_visits 
       SET ip = $1, owner_contact = $2, number_of_visits = $3, 
           page_visits = $4, website_duration = $5, location = $6, 
           time = $7, date = $8
       WHERE id = $9 AND user_id = $10
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
        params.id,
        user.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Website visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Website visit updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in PUT /api/website-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update website visit' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/website-visits/{id}:
 *   delete:
 *     summary: Delete a website visit
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Website visit deleted
 */
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await query(
      'DELETE FROM website_visits WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Website visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Website visit deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/website-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete website visit' },
      { status: 500 }
    );
  }
}