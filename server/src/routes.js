// Express endpoints for full application
export function registerExtraRoutes(app) {
  // 1. Forecast & Trends Endpoint
  app.get('/api/forecast', (_req, res) => {
    res.json({
      hourlyTrend: [
        { time: '06:00', temp: 28, heatIndex: 30, uv: 2 },
        { time: '09:00', temp: 33, heatIndex: 37, uv: 5 },
        { time: '12:00', temp: 39, heatIndex: 45, uv: 9 },
        { time: '15:00', temp: 42, heatIndex: 48, uv: 10 },
        { time: '18:00', temp: 37, heatIndex: 41, uv: 4 },
        { time: '21:00', temp: 32, heatIndex: 35, uv: 0 }
      ],
      sevenDayForecast: [
        { day: 'Mon', maxTemp: 41, minTemp: 29, heatIndex: 46, risk: 'High' },
        { day: 'Tue', maxTemp: 43, minTemp: 30, heatIndex: 49, risk: 'Severe' },
        { day: 'Wed', maxTemp: 44, minTemp: 31, heatIndex: 51, risk: 'Severe' },
        { day: 'Thu', maxTemp: 40, minTemp: 28, heatIndex: 44, risk: 'Moderate' },
        { day: 'Fri', maxTemp: 38, minTemp: 27, heatIndex: 41, risk: 'Moderate' },
        { day: 'Sat', maxTemp: 39, minTemp: 28, heatIndex: 43, risk: 'Moderate' },
        { day: 'Sun', maxTemp: 42, minTemp: 29, heatIndex: 47, risk: 'High' }
      ]
    });
  });

  // 2. Health Advisories & Safety Protocols
  app.get('/api/health-advisories', (_req, res) => {
    res.json([
      {
        id: 'adv-1',
        title: 'Prevent Heat Stroke & Heat Exhaustion',
        category: 'Medical',
        severity: 'Critical',
        targetAudience: 'General Public & Outdoor Workers',
        content: 'Drink at least 3-4 liters of water daily. Avoid alcohol, caffeine, and carbonated drinks. Wear lightweight, loose, light-colored cotton clothing.',
        doList: ['Stay hydrated with ORS, buttermilk, or lemon water', 'Cover your head with a cloth or umbrella when outside', 'Keep animals in shaded areas with fresh water'],
        dontList: ['Do not step out between 12:00 PM and 3:30 PM', 'Do not leave children or pets inside parked vehicles', 'Do not consume high-protein foods during heat peaks']
      },
      {
        id: 'adv-2',
        title: 'Agricultural & Livestock Heat Protection',
        category: 'Agriculture',
        severity: 'High',
        targetAudience: 'Farmers & Livestock Keepers',
        content: 'Schedule crop irrigation during early morning or evening hours to prevent water loss via evaporation. Provide cooling sheds and water sprayers for cattle.',
        doList: ['Apply mulch to retain soil moisture', 'Provide continuous clean drinking water for poultry & livestock', 'Use shade nets for delicate nurseries'],
        dontList: ['Avoid spraying pesticides during maximum daylight temperatures', 'Do not overcrowd animal shelters']
      },
      {
        id: 'adv-3',
        title: 'Urban Heat Island Mitigation',
        category: 'Urban Planning',
        severity: 'Moderate',
        targetAudience: 'Municipal & Field Workers',
        content: 'Deploy water sprinkling trucks across major asphalt corridors and high-density markets. Keep community cooling shelters open 24/7.',
        doList: ['Set up hydration booths at bus stops and metro hubs', 'Paint roofs with reflective white thermal paint (Cool Roofs)', 'Ensure public parks remain open during daytime hours'],
        dontList: ['Avoid unnecessary outdoor construction during peak afternoon hours', 'Do not burn organic waste in urban centers']
      }
    ]);
  });

  // 3. Vulnerability Map & District Risk Matrix
  app.get('/api/vulnerability', (_req, res) => {
    res.json({
      summary: {
        totalDistricts: 142,
        extremeVulnerability: 18,
        highVulnerability: 44,
        moderateVulnerability: 58,
        lowVulnerability: 22
      },
      districts: [
        { id: 'd1', name: 'Nagpur East', state: 'Maharashtra', population: '2.4M', vulnerabilityScore: 92, riskTier: 'Extreme', coolingCenters: 14, hospitalBeds: 450 },
        { id: 'd2', name: 'Jaipur Urban', state: 'Rajasthan', population: '3.1M', vulnerabilityScore: 88, riskTier: 'Extreme', coolingCenters: 22, hospitalBeds: 620 },
        { id: 'd3', name: 'Delhi North West', state: 'Delhi NCR', population: '3.6M', vulnerabilityScore: 85, riskTier: 'Extreme', coolingCenters: 29, hospitalBeds: 890 },
        { id: 'd4', name: 'Ahmedabad Central', state: 'Gujarat', population: '2.8M', vulnerabilityScore: 79, riskTier: 'High', coolingCenters: 18, hospitalBeds: 540 },
        { id: 'd5', name: 'Lucknow Metro', state: 'Uttar Pradesh', population: '3.4M', vulnerabilityScore: 74, riskTier: 'High', coolingCenters: 16, hospitalBeds: 710 },
        { id: 'd6', name: 'Patna Rural', state: 'Bihar', population: '2.1M', vulnerabilityScore: 71, riskTier: 'High', coolingCenters: 9, hospitalBeds: 320 }
      ]
    });
  });

  // 4. Resource Allocation & Cooling Shelters Directory
  app.get('/api/resources', (_req, res) => {
    res.json([
      { id: 'r1', name: 'Central District Cooling Hub #1', type: 'Cooling Shelter', address: 'Connaught Place Sector 4, New Delhi', capacity: 350, currentOccupancy: 120, status: 'Active', contacts: '+91 11 2345 6789' },
      { id: 'r2', name: 'Vidarbha Heat Relief Camp', type: 'Hydration Station', address: 'Sitabuldi Interchange, Nagpur', capacity: 600, currentOccupancy: 280, status: 'Active', contacts: '+91 712 987 6543' },
      { id: 'r3', name: 'Pink City Thermal Protection Center', type: 'Medical Emergency Ward', address: 'MI Road, Jaipur', capacity: 200, currentOccupancy: 95, status: 'Active', contacts: '+91 141 555 0199' },
      { id: 'r4', name: 'Yamuna Bank Water & Shelter Unit', type: 'Cooling Shelter', address: 'Kashmere Gate, Delhi', capacity: 450, currentOccupancy: 310, status: 'Active', contacts: '+91 11 8888 2222' }
    ]);
  });
}
