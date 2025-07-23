import { createErrorResponse, createSuccessResponse } from '@/lib/api';
import {
  type UserRecord,
  getAllUsers,
  searchUsersByName,
} from '@/lib/db/user-repository';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(url.searchParams.get('limit') || '10', 10)),
    );
    const offset = Math.max(
      0,
      Number.parseInt(url.searchParams.get('offset') || '0', 10),
    );
    const name = url.searchParams.get('name');

    // Fetch users from DB
    let users: UserRecord[];
    if (name) {
      users = await searchUsersByName(name);
    } else {
      users = await getAllUsers();
    }

    const totalCount = users.length;
    const pagedUsers = users.slice(offset, offset + limit);

    // Remove sensitive information from response
    const safeUsers = pagedUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    // Calculate pagination metadata
    const pagination = {
      total: totalCount,
      limit,
      offset,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCount / limit),
    };

    return createSuccessResponse({
      status: 200,
      data: {
        users: safeUsers,
        pagination,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return createErrorResponse({
      error: 'Internal server error',
      message: (error as Error).message,
      status: 500,
    });
  }
};
