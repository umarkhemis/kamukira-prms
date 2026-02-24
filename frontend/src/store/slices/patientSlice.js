import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPatients = createAsyncThunk('patients/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/patients/', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createPatient = createAsyncThunk('patients/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/patients/', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    list: [],
    count: 0,
    loading: false,
    error: null,
    currentPatient: null,
  },
  reducers: {
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => { state.loading = true; })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results || action.payload;
        state.count = action.payload.count || 0;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPatient } = patientSlice.actions;
export default patientSlice.reducer;
