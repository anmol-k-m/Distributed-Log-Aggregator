import { useMemo, useState, useContext } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

// Dummy data for bar chart - log count by severity
const severityData = [
  { severity: 'Info', count: 148 },
  { severity: 'Warning', count: 89 },
  { severity: 'Error', count: 34 },
  { severity: 'Critical', count: 12 },
];

// Dummy data for line chart - logs over time
const timeSeriesData = [
  { date: 'Mar 13, 2026', logs: 240 },
  { date: 'Mar 14, 2026', logs: 321 },
  { date: 'Mar 15, 2026', logs: 289 },
  { date: 'Mar 16, 2026', logs: 451 },
  { date: 'Mar 17, 2026', logs: 389 },
  { date: 'Mar 18, 2026', logs: 512 },
  { date: 'Mar 19, 2026', logs: 478 },
];

// Dummy data for pie chart - logs by service
const serviceData = [
  { name: 'API Server', value: 245 },
  { name: 'Database', value: 189 },
  { name: 'Cache Manager', value: 156 },
  { name: 'Auth Service', value: 142 },
  { name: 'Payment Gateway', value: 98 },
  { name: 'Email Service', value: 87 },
  { name: 'Storage Service', value: 76 },
];

// Colors for charts
const SEVERITY_COLORS = {
  Info: '#3b82f6',
  Warning: '#f59e0b',
  Error: '#ef4444',
  Critical: '#7c2d12',
};

const SERVICE_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-2 border rounded shadow ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
        <p className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {payload[0].payload.severity || payload[0].payload.date || payload[0].payload.name}
        </p>
        <p className={`text-sm ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
          {payload[0].value} {payload[0].name}
        </p>
      </div>
    );
  }
  return null;
};

export default function LogAnalytics({ logs = [] }) {
  const { isDark } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('all');

  const chartSeverityData = useMemo(() => {
    if (!logs.length) {
      return severityData.map((item) => ({
        ...item,
        color: SEVERITY_COLORS[item.severity],
      }));
    }

    const map = { info: 0, warning: 0, error: 0 };
    for (let i = 0; i < logs.length; i++) {
      const sev = String(logs[i].severity || '').toLowerCase();
      if (sev in map) {
        map[sev] += 1;
      }
    }

    return [
      { severity: 'Info', count: map.info, color: SEVERITY_COLORS.Info },
      { severity: 'Warning', count: map.warning, color: SEVERITY_COLORS.Warning },
      { severity: 'Error', count: map.error, color: SEVERITY_COLORS.Error },
      { severity: 'Critical', count: 0, color: SEVERITY_COLORS.Critical },
    ];
  }, [logs]);

  const chartTimeSeriesData = useMemo(() => {
    if (!logs.length) {
      return timeSeriesData;
    }

    const bucketMap = new Map();
    for (let i = 0; i < logs.length; i++) {
      const raw = logs[i].rawTimestamp || logs[i].timestamp;
      const date = new Date(raw);
      if (Number.isNaN(date.getTime())) {
        continue;
      }

      const key = date.toISOString().slice(0, 13) + ':00';
      bucketMap.set(key, (bucketMap.get(key) || 0) + 1);
    }

    return Array.from(bucketMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([date, count]) => ({ date, logs: count }));
  }, [logs]);

  const chartServiceData = useMemo(() => {
    if (!logs.length) {
      return serviceData;
    }

    const serviceMap = new Map();
    for (let i = 0; i < logs.length; i++) {
      const name = logs[i].service || 'unknown-service';
      serviceMap.set(name, (serviceMap.get(name) || 0) + 1);
    }

    return Array.from(serviceMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={24} className={isDark ? 'text-cyan-400' : 'text-blue-600'} />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Analytics</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Charts
        </button>
        <button
          onClick={() => setActiveTab('severity')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'severity'
              ? 'bg-blue-600 text-white'
              : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Severity
        </button>
        <button
          onClick={() => setActiveTab('timeseries')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'timeseries'
              ? 'bg-blue-600 text-white'
              : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Timeline
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'service'
              ? 'bg-blue-600 text-white'
              : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Services
        </button>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Log Count by Severity */}
        {(activeTab === 'all' || activeTab === 'severity') && (
          <div className={`rounded-lg shadow p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Log Count by Severity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartSeverityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="severity" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <Legend />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} activeBar={{ fillOpacity: 0.85 }}>
                  {chartSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Line Chart - Logs Over Time */}
        {(activeTab === 'all' || activeTab === 'timeseries') && (
          <div className={`rounded-lg shadow p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Logs Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="date" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="logs"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Total Logs"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart - Logs by Service */}
        {(activeTab === 'all' || activeTab === 'service') && (
          <div className={`rounded-lg shadow p-6 lg:col-span-1 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Logs by Service
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartServiceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartServiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SERVICE_COLORS[index % SERVICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} logs`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend for Pie Chart */}
        {(activeTab === 'all' || activeTab === 'service') && activeTab !== 'all' && (
          <div className={`rounded-lg shadow p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Service Breakdown
            </h3>
            <div className="space-y-2">
              {chartServiceData.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor: SERVICE_COLORS[index % SERVICE_COLORS.length],
                      }}
                    />
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {service.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {service.value} logs
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend for All Tabs */}
        {activeTab === 'all' && (
          <div className={`rounded-lg shadow p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Service Summary
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chartServiceData.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: SERVICE_COLORS[index % SERVICE_COLORS.length],
                      }}
                    />
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {service.name}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {service.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-lg shadow p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Logs</p>
          <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {chartSeverityData.reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
        <div className={`rounded-lg shadow p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Error Rate</p>
          <p className="text-2xl font-bold text-red-500 mt-2">
            {(
              ((chartSeverityData.find(d => d.severity === 'Error')?.count || 0) /
                Math.max(chartSeverityData.reduce((sum, item) => sum + item.count, 0), 1)) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
        <div className={`rounded-lg shadow p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Logs/Day</p>
          <p className={isDark ? 'text-2xl font-bold text-cyan-400 mt-2' : 'text-2xl font-bold text-blue-600 mt-2'}>
            {(
              chartTimeSeriesData.reduce((sum, item) => sum + item.logs, 0) /
              Math.max(chartTimeSeriesData.length, 1)
            ).toFixed(0)}
          </p>
        </div>
        <div className={`rounded-lg shadow p-4 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Services</p>
          <p className={isDark ? 'text-2xl font-bold text-emerald-400 mt-2' : 'text-2xl font-bold text-green-600 mt-2'}>
            {chartServiceData.length}
          </p>
        </div>
      </div>
    </div>
  );
}
