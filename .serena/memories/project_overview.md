# Demeter AI 2.0 — Frontend Template

## Purpose
Multi-tenant React frontend template for the Demeter AI 2.0 platform. Industry-agnostic — clone, customize per vertical (Cultivos, Comerciantes, Vending, etc.), and deploy to GCP Cloud Run.

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| UI | React | 19.2 |
| Build | Vite | 7.3 |
| Language | TypeScript (strict mode) | 5.9 |
| Styling | Tailwind CSS | 4.1 |
| Auth | Auth0 (@auth0/auth0-react) | 2.3 |
| Server State | TanStack Query | 5.90 |
| Client State | Zustand | 5.0 |
| Forms | react-hook-form + Zod | 7.55 / 3.25 |
| Charts | Recharts | 2.15 |
| Maps | Leaflet + react-leaflet | 1.9 / 5.0 |
| Icons | Lucide React | 0.511 |
| Testing | Vitest + Testing Library + MSW | 4.0 / 16.3 / 2.7 |
| E2E | Playwright | 1.58 |

## Current Status (as of commit 4eba118)
- 162/162 tasks complete across 7 phases
- 239 source files (.ts/.tsx), 269 total committed
- 89/94 tests passing (5 pre-existing jsdom CORS failures)
- 10 test suites
- 0 TypeScript errors
- Build passes

## Pending Work
- E2E tests (real flows, not placeholders)
- Unit test coverage to 80%+
- PWA manifest + Service Worker
- ESLint 9 rules refinement
- Accessibility audit (WCAG 2.1 AA)
- Performance audit (Lighthouse)
- CI/CD pipeline activation (Cloud Build)
