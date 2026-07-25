# AGENTS.md - La Apuestada

## Key Commands

```bash
npm run dev        # Start dev server at localhost:4321
npm run build      # Build for production (remote mode)
npm run test       # Run Vitest tests
npm run test:watch # Watch mode
npm run lint       # Biome check
npm run check     # Astro typecheck
```

## Changing the Active Year

The app is config-driven. To switch years:

1. Edit `src/config/index.ts`
2. Change `ACTIVE_YEAR` to 2025 or 2026
3. Config files live in `src/config/{year}.ts`

## Architecture

- **Framework**: Astro 6 with SSR, React, TailwindCSS
- **Database**: Astro DB (tables: User, Vote, CombatWinner)
- **Auth**: auth-astro with Discord provider
- **Deployment**: Vercel adapter

## Config Files

- `src/config/2025.ts` - La Velada 5 (7 combats)
- `src/config/2026.ts` - La Velada 6 (10 combats)
- `laVeladaParticipants` and `laVeladaCombats` are auto-generated from config

## Tests

- Vitest with jsdom environment
- Tests live alongside source: `*.test.ts` and `*.test.tsx`
- Mock fixtures in `src/__tests__/fixtures/`
- Known issue: `useVotingLogic.test.ts` has 7 failing tests due to React 19 hooks setup - pre-existing

## Common Issues

- If tests fail with "Cannot read properties of undefined", check config imports are .ts not .json
- React hooks tests require proper React 19 setup in test environment
- Astro DB needs local DB for tests: auto-created on `npm run test`

## File Structure Notes

- `src/constants/combats.ts` and `participants.ts` derive from config
- API routes in `src/pages/api/`
- Components in `src/components/`
- Reusable lib code in `src/lib/`