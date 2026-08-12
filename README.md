# SuryaRakshak

Smart heatwave surveillance and advisory system for Indian regions.

## Project Structure
- `/client` - React frontend (Vite)
- `/server` - Express API backend (Open-Meteo & NASA POWER integration)

## Deploying on Vercel

### Option 1: Monorepo Deployment (Frontend + Backend on single Vercel project)
The repository includes a `vercel.json` configuration. Simply import the repository on Vercel root and deploy. The backend serverless endpoints will be served directly at `/api/*`.

### Option 2: Separate Backend Deployment
If deploying the backend separately (e.g., Render, Railway, Vercel Serverless Function):
Set the environment variable `VITE_API_BASE_URL` in your Vercel frontend project settings:
```
VITE_API_BASE_URL=https://your-backend-url.com
```
