import { useState, useMemo, useContext } from 'react';
import { Search, AlertCircle, AlertTriangle, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export default function LogTable({ logs = [] }) {
  const { isDark } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logs based on search term
  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.severity.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Get badge styling based on severity
  const getSeverityStyles = (severity) => {
    const lowerSeverity = severity.toLowerCase();
    
    if (lowerSeverity === 'info') {
      return {
        badge: 'bg-blue-900 text-blue-300',
        icon: Info,
      };
    } else if (lowerSeverity === 'warning') {
      return {
        badge: 'bg-yellow-900 text-yellow-300',
        icon: AlertTriangle,
      };
    } else if (lowerSeverity === 'error') {
      return {
        badge: 'bg-red-900 text-red-300',
        icon: AlertCircle,
      };
    }
    return {
      badge: 'bg-gray-700 text-gray-300',
      icon: Info,
    };
  };

  return (
    <div className={`rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
      {/* Search Bar */}
      <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Logs</h2>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
        <div className="relative">
          <Search
            size={18}
            className={isDark ? 'absolute left-3 top-3 text-gray-500' : 'absolute left-3 top-3 text-gray-400'}
          />
          <input
            type="text"
            placeholder="Search by message, service, or severity..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'border-gray-700 bg-gray-700 text-white placeholder-gray-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'}`}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Timestamp
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Service
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Severity
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Message
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => {
                const { badge, icon: IconComponent } = getSeverityStyles(log.severity);
                return (
                  <tr key={log.id} className={`transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {log.timestamp}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {log.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${badge}`}>
                        <IconComponent size={14} />
                        {log.severity}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm max-w-md truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {log.message}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className={`px-6 py-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  No logs found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`p-6 border-t flex items-center justify-between ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-200'}`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-200'}`}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
