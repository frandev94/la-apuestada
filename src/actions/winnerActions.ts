import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import type { EventParticipantsName } from '@/constants/participants';
import {
  clearAllCombatWinners,
  deleteCombatWinner,
  getCombatWinner,
  upsertCombatWinner,
} from '@/lib/db/winner-repository';
import { getUserFromRequest } from '@/lib/session';
import { ActionError } from 'astro/actions/runtime/virtual/shared.js';

const winnerActions = {
  setWinner: defineAction({
    input: z.object({
      combatId: z.number(),
      participantId: z.string(),
    }),
    handler: async (input, { request }) => {
      const user = await getUserFromRequest(request);
      if (!user || !user.id || !user.isAdmin)
        throw new ActionError({ code: 'UNAUTHORIZED' });
      return await upsertCombatWinner({
        combatId: input.combatId,
        participantId: input.participantId as EventParticipantsName,
        winner: input.participantId as EventParticipantsName,
      }).catch((error) => {
        console.error('Error setting winner:', error);
        throw new Error('Failed to set winner');
      });
    },
  }),
  getWinner: defineAction({
    input: z.object({
      combatId: z.number(),
    }),
    handler: async ({ combatId }, { request }) => {
      const user = await getUserFromRequest(request);
      if (!user || !user.id) throw new ActionError({ code: 'UNAUTHORIZED' });
      return await getCombatWinner(combatId).catch((error) => {
        console.error('Error retrieving winner:', error);
        throw new Error('Failed to retrieve winner');
      });
    },
  }),
  clearWinners: defineAction({
    input: z.object({
      confirm: z.boolean(),
    }),
    handler: async ({ confirm }, { request }) => {
      const user = await getUserFromRequest(request);
      if (!user || !user.id || !user.isAdmin)
        throw new ActionError({ code: 'UNAUTHORIZED' });
      if (!confirm) {
        throw new Error('Winner clearing not confirmed');
      }
      return await clearAllCombatWinners().catch((error) => {
        console.error('Error clearing winners:', error);
        throw new Error('Failed to clear winners');
      });
    },
  }),
  deleteCombatWinner: defineAction({
    input: z.object({
      combatId: z.number(),
    }),
    handler: async ({ combatId }, { request }) => {
      const user = await getUserFromRequest(request);
      if (!user || !user.id || !user.isAdmin)
        throw new ActionError({ code: 'UNAUTHORIZED' });
      return await deleteCombatWinner(combatId).catch((error) => {
        console.error('Error deleting winner:', error);
        throw new Error('Failed to delete winner');
      });
    },
  }),
};

export type SetWinner = typeof winnerActions.setWinner;

export default winnerActions;
