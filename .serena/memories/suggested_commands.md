# Suggested Commands

## Development
```bash
npm run dev          # Start Vite dev server on port 3000
npm run build        # TypeScript check (tsc -b) + production Vite build
npm run preview      # Preview production build locally
```

## Testing
```bash
npm test             # Run Vitest test suites (single run)
npm run test:watch   # Vitest in watch mode
npm run test:coverage # Vitest with V8 coverage report
npm run test:e2e     # Playwright E2E tests
```

## Code Quality
```bash
npm run lint         # ESLint 9 flat config
npm run format       # Prettier formatting (src/**/*.{ts,tsx,css})
npx tsc --noEmit     # TypeScript strict check without emit
```

## Docker
```bash
docker-compose up --build   # Multi-stage build: node:22-alpine → nginx:1.27-alpine
```

## Git
```bash
git status           # Check working tree
git log --oneline    # View commit history
git diff             # View changes
```

## Environment Setup
```bash
cp .env.example .env  # Copy env template
npm ci                # Install dependencies (clean)
npm install           # Install dependencies (if no lock file)
```

## System (Linux)
```bash
ls, cd, grep, find, cat, head, tail  # Standard Linux utils
```
