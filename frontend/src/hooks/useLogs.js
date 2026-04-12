import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/logs', {
        params: {
          page: 1,
          limit: 500,
        },
      });
      setLogs(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch logs'
      );
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs on component mount and set up auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchLogs();

    // Set up auto-refresh interval (10 seconds)
    const intervalId = setInterval(() => {
      fetchLogs();
    }, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs,
  };
}
