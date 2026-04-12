import { useState, useContext } from 'react';
import { Filter, X } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export default function LogFilters({ onApplyFilters, onClear }) {
  const { isDark } = useContext(ThemeContext);
  const [severity, setSeverity] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyFilters = () => {
    const filters = {
      severity: severity || null,
      serviceName: serviceName || null,
      startDate: startDate || null,
      endDate: endDate || null,
    };
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setSeverity('');
    setServiceName('');
    setStartDate('');
    setEndDate('');
    if (onClear) {
      onClear();
    }
  };

  const isFiltered = severity || serviceName || startDate || endDate;

  return (
    <div className={`rounded-lg border p-6 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Severity Dropdown */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Severity
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'border-gray-700 text-white bg-gray-700' : 'border-gray-300 text-gray-900 bg-gray-50'}`}
          >
            <option value="">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Service Name Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Service Name
          </label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="e.g., API Server"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'border-gray-700 text-white bg-gray-700 placeholder-gray-500' : 'border-gray-300 text-gray-900 bg-white placeholder-gray-400'}`}
          />
        </div>

        {/* Start Date */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'border-gray-700 text-white bg-gray-700' : 'border-gray-300 text-gray-900 bg-white'}`}
          />
        </div>

        {/* End Date */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'border-gray-700 text-white bg-gray-700' : 'border-gray-300 text-gray-900 bg-white'}`}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 justify-end">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {isFiltered && (
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="flex flex-wrap gap-2">
            {severity && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm font-medium">
                Severity: {severity}
                <button
                  onClick={() => setSeverity('')}
                  className="hover:text-blue-200"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {serviceName && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm font-medium">
                Service: {serviceName}
                <button
                  onClick={() => setServiceName('')}
                  className="hover:text-green-200"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-sm font-medium">
                From: {startDate}
                <button
                  onClick={() => setStartDate('')}
                  className="hover:text-purple-200"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-900 text-orange-300 rounded-full text-sm font-medium">
                To: {endDate}
                <button
                  onClick={() => setEndDate('')}
                  className="hover:text-orange-200"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
