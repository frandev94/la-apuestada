import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import type { EventParticipantsName } from '@/constants/participants';
import type { VoteInput } from '@/lib/db/vote-repository';
import { castVote } from '@/lib/voting';

const voteActions = {
  castVote: defineAction({
    input: z.object({
      userId: z.string(),
      participantId: z.string(),
      combatId: z.number(),
    }),
    handler: async (input: {
      userId: string;
      participantId: string;
      combatId: number;
    }) => {
      const voteInput: VoteInput = {
        userId: input.userId,
        participantId: input.participantId as EventParticipantsName,
        combatId: input.combatId,
      };

      // Perform some server-side logic with the vote
      console.log(`Casting vote for participant: ${voteInput.participantId}`);

      return await castVote(voteInput);
    },
  }),
};

export default voteActions;
