import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WifiOff } from 'lucide-react';
import { setOnlineStatus } from '../../store/slices/uiSlice';
import { syncOfflineData } from '../../utils/syncManager';
import api from '../../services/api';
import Icon from './Icon';

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
    <div className="bg-amber-100 text-amber-900 border-b border-amber-200 text-sm py-2 px-4">
      <div className="flex items-center justify-center gap-2">
        <Icon icon={WifiOff} size="sm" />
        <span>You are offline — changes will sync when connection is restored.</span>
      </div>
    </div>
  );
}

export default OfflineBanner;
