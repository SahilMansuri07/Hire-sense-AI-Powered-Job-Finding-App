import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJobsAPI } from '../../api/api';

export const fetchJobsThunk = createAsyncThunk(
  'jobListing/fetchJobs',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetchJobsAPI(payload);
      // Ensure we always return an object with jobs and pagination
      // even if the backend failed to return the exact structure
      return response?.data || { jobs: [], pagination: { total: 0, totalPages: 1, currentPage: 1, limit: 10 } };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch jobs');
    }
  }
);

const initialState = {
  jobs: [],
  pagination: {
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10
  },
  filters: {
    search: '',
    location: '',
    employmentType: '',
    salaryMin: '',
    salaryMax: '',
    is_remote: false,
    experience_level: ''
  },
  loading: false,
  error: null,
};

const jobListingSlice = createSlice({
  name: 'jobListing',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      // Update filters and reset page to 1
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsThunk.fulfilled, (state, action) => {
        state.loading = false;
        // If data is in the new format { jobs, pagination }
        if (action.payload.jobs && action.payload.pagination) {
          state.jobs = action.payload.jobs;
          state.pagination = action.payload.pagination;
        } else if (Array.isArray(action.payload)) {
          // Fallback if backend still returns raw array
          state.jobs = action.payload;
        }
      })
      .addCase(fetchJobsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPage, clearFilters } = jobListingSlice.actions;
export default jobListingSlice.reducer;
