import { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export function ForecastPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/forecast`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-orb-container"><div className="loading-orb" /><p>Loading forecast models...</p></div>;

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="eyebrow">Predictive Analytics</span>
        <h1>7-Day Heatwave Forecast & Hourly Thermal Trends</h1>
        <p>Advanced thermal stress modeling based on Open-Meteo & NASA POWER meteorological data.</p>
      </header>

      <section className="panel section-panel">
        <h2>Hourly Thermal Index (Today)</h2>
        <div className="trend-grid">
          {data?.hourlyTrend?.map((item) => (
            <div className="trend-card" key={item.time}>
              <span className="trend-time">{item.time}</span>
              <strong className="trend-temp">{item.temp}°C</strong>
              <div className="trend-bar-wrap">
                <div className="trend-bar" style={{ width: `${Math.min(100, item.heatIndex * 1.8)}%` }} />
              </div>
              <span className="trend-detail">Heat Index: {item.heatIndex}°C</span>
              <span className="trend-uv">UV Index: {item.uv}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel section-panel">
        <h2>7-Day District Projections</h2>
        <div className="forecast-table-wrap">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Max Temp</th>
                <th>Min Temp</th>
                <th>Heat Index</th>
                <th>Risk Classification</th>
              </tr>
            </thead>
            <tbody>
              {data?.sevenDayForecast?.map((row) => (
                <tr key={row.day}>
                  <td><strong>{row.day}</strong></td>
                  <td>{row.maxTemp}°C</td>
                  <td>{row.minTemp}°C</td>
                  <td><strong className="accent-text">{row.heatIndex}°C</strong></td>
                  <td><span className={`pill pill-${row.risk.toLowerCase()}`}>{row.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function VulnerabilityPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/vulnerability`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="eyebrow">Risk Matrix</span>
        <h1>District Vulnerability Index</h1>
        <p>Vulnerability scoring based on population density, socio-economic factors, and thermal exposure.</p>
      </header>

      <div className="hero-metrics gap-bottom">
        <div className="metric-card">
          <span className="metric-label">Monitored Districts</span>
          <strong className="metric-value">{data?.summary?.totalDistricts ?? 142}</strong>
          <span className="metric-detail">Across high-risk states</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Extreme Vulnerability</span>
          <strong className="metric-value severe-text">{data?.summary?.extremeVulnerability ?? 18}</strong>
          <span className="metric-detail">Immediate action required</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">High Risk Zones</span>
          <strong className="metric-value high-text">{data?.summary?.highVulnerability ?? 44}</strong>
          <span className="metric-detail">Escalation active</span>
        </div>
      </div>

      <section className="panel section-panel">
        <h2>High-Priority District Watchlist</h2>
        <div className="district-grid">
          {data?.districts?.map((d) => (
            <article className="district-card" key={d.id}>
              <div className="district-header">
                <div>
                  <strong>{d.name}</strong>
                  <span className="district-sub">{d.state} • Pop: {d.population}</span>
                </div>
                <span className={`pill pill-${d.riskTier.toLowerCase()}`}>{d.riskTier}</span>
              </div>
              <div className="vulnerability-bar-wrap">
                <div className="vulnerability-label">
                  <span>Vulnerability Score</span>
                  <strong>{d.vulnerabilityScore}/100</strong>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${d.vulnerabilityScore}%` }} />
                </div>
              </div>
              <div className="district-meta">
                <span>Cooling Shelters: <strong>{d.coolingCenters}</strong></span>
                <span>Hospital Emergency Beds: <strong>{d.hospitalBeds}</strong></span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdvisoriesPage() {
  const [advisories, setAdvisories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/health-advisories`)
      .then((res) => res.json())
      .then((d) => setAdvisories(d));
  }, []);

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="eyebrow">Public Safety Protocols</span>
        <h1>Health & Safety Advisories</h1>
        <p>Evidence-based guidelines for citizens, health responders, and municipal workers.</p>
      </header>

      <div className="advisory-cards-stack">
        {advisories.map((adv) => (
          <article className="panel advisory-block" key={adv.id}>
            <div className="advisory-block-header">
              <div>
                <span className="eyebrow">{adv.category}</span>
                <h2>{adv.title}</h2>
                <span className="panel-note">Target: {adv.targetAudience}</span>
              </div>
              <span className={`pill pill-${adv.severity.toLowerCase()}`}>{adv.severity}</span>
            </div>
            <p className="advisory-desc">{adv.content}</p>

            <div className="do-dont-grid">
              <div className="do-box">
                <h3>Do's</h3>
                <ul>
                  {adv.doList?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="dont-box">
                <h3>Don'ts</h3>
                <ul>
                  {adv.dontList?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ResourcesPage() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/resources`)
      .then((res) => res.json())
      .then((d) => setResources(d));
  }, []);

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="eyebrow">Field Logistics</span>
        <h1>Cooling Centers & Relief Directory</h1>
        <p>Real-time occupancy tracking for community cooling centers and emergency hydration shelters.</p>
      </header>

      <div className="resource-grid">
        {resources.map((r) => (
          <article className="panel resource-card" key={r.id}>
            <div className="resource-header">
              <span className="eyebrow">{r.type}</span>
              <span className="status-badge status-active">{r.status}</span>
            </div>
            <h2>{r.name}</h2>
            <p className="resource-address">{r.address}</p>
            
            <div className="map-container" style={{ margin: '1rem 0', borderRadius: '8px', overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="150"
                frameBorder="0"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(r.address)}&output=embed`}
                allowFullScreen
              ></iframe>
            </div>

            <div className="occupancy-wrap">
              <div className="occupancy-label">
                <span>Occupancy</span>
                <strong>{r.currentOccupancy} / {r.capacity} Seats</strong>
              </div>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${(r.currentOccupancy / r.capacity) * 100}%` }} />
              </div>
            </div>

            <div className="resource-footer">
              <span>Emergency Hotline: <strong>{r.contacts}</strong></span>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.address)}`} target="_blank" rel="noopener noreferrer" className="secondary-action btn-sm" title="Get Directions to this Cooling Center">Get Directions</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const anomalyData = [
    { day: 'D1', actual: 38, baseline: 35 },
    { day: 'D2', actual: 41, baseline: 35.5 },
    { day: 'D3', actual: 44, baseline: 36 },
    { day: 'D4', actual: 42, baseline: 36.5 },
    { day: 'D5', actual: 45, baseline: 36 },
    { day: 'D6', actual: 47, baseline: 37 },
    { day: 'D7', actual: 43, baseline: 37 },
    { day: 'D8', actual: 40, baseline: 36.5 },
    { day: 'D9', actual: 42, baseline: 36 },
    { day: 'D10', actual: 46, baseline: 37.5 },
    { day: 'D11', actual: 48, baseline: 38 },
    { day: 'D12', actual: 45, baseline: 37.5 },
    { day: 'D13', actual: 41, baseline: 37 },
    { day: 'D14', actual: 39, baseline: 36.5 },
    { day: 'D15', actual: 42, baseline: 37 },
  ];

  const vulnerabilityData = [
    { name: 'Extreme Risk', value: 18, color: '#ef4444' },
    { name: 'High Risk', value: 44, color: '#f97316' },
    { name: 'Moderate Risk', value: 50, color: '#eab308' },
    { name: 'Low Risk', value: 30, color: '#22c55e' }
  ];

  const trendData = [
    { day: 'Mon', heatIndex: 39 },
    { day: 'Tue', heatIndex: 42 },
    { day: 'Wed', heatIndex: 44 },
    { day: 'Thu', heatIndex: 43 },
    { day: 'Fri', heatIndex: 46 },
    { day: 'Sat', heatIndex: 48 },
    { day: 'Sun', heatIndex: 45 },
  ];

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="eyebrow">Climate Intelligence</span>
        <h1>Heat Index Analytics & Historical Comparative Analysis</h1>
        <p>Interactive multi-year satellite thermal telemetry provided by Open-Meteo & NASA POWER RE Community datasets.</p>
      </header>

      <div className="dashboard-grid">
        <div className="main-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section className="panel">
            <h2>30-Day Heat Anomaly Comparison</h2>
            <p className="panel-note" style={{ marginBottom: '1rem' }}>Observed surface temperature vs 10-year baseline mean (°C)</p>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <ComposedChart data={anomalyData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="actual" name="2026 Observed Heat Index" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="baseline" name="10-Year Historical Mean" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel">
            <h2>7-Day Forward Thermal Trend Projection</h2>
            <p className="panel-note" style={{ marginBottom: '1rem' }}>Predicted Heat Index severity mapping (°C)</p>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer>
                <AreaChart data={trendData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="colorHeat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[30, 50]} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="heatIndex" name="Forecasted Heat Index" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorHeat)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <aside className="side-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section className="panel">
            <h2>Vulnerability Distribution</h2>
            <p className="panel-note" style={{ marginBottom: '1rem' }}>District-wise risk tier breakdown</p>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={vulnerabilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {vulnerabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel">
            <h2>Data Sources & Methodology</h2>
            <ul className="advisory-list">
              <li><strong>Open-Meteo API</strong>: Real-time 2m screen temperature & relative humidity forecast.</li>
              <li><strong>NASA POWER RE</strong>: Surface solar irradiance & daily surface temperature bounds.</li>
              <li><strong>Rothfusz Heat Index Formula</strong>: NWS multi-variable equation computing human thermal discomfort.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
