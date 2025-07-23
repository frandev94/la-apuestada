# Voting Components

This directory contains the individual voting components that follow SOLID principles for better maintainability, testability, and reusability.

## File Structure

```text
voting/
├── index.ts                 # Barrel export file
├── types.ts                 # All TypeScript interfaces and types
├── themes.ts                # Theme configurations (Open/Closed Principle)
├── fighterDataFactory.ts    # Factory function for creating fighter data
├── useVotingLogic.ts        # Custom hook for voting state management
├── VotingCard.tsx           # Main voting card component (orchestrator)
├── FighterDisplay.tsx       # Fighter avatar and name display
├── VoteCountDisplay.tsx     # Vote count display component
├── VotingButton.tsx         # Voting button with states
├── ErrorDisplay.tsx         # Error message display
├── CombatHeader.tsx         # Combat title and description
├── VSDivider.tsx           # VS separator component
├── VoteResultDisplay.tsx    # Shows user's vote result
└── FighterContainer.tsx     # Composed container using all above components
```

## SOLID Principles Implementation

### 1. Single Responsibility Principle (SRP) ✅

Each component has only one reason to change:

- **FighterDisplay**: Only handles fighter visual display
- **VoteCountDisplay**: Only handles vote count visualization
- **VotingButton**: Only handles voting button logic and states
- **ErrorDisplay**: Only handles error message display
- **CombatHeader**: Only handles combat title display
- **VSDivider**: Only handles the VS separator
- **VoteResultDisplay**: Only handles showing user's vote result
- **useVotingLogic**: Only handles voting state management

### 2. Open/Closed Principle (OCP) ✅

- **Themes**: Easy to add new themes without modifying existing code
- **Components**: Easy to extend functionality through composition
- New voting behaviors can be added without changing existing components

### 3. Liskov Substitution Principle (LSP) ✅

- **Theme implementations**: All themes are completely substitutable
- **Component interfaces**: Components implementing the same interface are interchangeable

### 4. Interface Segregation Principle (ISP) ✅

- **Segregated interfaces**: Components only depend on the interfaces they use
- **No forced dependencies**: Clean, focused interfaces

### 5. Dependency Inversion Principle (DIP) ✅

- **Abstraction dependencies**: Components depend on abstractions, not concretions
- **Loose coupling**: High-level components don't depend on implementation details

## Usage

### Basic Usage

```tsx
import { VotingCard } from './voting/VotingCard';

<VotingCard combat={combat} onVoteChange={handleVoteChange} />
```

### Using Individual Components

```tsx
import { 
  FighterContainer, 
  blueTheme, 
  redTheme 
} from './voting';

<FighterContainer
  fighterData={fighterData}
  votingState={votingState}
  onVote={handleVote}
  theme={blueTheme}
/>
```

### Adding New Themes

```tsx
// In themes.ts
export const customTheme: ThemeConfig = {
  voteCountColor: 'text-orange-600',
  buttonStyles: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
  loadingStyles: 'bg-orange-400 text-white cursor-wait'
};
```

### Creating Custom Voting Logic

```tsx
import { useVotingLogic } from './voting';

const { votingState, handleVote, error } = useVotingLogic(combat, onVoteChange);
```

## Benefits

1. **Maintainability**: Each component has a single, clear responsibility
2. **Testability**: Small, focused components are easier to test in isolation
3. **Reusability**: Components can be reused in different contexts
4. **Extensibility**: Easy to add new themes, components, or behaviors
5. **Type Safety**: Strong TypeScript interfaces ensure compile-time safety
6. **Performance**: Smaller components enable better code splitting and lazy loading

## Testing

Each component can be tested independently:

```tsx
// Example test for FighterDisplay
import { render } from '@testing-library/react';
import { FighterDisplay } from './FighterDisplay';

test('renders fighter information', () => {
  const fighterData = {
    fighter: { id: 'test', name: 'Test Fighter', avatar: '/test.jpg' },
    voteCount: 5
  };
  
  render(<FighterDisplay fighterData={fighterData} />);
  // Test assertions...
});
```
