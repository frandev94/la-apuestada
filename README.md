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
├── public/          # Static assets (favicon, images, etc.)
├── src/
│   ├── assets/      # Project assets (SVGs, images)
│   ├── components/  # Reusable UI components
│   ├── data/        # Data models and type definitions
│   ├── layouts/     # Page layout templates
│   ├── lib/         # Utility functions and shared logic
│   ├── pages/       # Application pages and routes
│   └── styles/      # Global stylesheets
├── test/            # Test files and test configuration
└── package.json     # Project dependencies and scripts
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run test`            | Run all tests (unit, API, and e2e)              |
| `npm run test:unit-api`   | Run only unit and API tests with Vitest         |
| `npm run test:coverage`   | Run tests with coverage report                  |
| `npm run test:e2e`        | Run end-to-end tests with Playwright            |
| `npm run test:e2e:ui`     | Run e2e tests with interactive UI               |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🛠️ Tech Stack

- **Framework**: Astro
- **Database**: Astro DB
- **Styling**: CSS with modern features + TailwindCSS
- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **Code Quality**: Biome (linting & formatting)
- **Language**: TypeScript

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to `http://localhost:4321`

## 🧪 Testing

This project includes comprehensive testing coverage:

### Unit & Integration Tests (Vitest)
- **Run all tests**: `npm run test` (includes unit, API, and e2e tests)
- **Run only unit/API tests**: `npm run test:unit-api`
- **Watch mode**: `npm run test:watch`
- **Coverage report**: `npm run test:coverage`
- **Test specific areas**: `npm run test:api`, `npm run test:unit`

### End-to-End Tests (Playwright)
- **Run all tests**: `npm test` (includes unit, API, and e2e tests)
- **Run only e2e tests**: `npm run test:e2e`
- **Interactive UI**: `npm run test:e2e:ui`
- **Debug mode**: `npm run test:e2e:debug`
- **Help to generate tests**: `npm run test:e2e:codegen`

The project maintains focused test coverage with unit tests for detailed logic testing and e2e tests for API integration validation. See [E2E Testing Documentation](./docs/e2e-testing.md) for more details.

## 📋 Development

This project includes comprehensive development tools:
- **Code Quality**: Biome for linting and formatting
- **Type Safety**: TypeScript with strict configuration
- **Pre-commit Hooks**: Husky with lint-staged for quality enforcement
- **Database**: Astro DB with migrations and seeding

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

