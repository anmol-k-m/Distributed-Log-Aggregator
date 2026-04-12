import { useState, useContext, useMemo } from 'react';
import {
  Home,
  BarChart3,
  AlertCircle,
  AlertTriangle,
  FileText,
  Sun,
  Moon,
  ChevronDown,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import LogTable from './components/LogTable';
import LogFilters from './components/LogFilters';
import LogAnalytics from './components/LogAnalytics';
import { ThemeContext } from './context/ThemeContext';
import useLogs from './hooks/useLogs';

// Metric Card Component
function MetricCard({ icon: Icon, title, value, trend, trendUp = true, isDark }) {
  return (
    <div className={`rounded-lg p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <Icon size={24} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${
          trendUp ? 'text-red-400' : 'text-green-400'
        }`}>
          {trendUp ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          {trend}
        </div>
      )}
    </div>
  );
}

// Service Status Card
function ServiceStatus({ name, status, uptime, isDark }) {
  const statusColors = {
    Healthy: 'text-green-400',
    Warning: 'text-yellow-400',
    Error: 'text-red-400',
  };

  const statusDotColors = {
    Healthy: 'bg-green-500',
    Warning: 'bg-yellow-500',
    Error: 'bg-red-500',
  };

  return (
    <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusDotColors[status]}`}></div>
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{`Uptime: ${uptime}`}</p>
        </div>
      </div>
      <p className={`text-sm font-semibold ${statusColors[status]}`}>{status}</p>
    </div>
  );
}

// Sample log data
const sampleLogs = [
  {
    id: 1,
    timestamp: '2026-03-19 10:23:45',
    service: 'API Server',
    severity: 'error',
    message: 'Database connection failed - unable to connect to primary instance',
  },
  {
    id: 2,
    timestamp: '2026-03-19 10:22:30',
    service: 'System Monitor',
    severity: 'warning',
    message: 'High memory usage detected - 85% capacity',
  },
  {
    id: 3,
    timestamp: '2026-03-19 10:21:15',
    service: 'Auth Service',
    severity: 'info',
    message: 'User login successful - session created',
  },
  {
    id: 4,
    timestamp: '2026-03-19 10:20:00',
    service: 'API Server',
    severity: 'error',
    message: 'Request timeout - processing took longer than expected',
  },
  {
    id: 5,
    timestamp: '2026-03-19 10:19:45',
    service: 'Cache Manager',
    severity: 'info',
    message: 'Cache cleared successfully - freed 512MB of memory',
  },
  {
    id: 6,
    timestamp: '2026-03-19 10:18:30',
    service: 'System Monitor',
    severity: 'warning',
    message: 'Disk space running low - 90% capacity on /data partition',
  },
  {
    id: 7,
    timestamp: '2026-03-19 10:17:15',
    service: 'Backup Service',
    severity: 'info',
    message: 'Backup completed successfully - 125GB backed up',
  },
  {
    id: 8,
    timestamp: '2026-03-19 10:16:00',
    service: 'Payment Gateway',
    severity: 'error',
    message: 'Payment processing failed - connection to payment provider unavailable',
  },
  {
    id: 9,
    timestamp: '2026-03-19 10:15:30',
    service: 'Email Service',
    severity: 'warning',
    message: 'Email queue backup - 5000 emails pending delivery',
  },
  {
    id: 10,
    timestamp: '2026-03-19 10:14:45',
    service: 'Database',
    severity: 'info',
    message: 'Maintenance window started - replication lag: 2.5s',
  },
  {
    id: 11,
    timestamp: '2026-03-19 10:14:00',
    service: 'Load Balancer',
    severity: 'error',
    message: 'Backend server became unavailable - health check failed',
  },
  {
    id: 12,
    timestamp: '2026-03-19 10:13:15',
    service: 'Storage Service',
    severity: 'warning',
    message: 'Slow read performance detected - average latency 450ms',
  },
  {
    id: 13,
    timestamp: '2026-03-19 10:12:30',
    service: 'Search Engine',
    severity: 'info',
    message: 'Index rebuild completed - 2.3M documents indexed',
  },
  {
    id: 14,
    timestamp: '2026-03-19 10:11:45',
    service: 'API Server',
    severity: 'error',
    message: 'OutOfMemoryError - heap size exceeded limit',
  },
  {
    id: 15,
    timestamp: '2026-03-19 10:10:00',
    service: 'Notification Service',
    severity: 'info',
    message: 'Push notification delivered - 50000 devices notified',
  },
];

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const { logs: backendLogs, loading, error, refetch } = useLogs();
  const [appliedFilters, setAppliedFilters] = useState({
    severity: null,
    serviceName: null,
    startDate: null,
    endDate: null,
  });

  const normalizedLogs = useMemo(() => {
    const levelToSeverity = {
      INFO: 'info',
      WARN: 'warning',
      ERROR: 'error',
      DEBUG: 'info',
    };

    return backendLogs.map((log) => ({
      id: log._id,
      timestamp: new Date(log.timestamp).toLocaleString(),
      service: log.service || 'unknown-service',
      severity: levelToSeverity[log.level] || 'info',
      message: log.message || '',
      rawTimestamp: new Date(log.timestamp),
    }));
  }, [backendLogs]);

  const filteredLogs = useMemo(() => {
    return normalizedLogs.filter((log) => {
      if (appliedFilters.severity && log.severity !== appliedFilters.severity) {
        return false;
      }
      if (
        appliedFilters.serviceName &&
        !log.service.toLowerCase().includes(appliedFilters.serviceName.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [normalizedLogs, appliedFilters]);

  const totalLogs = normalizedLogs.length;
  const errorCount = normalizedLogs.filter((log) => log.severity === 'error').length;
  const warnCount = normalizedLogs.filter((log) => log.severity === 'warning').length;
  const successRate = totalLogs > 0 ? ((totalLogs - errorCount) / totalLogs) * 100 : 100;

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const handleClearFilters = () => {
    setAppliedFilters({
      severity: null,
      serviceName: null,
      startDate: null,
      endDate: null,
    });
  };

  const services = useMemo(() => {
    const byService = {};

    for (let i = 0; i < normalizedLogs.length; i++) {
      const item = normalizedLogs[i];
      if (!byService[item.service]) {
        byService[item.service] = { total: 0, errors: 0, warnings: 0 };
      }
      byService[item.service].total += 1;
      if (item.severity === 'error') byService[item.service].errors += 1;
      if (item.severity === 'warning') byService[item.service].warnings += 1;
    }

    return Object.keys(byService).slice(0, 8).map((name) => {
      const row = byService[name];
      let status = 'Healthy';
      if (row.errors > 0) status = 'Error';
      else if (row.warnings > 0) status = 'Warning';

      return {
        name,
        status,
        uptime: row.total + ' logs',
      };
    });
  }, [normalizedLogs]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Logs', icon: FileText },
  ];

  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {activeTab === 'overview' && 'Monitor your distributed system logs in real-time'}
              {activeTab === 'analytics' && 'View detailed analytics and charts'}
              {activeTab === 'logs' && 'Explore all system logs'}
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isDark ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'}`}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className={`flex gap-2 mb-8 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'} pb-4`}>
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <TabIcon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className={`rounded-lg p-3 border mb-6 text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}>
              {loading ? 'Loading logs from API...' : error ? `API error: ${error}` : 'Live API data connected'}
              <button onClick={refetch} className={`ml-3 px-3 py-1 rounded ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard icon={FileText} title="Total Logs" value={String(totalLogs)} trend={null} isDark={isDark} />
              <MetricCard icon={AlertCircle} title="Errors" value={String(errorCount)} trend={null} trendUp={false} isDark={isDark} />
              <MetricCard icon={AlertTriangle} title="Warnings" value={String(warnCount)} trend={null} trendUp={false} isDark={isDark} />
              <MetricCard icon={Activity} title="Success Rate" value={successRate.toFixed(1) + '%'} trend={null} isDark={isDark} />
            </div>

            <div className={`rounded-lg p-6 border mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Services Status</h2>
              <div className="space-y-2">
                {services.map((service, idx) => (
                  <ServiceStatus key={idx} name={service.name} status={service.status} uptime={service.uptime} isDark={isDark} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className={`rounded-lg p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Log Activity Analytics</h2>
            <div className={`rounded-lg p-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <LogAnalytics logs={normalizedLogs} />
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="mb-8">
            <LogFilters onApplyFilters={handleApplyFilters} onClear={handleClearFilters} />
            <LogTable logs={filteredLogs} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
