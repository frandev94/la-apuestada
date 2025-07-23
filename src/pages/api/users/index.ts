import { getAllUsers } from '@/lib/db/user-repository';
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
    let users = await getAllUsers();
    if (name && users) {
      users = users.filter((user) =>
        user.name?.toLowerCase().includes(name.toLowerCase()),
      );
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

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users: safeUsers,
          pagination,
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
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch users',
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
