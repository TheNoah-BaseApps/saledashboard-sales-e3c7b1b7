import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/store-visits/{id}:
 *   get:
 *     summary: Get a store visit by ID
 *     tags: [Store Visits]
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
 *         description: Store visit details
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
      'SELECT * FROM store_visits WHERE id = $1 AND user_id = $2',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Store visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in GET /api/store-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store visit' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/store-visits/{id}:
 *   put:
 *     summary: Update a store visit
 *     tags: [Store Visits]
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
 *         description: Store visit updated
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
    const { owner_contact, number_of_visits, location, time, date } = body;

    const result = await query(
      `UPDATE store_visits 
       SET owner_contact = $1, number_of_visits = $2, location = $3, 
           time = $4, date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [owner_contact, number_of_visits, location, time, date, params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Store visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Store visit updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in PUT /api/store-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update store visit' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/store-visits/{id}:
 *   delete:
 *     summary: Delete a store visit
 *     tags: [Store Visits]
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
 *         description: Store visit deleted
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
      'DELETE FROM store_visits WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Store visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Store visit deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/store-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete store visit' },
      { status: 500 }
    );
  }
}