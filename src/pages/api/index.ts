import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'API is working',
      data: {
        endpoints: [
          { method: 'GET', path: '/api/users' },
          { method: 'GET', path: '/api/users/:id' },
        ],
      },
    }),
  );
};
