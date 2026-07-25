# La Apuestada

A modern web application for managing betting pools and predictions for **La Velada del Año** - the biggest Spanish-speaking content creator boxing event.

**La Velada del Año** is an annual boxing event organized by popular streamer Ibai, featuring influencers, streamers, and content creators in epic boxing matches. This application helps fans create and manage betting pools for the fights, track predictions, and engage with the community around this massive event.

## ✨ Features

- 🥊 Boxing match prediction pools
- 📊 Participant and bet management  
- 🎯 Clean and modern interface optimized for La Velada
- 🚀 Built with Astro for optimal performance
- 🧪 Comprehensive testing with Vitest
- 📱 Responsive design for watching on any device


## 🚀 Project Structure

The project follows a clean and organized structure:

```text
/
├── public/            # Static assets (favicon, images, etc.)
├── scripts/           # One-off scripts (seed, etc.)
├── src/
│   ├── assets/        # Project assets (SVGs, images)
│   ├── components/    # Reusable UI components
│   ├── config/        # Year-specific combat configs (2025, 2026, …)
│   ├── constants/     # Shared constants (combats, participants, …)
│   ├── layouts/       # Page layout templates
│   ├── lib/           # Utility functions and shared logic
│   │   └── db/        # Drizzle schema + Turso client + repositories
│   ├── pages/         # Application pages and routes
│   └── styles/        # Global stylesheets
├── drizzle.config.ts  # Drizzle Kit config (Turso dialect)
└── package.json       # Project dependencies and scripts
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                                    |
| :------------------------ | :-------------------------------------------------------- |
| `npm install`             | Installs dependencies                                     |
| `npm run dev`             | Starts local dev server at `localhost:4321`               |
| `npm run build`           | Build your production site to `./dist/`                   |
| `npm run preview`         | Preview your build locally, before deploying              |
| `npm run check`           | Astro type / diagnostics check                            |
| `npm run lint`            | Biome lint (alias of `biome check`)                       |
| `npm run lint:fix`        | Biome autofix                                             |
| `npm run test`            | Run tests with Vitest                                     |
| `npm run test:coverage`   | Run tests with coverage report                            |
| `npm run db:push`         | Push Drizzle schema to **dev** Turso DB (`.env.dev`)      |
| `npm run db:push:prod`    | Push Drizzle schema to **prod** Turso DB (`.env.prod`)    |
| `npm run db:seed`         | Seed demo data into dev Turso DB                          |
| `npm run db:seed:prod`    | Seed demo data into prod Turso DB                         |
| `npm run db:studio`       | Open Drizzle Studio against dev Turso DB                  |

## 🛠️ Tech Stack

- **Framework**: Astro 7 (SSR via `@astrojs/vercel`)
- **UI**: React 19 + TailwindCSS 4
- **Database**: [Turso](https://turso.tech/) (libSQL) via `@libsql/client`
- **ORM / migrations**: [drizzle-orm](https://orm.drizzle.team/) + `drizzle-kit`
- **Auth**: `auth-astro` with Discord OAuth
- **Unit Testing**: Vitest
- **Code Quality**: Biome (linting & formatting)
- **Language**: TypeScript

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.dev` and fill in your Turso dev DB URL + token:
   ```
   TURSO_DATABASE_URL=libsql://…
   TURSO_AUTH_TOKEN=…
   ```
   You will also want `AUTH_SECRET`, `AUTH_TRUST_HOST`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` and `DEFAULT_USER_PASSWORD` for full local dev.
4. Push the schema to your dev DB: `npm run db:push`
5. (Optional) Seed demo data: `npm run db:seed`
6. Start the development server: `npm run dev`
7. Open your browser to `http://localhost:4321`

## 🧪 Testing

This project includes comprehensive testing coverage:

- **Run tests**: `npm run test`
- **Watch mode**: `npm run test:watch`
- **Coverage report**: `npm run test:coverage`
- **UI for tests**: `npm run test:ui` (Vitest UI)

The project maintains focused test coverage with unit tests for detailed logic testing and API tests for integration validation.

## 📋 Development

This project includes comprehensive development tools:

- **Code Quality**: Biome for linting and formatting
- **Type Safety**: TypeScript with strict configuration
- **Pre-commit Hooks**: Husky with lint-staged for quality enforcement
- **Database**: Drizzle ORM against Turso; schema lives in `src/lib/db/schema.ts`, repositories in `src/lib/db/*-repository.ts`, and Drizzle Kit config in `drizzle.config.ts`.

### Environment files

| File           | Purpose                                | Tracked? |
| -------------- | -------------------------------------- | -------- |
| `.env.example` | Template for the env files below       | ✅        |
| `.env.dev`     | Turso dev DB credentials               | ❌ (gitignored via `.env.*`) |
| `.env.prod`    | Turso prod DB credentials              | ❌ (gitignored via `.env.*`) |

`db:push`, `db:seed` and `db:studio` read from `.env.dev` by default. The `:prod` variants read from `.env.prod` (loaded via `dotenv-cli`).

## 🥊 About La Velada del Año

La Velada del Año is an annual boxing event that brings together the biggest Spanish-speaking content creators, streamers, and influencers. The event features:

- Epic boxing matches between popular internet personalities
- Millions of viewers across streaming platforms
- Massive community engagement and predictions
- High-production value entertainment event

This application helps fans engage with the event by creating betting pools, making predictions, and sharing the excitement with friends.

## 🔗 Related Links

- [Official La Velada Website](https://www.infolavelada.com/)
- [Watch on Twitch (Ibai)](https://twitch.tv/ibai)
