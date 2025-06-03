import type { APIRoute } from 'astro';
import { db, User } from 'astro:db';

// Define user type for better type safety
type UserRow = {
  id: number;
  name: string;
  hashed_password: string;
  createdAt: Date;
  updatedAt: Date;
};

type SafeUser = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

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
    const name = url.searchParams.get('name'); // Execute queries
    let users: UserRow[];
    let totalCount: number;

    if (name?.trim()) {
      // For simplicity, using a basic string includes search
      // In production, you'd want to use proper text search with SQL LIKE
      const allUsers = await db.select().from(User);
      const filteredUsers = allUsers.filter((user: UserRow) =>
        user.name.toLowerCase().includes(name.trim().toLowerCase()),
      );

      totalCount = filteredUsers.length;
      users = filteredUsers.slice(offset, offset + limit);
    } else {
      // Get all users first (for simplicity - in production you'd optimize this)
      const allUsers = await db.select().from(User);
      totalCount = allUsers.length;
      users = allUsers.slice(offset, offset + limit);
    } // Remove sensitive information from response
    const safeUsers: SafeUser[] = users.map((user: UserRow) => ({
      id: user.id,
      name: user.name,
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
