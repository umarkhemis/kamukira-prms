import { createSlice } from '@reduxjs/toolkit';

const visitSlice = createSlice({
  name: 'visits',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setVisits: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setVisits } = visitSlice.actions;
export default visitSlice.reducer;
