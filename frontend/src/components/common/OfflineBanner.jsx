import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineStatus } from '../../store/slices/uiSlice';
import { syncOfflineData } from '../../utils/syncManager';
import api from '../../services/api';

function OfflineBanner() {
  const dispatch = useDispatch();
  const { isOnline } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleOnline = async () => {
      dispatch(setOnlineStatus(true));
      try {
        const result = await syncOfflineData(api);
        if (result.synced > 0) {
          console.log(`Synced ${result.synced} offline records`);
        }
      } catch (e) {
        console.error('Sync failed', e);
      }
    };

    const handleOffline = () => {
      dispatch(setOnlineStatus(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  if (isOnline) return null;

  return (
    <div className="bg-red-500 text-white text-center text-sm py-2 px-4">
      ⚠️ You are offline — changes will sync when connection is restored
    </div>
  );
}

export default OfflineBanner;
