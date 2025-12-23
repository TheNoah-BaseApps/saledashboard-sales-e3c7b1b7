import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

/**
 * @swagger
 * /api/login-signups/{id}:
 *   get:
 *     summary: Get a login/signup activity by ID
 *     tags: [Login Signups]
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
 *         description: Login/signup activity details
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
      'SELECT * FROM login_signups WHERE id = $1 AND user_id = $2',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Login/signup activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in GET /api/login-signups/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch login/signup activity' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/login-signups/{id}:
 *   put:
 *     summary: Update a login/signup activity
 *     tags: [Login Signups]
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
 *         description: Login/signup activity updated
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
    const { username, email, location, time, date } = body;

    const result = await query(
      `UPDATE login_signups 
       SET username = $1, email = $2, location = $3, time = $4, date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [username, email, location, time, date, params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Login/signup activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login/signup activity updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error in PUT /api/login-signups/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update login/signup activity' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/login-signups/{id}:
 *   delete:
 *     summary: Delete a login/signup activity
 *     tags: [Login Signups]
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
 *         description: Login/signup activity deleted
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
      'DELETE FROM login_signups WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Login/signup activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login/signup activity deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/login-signups/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete login/signup activity' },
      { status: 500 }
    );
  }
}