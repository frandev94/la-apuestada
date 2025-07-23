import { actions } from 'astro:actions';
import type { UserRecord } from '@/lib/db/user-repository';
import { laVeladaCombats } from '../../constants/combats';
import { UserProvider } from '../UserContext';
import { VotingCard } from './VotingCard';

interface VotingPageProps {
  className?: string;
  loggedUser?: UserRecord | null;
}

export function VotingPage({ className = '', loggedUser }: VotingPageProps) {
  const handleResetVotes = () => {
    if (
      confirm(
        'Are you sure you want to reset all votes? This action cannot be undone.',
      )
    ) {
      actions.voteActions
        .clearVotes({ confirm: true })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error('Failed to reset votes:', error);
          alert('An error occurred while resetting votes. Please try again.');
        });
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 py-8 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            La Velada del Año - Combat Voting
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vote for your favorite fighter in each combat! Choose wisely between
            the two fighters. You can only vote once per combat.
          </p>
        </div>

        {/* Voting Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Combats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserProvider initialUser={loggedUser}>
              {laVeladaCombats.map((combat) => (
                <VotingCard key={combat.id} combat={combat} />
              ))}
            </UserProvider>
          </div>
        </div>

        {/* Admin Controls */}
        {loggedUser?.isAdmin && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleResetVotes}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Reset All Votes (Admin)
            </button>
            <p className="text-sm text-gray-500 mt-2">
              ⚠️ This will clear all votes and reset user sessions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
