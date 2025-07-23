import { z } from 'astro:schema';
import { createErrorResponse, createSuccessResponse } from '@/lib/api';
import { getUserById } from '@/lib/db/user-repository';
import type { APIRoute } from 'astro';

const paramsSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
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
      return createErrorResponse(
        'User not found',
        `No user found with ID ${userId}`,
        404,
      );
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
    return createErrorResponse(
      'Internal server error',
      'Failed to fetch user',
      500,
    );
  }
};
