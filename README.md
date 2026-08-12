# SuryaRakshak

SuryaRakshak is a full-stack heatwave surveillance and advisory platform for Indian regions.

## Stack

- React + Vite frontend
- Node.js + Express backend
- Shared JSON API for risk summaries, advisories, and alerts

## Project Layout

- `client`: React dashboard with region cards, alerts, and advisory panels
- `server`: Express API serving regional heat-risk data

## Development

Install dependencies from the repository root, then run both apps together:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The frontend uses a Vite proxy to reach the API during development.
