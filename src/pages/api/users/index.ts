import { User, db, like } from 'astro:db';
import type { APIRoute } from 'astro';

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
    const name = url.searchParams.get('name');

    // Execute queries efficiently using database-level filtering and pagination
    let users: UserRow[];
    let totalCount: number;

    if (name?.trim()) {
      // Use database LIKE query for name filtering
      const searchPattern = `%${name.trim().toLowerCase()}%`;

      // Get total count for pagination with filtering
      const countResult = await db
        .select()
        .from(User)
        .where(like(User.name, searchPattern));
      totalCount = countResult.length;

      // Get paginated filtered users
      users = await db
        .select()
        .from(User)
        .where(like(User.name, searchPattern))
        .limit(limit)
        .offset(offset);
    } else {
      // Get total count for pagination without filtering
      const countResult = await db.select().from(User);
      totalCount = countResult.length;

      // Get paginated users without filtering
      users = await db.select().from(User).limit(limit).offset(offset);
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
