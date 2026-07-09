import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SignUpAPI, validateUserAPI, loginAPI, logoutAPI } from '../../api/api';
import { authStorage } from '../../utils/authStorage';

export const validateUser = createAsyncThunk(
  'auth/validateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await validateUserAPI(userData);
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

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutAPI();
    } catch (error) {
      // Session may already be invalid server-side; still clear local state.
    } finally {
      dispatch(logout());
    }
    return true;
  }
);

const session = authStorage.getSession();

const initialState = {
  user: session?.user || null,
  token: session?.token || null,
  isAuthenticated: !!session?.user,
  role: session?.role || null,
  loading: false,
  error: null,
  tempSignupData: null, 
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
      authStorage.clearSession();
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      authStorage.updateUser(state.user);
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
          state.user = action.payload.data;
          state.isAuthenticated = true;
          state.role = action.meta.arg.role; 
          authStorage.setAccessToken(state.token);
          
          const userDataToStore = { ...action.payload.data, role: action.meta.arg.role };
          authStorage.setSession(state.role, state.token, userDataToStore);
        }
        state.tempSignupData = null;
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
          authStorage.setAccessToken(state.token);
          
          const userDataToStore = { ...state.user, role: state.role };
          authStorage.setSession(state.role, state.token, userDataToStore);
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
