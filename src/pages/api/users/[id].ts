import { z } from 'astro:schema';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';
import { getUserById } from '@/lib/db/user-repository';
import type { APIRoute } from 'astro';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

type GetApiRoute = APIRoute<
  Record<string, unknown>,
  z.infer<typeof paramsSchema>
>;

export const GET: GetApiRoute = async ({ params }) => {
  try {
    // Validate params
    const parsedParams = paramsSchema.parse(params);
    const userId = parsedParams.id;

    // Find the user by ID
    const user = await getUserById(userId);

    if (!user) {
      return createErrorResponse({
        error: 'User not found',
        message: `No user found with ID ${userId}`,
        status: 404,
      });
    }

    // Return user without sensitive information
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return createSuccessResponse({ data: { user: safeUser } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse({
        error: 'Invalid user ID',
        message: error.errors.map((e) => e.message).join(', '),
        status: 400,
      });
    }
    console.error('Error fetching user:', error);
    return createErrorResponse({
      error: 'Internal server error',
      message: 'Failed to fetch user',
      status: 500,
    });
  }
};
