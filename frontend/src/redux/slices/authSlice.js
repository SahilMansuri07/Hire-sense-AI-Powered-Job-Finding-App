import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SignUpAPI, validateUserAPI, loginAPI } from '../../api/api';

export const validateUser = createAsyncThunk(
  'auth/validateUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log("User Data: ", userData);
      const response = await validateUserAPI(userData);
      console.log("Response: ", response);
      if (response.code !== 1) {
        return rejectWithValue(response.message || 'Validation failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await SignUpAPI(userData);
      if (response.code !== 1) {
        return rejectWithValue(response.message || 'Signup failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAPI(credentials);
      if (response.code !== 1) {
        return rejectWithValue(response.message || 'Login failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: JSON.parse(localStorage.getItem('user'))?.role || null,
  loading: false,
  error: null,
  tempSignupData: null, // Stores data from Register page before role selection
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTempSignupData: (state, action) => {
      state.tempSignupData = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      // Validate User cases
      .addCase(validateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(validateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data?.token) {
          state.token = action.payload.data.token;
          state.user = action.payload.data; // assuming data contains user details
          state.isAuthenticated = true;
          state.role = action.meta.arg.role; // store role sent in request
          // Storing role in user data just in case
          const userDataToStore = { ...action.payload.data, role: action.meta.arg.role };
          localStorage.setItem('token', action.payload.data.token);
          localStorage.setItem('user', JSON.stringify(userDataToStore));
        }
        state.tempSignupData = null; // clear temp data
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data?.token) {
          state.token = action.payload.data.token;
          state.user = action.payload.data.user || action.payload.data;
          state.isAuthenticated = true;
          state.role = action.payload.data.role || (action.payload.data.user && action.payload.data.user.role); 
          localStorage.setItem('token', action.payload.data.token);
          localStorage.setItem('user', JSON.stringify({ ...state.user, role: state.role }));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { setTempSignupData, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
