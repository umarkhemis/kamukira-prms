import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import visitReducer from './slices/visitSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    visits: visitReducer,
    ui: uiReducer,
  },
});

export default store;
