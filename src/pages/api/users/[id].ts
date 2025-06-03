import { User, db, eq } from 'astro:db';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  try {
    const userId = Number.parseInt(params.id as string, 10);

    if (Number.isNaN(userId)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid user ID',
          message: 'User ID must be a valid number',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Find the user by ID
    const users = await db.select().from(User).where(eq(User.id, userId));
    const user = users[0];

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User not found',
          message: `No user found with ID ${userId}`,
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Return user without sensitive information
    const safeUser = {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: safeUser,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch user',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
};
