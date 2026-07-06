import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobListingReducer from './slices/jobListingSlice';
import candidatesReducer from './slices/candidatesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobListing: jobListingReducer,
    candidates: candidatesReducer,
  },
});
