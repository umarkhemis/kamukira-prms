import { addToOfflineQueue, syncOfflineData } from '../utils/syncManager';
import api from './api';

/**
 * Wraps an API call to automatically queue it for offline sync
 * if the network is unavailable.
 */
export const withOfflineSupport = async (method, url, data = null) => {
  if (!navigator.onLine) {
    await addToOfflineQueue({ method, url, data });
    return { status: 'queued', message: 'Request queued for offline sync' };
  }
  return api({ method, url, data });
};

/**
 * Manually trigger sync of all pending offline operations.
 */
export const triggerSync = () => syncOfflineData(api);

export default { withOfflineSupport, triggerSync };
