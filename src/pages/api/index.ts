import type { APIRoute } from 'astro';
import { JsonResponse } from '../../utils/api';

export const GET: APIRoute = async () => {
  return JsonResponse.success({
    message: 'API is working',
    endpoints: [
      { method: 'GET', path: '/api/users' },
      { method: 'GET', path: '/api/users/:id' },
    ],
  });
};
