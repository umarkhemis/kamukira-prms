import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    isOnline: navigator.onLine,
    notifications: [],
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({ id: Date.now(), ...action.payload });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setOnlineStatus, addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
