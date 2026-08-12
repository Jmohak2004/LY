import express from 'express';
import cors from 'cors';
import {
  buildAdvisories,
  buildNotifications,
  calculateHeatIndex,
  getRiskLevel,
  regions,
  round
} from './heatwave.js';

const app = express();
const port = process.env.PORT || 3001;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed for ${url}`);
  }
  return response.json();
}

const REGION_COORDINATES = {
  'Delhi NCR, India': { latitude: 28.6139, longitude: 77.209 },
  'Jaipur, Rajasthan, India': { latitude: 26.9124, longitude: 75.7873 },
  'Nagpur, Maharashtra, India': { latitude: 21.1458, longitude: 79.0882 }
};

async function getCoordinates(query) {
  if (REGION_COORDINATES[query]) {
    return REGION_COORDINATES[query];
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');

    const data = await fetchJson(url.toString(), {
      headers: {
        'User-Agent': 'SuryaRakshak-Heatwave-Monitor/1.0 (https://github.com/Jmohak2004/LY)'
      }
    });

    const first = data[0];
    if (first) {
      return {
        latitude: Number(first.lat),
        longitude: Number(first.lon)
      };
    }
  } catch (err) {
    console.warn(`Geocoding failed for ${query}, using default:`, err.message);
  }

  return { latitude: 28.6139, longitude: 77.209 };
}

async function getWeatherSnapshot(latitude, longitude) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,uv_index_max');
  url.searchParams.set('timezone', 'auto');

  return fetchJson(url.toString());
}

async function getNasaPowerSnapshot(latitude, longitude) {
  try {
    const start = new Date();
    const end = new Date();
    const startString = start.toISOString().slice(0, 10).replace(/-/g, '');
    const endString = end.toISOString().slice(0, 10).replace(/-/g, '');
    const url = new URL('https://power.larc.nasa.gov/api/temporal/daily/point');
    url.searchParams.set('parameters', 'T2M_MAX,T2M_MIN,ALLSKY_SFC_SW_DWN');
    url.searchParams.set('community', 'RE');
    url.searchParams.set('longitude', longitude.toString());
    url.searchParams.set('latitude', latitude.toString());
    url.searchParams.set('start', startString);
    url.searchParams.set('end', endString);
    url.searchParams.set('format', 'JSON');

    return await fetchJson(url.toString());
  } catch (error) {
    console.warn('NASA POWER API request failed:', error.message);
    return null;
  }
}

function summarizeRegion(region, openMeteoData, nasaData) {
  const current = openMeteoData.current || {};
  const humidity = Number(current.relative_humidity_2m ?? 0);
  const temperature = Number(current.temperature_2m ?? 0);
  const heatIndex = calculateHeatIndex(temperature, humidity);
  const riskLevel = getRiskLevel(heatIndex);
  const nasaParameters = nasaData?.properties?.parameter || {};
  const firstNasaKey = Object.keys(nasaParameters)[0];
  const nasaValue = firstNasaKey ? nasaParameters[firstNasaKey][Object.keys(nasaParameters[firstNasaKey])[0]] : null;

  return {
    name: region.name,
    query: region.query,
    latitude: round(region.latitude, 4),
    longitude: round(region.longitude, 4),
    temperature: round(temperature, 1),
    humidity: round(humidity, 0),
    apparentTemperature: round(Number(current.apparent_temperature ?? heatIndex), 1),
    heatIndex,
    riskLevel,
    summary: `${region.name} is currently at ${riskLevel.toLowerCase()} heat risk.`,
    nassaPowerDaily: nasaValue ?? null,
    advisories: buildAdvisories({ name: region.name, riskLevel })
  };
}

async function buildRegionData(region) {
  const coordinates = await getCoordinates(region.query);
  const [openMeteoData, nasaData] = await Promise.all([
    getWeatherSnapshot(coordinates.latitude, coordinates.longitude),
    getNasaPowerSnapshot(coordinates.latitude, coordinates.longitude)
  ]);

  return summarizeRegion(
    {
      ...region,
      ...coordinates
    },
    openMeteoData,
    nasaData
  );
}

app.use(cors());
app.use(express.json());

app.get('/', (_request, response) => {
  response.json({ status: 'ok', message: 'SuryaRakshak API is operational', endpoints: ['/api/health', '/api/dashboard', '/api/regions'] });
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'suryarakshak-api' });
});

app.get('/api/dashboard', async (_request, response) => {
  try {
    const regionsData = await Promise.all(regions.map((region) => buildRegionData(region)));
    const summary = {
      activeAlerts: regionsData.filter((region) => region.riskLevel === 'Severe' || region.riskLevel === 'High').length,
      highRiskDistricts: regionsData.filter((region) => region.riskLevel === 'Severe' || region.riskLevel === 'High').length,
      averageHeatIndex: round(
        regionsData.reduce((total, region) => total + region.heatIndex, 0) / regionsData.length,
        1
      )
    };

    response.json({
      summary,
      regions: regionsData,
      notifications: buildNotifications(regionsData),
      generatedAt: new Date().toISOString(),
      sources: ['Open-Meteo', 'NASA POWER', 'Nominatim']
    });
  } catch (error) {
    response.status(500).json({
      error: 'Failed to load live heatwave data',
      message: error.message
    });
  }
});

app.get('/api/regions', async (_request, response) => {
  try {
    const regionsData = await Promise.all(regions.map((region) => buildRegionData(region)));
    response.json(regionsData);
  } catch (error) {
    response.status(500).json({
      error: 'Failed to load live region data',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`SuryaRakshak API listening on port ${port}`);
});