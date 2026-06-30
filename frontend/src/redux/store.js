import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobListingReducer from './slices/jobListingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobListing: jobListingReducer,
  },
});
