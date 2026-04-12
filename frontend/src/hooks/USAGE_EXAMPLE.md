/**
 * Example: How to use the useLogs hook
 * 
 * The useLogs hook is a custom React hook that:
 * - Fetches logs from /api/logs endpoint using axios
 * - Maintains loading and error states
 * - Auto-refreshes every 10 seconds
 * - Provides manual refetch capability
 * 
 * Usage Example:
 * 
 * import useLogs from './hooks/useLogs';
 * 
 * function MyComponent() {
 *   const { logs, loading, error, refetch } = useLogs();
 * 
 *   if (loading) return <div>Loading logs...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       <button onClick={refetch}>Refresh Logs</button>
 *       <ul>
 *         {logs.map((log) => (
 *           <li key={log.id}>{log.message}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * 
 * Hook return value:
 * {
 *   logs: Array,          // Array of log objects
 *   loading: Boolean,     // True while fetching
 *   error: String|null,   // Error message or null
 *   refetch: Function,    // Manually trigger a fetch
 * }
 */

// This file is for documentation purposes only
