# SuryaRakshak

Smart heatwave surveillance and advisory system for Indian regions.

## Project Structure
- `/client` - React frontend (Vite)
- `/server` - Express API backend (Open-Meteo & NASA POWER integration)

## Render Deployment Settings (Backend)

When creating a **Web Service** on [Render.com](https://render.com):

- **Environment**: `Node`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start` (or `node src/index.js`)

Or simply use the included Blueprint by selecting **New -> Blueprint** and connecting your repository (`render.yaml` will configure everything automatically).

## Vercel Deployment Settings (Frontend)

1. Deploy the `/client` directory on Vercel or point the Vercel Root Directory to `client`.
2. Add Environment Variable in Vercel settings:
   ```
   VITE_API_BASE_URL=https://<your-render-backend-name>.onrender.com
   ```
