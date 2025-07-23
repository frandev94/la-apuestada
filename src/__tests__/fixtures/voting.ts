import type { Participant } from '@/components/voting/types';
import type { VoteResults } from '@/lib/voting';

/**
 * Test fixtures for voting-related components and functionality
 * Centralized test data management for consistent testing
 */

export const mockParticipants: Participant[] = [
  {
    id: 'peereira',
    name: 'Peereira',
    avatar: '/avatars/peereira.jpg',
  },
  {
    id: 'grefg',
    name: 'Grefg',
    avatar: '/avatars/grefg.jpg',
  },
  {
    id: 'westcol',
    name: 'Westcol',
    avatar: '/avatars/westcol.jpg',
  },
  {
    id: 'rivaldios',
    name: 'Rivaldios',
    avatar: '/avatars/rivaldios.jpg',
  },
];

export const mockVotes = [
  {
    participantId: 'peereira',
    timestamp: 1640995200000, // 2022-01-01T00:00:00Z
    userId: 'user_1640995200000_abcd1234',
  },
  {
    participantId: 'grefg',
    timestamp: 1640995260000, // 2022-01-01T00:01:00Z
    userId: 'user_1640995260000_efgh5678',
  },
  {
    participantId: 'peereira',
    timestamp: 1640995320000, // 2022-01-01T00:02:00Z
    userId: 'user_1640995320000_ijkl9012',
  },
  {
    participantId: 'westcol',
    timestamp: 1640995380000, // 2022-01-01T00:03:00Z
    userId: 'user_1640995380000_mnop3456',
  },
];

export const mockVoteResults: VoteResults[] = [
  {
    participantId: 'peereira',
    voteCount: 2,
  },
  {
    participantId: 'grefg',
    voteCount: 1,
  },
  {
    participantId: 'westcol',
    voteCount: 1,
  },
  {
    participantId: 'rivaldios',
    voteCount: 0,
  },
];

export const mockVoteResultsSorted: VoteResults[] = [
  {
    participantId: 'peereira',
    voteCount: 10,
  },
  {
    participantId: 'grefg',
    voteCount: 5,
  },
  {
    participantId: 'westcol',
    voteCount: 3,
  },
  {
    participantId: 'rivaldios',
    voteCount: 0,
  },
];

export const emptyVoteResults: VoteResults[] = [
  {
    participantId: 'peereira',
    voteCount: 0,
  },
  {
    participantId: 'grefg',
    voteCount: 0,
  },
  {
    participantId: 'westcol',
    voteCount: 0,
  },
  {
    participantId: 'rivaldios',
    voteCount: 0,
  },
];

export const testUserIds = {
  user1: 'test-user-id-1',
  user2: 'test-user-id-2',
  user3: 'test-user-id-3',
  defaultTestUser: 'test-user-id',
} as const;

export const votingErrorMessages = {
  alreadyVoted: 'User has already voted',
  invalidParticipant: 'Invalid participant',
  storageError: 'Storage error occurred',
} as const;

export const votingScenarios = {
  noVotes: {
    votes: [],
    voteResults: emptyVoteResults,
    totalVotes: 0,
  },
  someVotes: {
    votes: mockVotes,
    voteResults: mockVoteResults,
    totalVotes: 4,
  },
  manyVotes: {
    votes: mockVotes,
    voteResults: mockVoteResultsSorted,
    totalVotes: 18,
  },
} as const;
