import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCandidatesAPI, fetchDashboardSummaryAPI } from '../../api/recruiterJobsApi';

export const getCandidatesPreview = createAsyncThunk(
  'candidates/getPreview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCandidatesAPI(1, 5);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates');
    }
  }
);

export const getCandidatesPaginated = createAsyncThunk(
  'candidates/getPaginated',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetchCandidatesAPI(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates');
    }
  }
);

export const getDashboardSummary = createAsyncThunk(
  'candidates/getDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDashboardSummaryAPI();
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard summary');
    }
  }
);

const initialState = {
  previewList: [],
  paginatedList: [],
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  },
  dashboardSummary: {
    totalApplications: 0,
    totalApplicationsChange: '',
    avgHireTime: 0,
    avgHireTimeChange: '',
    openPositions: 0,
    departmentCount: 0,
    myJobs: 0
  },
  loading: false,
  error: null,
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard Summary
      .addCase(getDashboardSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload", action.payload)
        if (action.payload) {
           state.dashboardSummary = action.payload;
        }
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Preview
      .addCase(getCandidatesPreview.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCandidatesPreview.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.candidates) {
            state.previewList = action.payload.candidates;
        }
      })
      .addCase(getCandidatesPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Paginated
      .addCase(getCandidatesPaginated.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCandidatesPaginated.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
           state.paginatedList = action.payload.candidates || [];
           if (action.payload.pagination) {
             state.pagination = action.payload.pagination;
           }
        }
      })
      .addCase(getCandidatesPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default candidatesSlice.reducer;
