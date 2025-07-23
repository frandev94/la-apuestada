import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import type { EventParticipantsName } from '@/constants/participants';
import { getVoteByUser } from '@/lib/db/vote-repository';
import { getUserFromRequest } from '@/lib/session';
import { castVote, clearVotes } from '@/lib/voting';
import { ActionError } from 'astro/actions/runtime/virtual/shared.js';

const voteActions = {
  castVote: defineAction({
    input: z.object({
      participantId: z.string(),
      combatId: z.number(),
    }),
    handler: async (input, { request }) => {
      const user = await getUserFromRequest(request);
      if (!user || !user.id) throw new ActionError({ code: 'UNAUTHORIZED' });
      return await castVote({
        userId: user.id,
        participantId: input.participantId as EventParticipantsName,
        combatId: input.combatId,
      }).catch((error) => {
        console.error('Error casting vote:', error);
        throw new Error('Failed to cast vote');
      });
    },
  }),
  clearVotes: defineAction({
    input: z.object({
      confirm: z.boolean(),
    }),
    handler: async ({ confirm }, { request }) => {
      const user = await getUserFromRequest(request);
      if (!user || !user.id) throw new ActionError({ code: 'UNAUTHORIZED' });
      // Optionally, check for admin here if needed
      if (!confirm && !user.isAdmin) {
        throw new Error('Vote clearing not confirmed');
      }
      console.log('Clearing all votes');
      return await clearVotes();
    },
  }),
  getVoteState: defineAction({
    input: z.object({
      combatId: z.number(),
    }),
    handler: async ({ combatId }, { request }) => {
      const user = await getUserFromRequest(request);
      if (!user || !user.id) throw new ActionError({ code: 'UNAUTHORIZED' });
      return await getVoteByUser(user.id, combatId).catch((error) => {
        console.error('Error retrieving vote state:', error);
        throw new Error('Failed to retrieve vote state');
      });
    },
  }),
};

export type CastVote = typeof voteActions.castVote;

export default voteActions;
