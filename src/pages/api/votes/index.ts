import { createErrorResponse, createSuccessResponse } from '@/lib/api';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { userId, participantId, combatId } = await request.json();

    if (!userId || !participantId || !combatId) {
      return createErrorResponse({
        status: 400,
        message: 'User ID, participant ID, and combat ID are required',
        error: 'Invalid request',
      });
    }

    return createSuccessResponse({
      message: 'Vote submitted successfully',
      data: undefined,
    });
  } catch (error) {
    console.error('Vote submission error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const userId = url.searchParams.get('userId');
    const combatId = url.searchParams.get('combatId');
    const action = url.searchParams.get('action');

    if (action === 'results' && combatId) {
      return new Response(
        JSON.stringify({ results: [], totalVotes: 0, combatId }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (action === 'user-vote' && userId && combatId) {
      return new Response(JSON.stringify({ userVote: null, combatId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Vote retrieval error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
