import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, JWT } from '../../types/AdminState';
import {RootState} from '../store';

const initialState: AdminState = {
  status: 'loggedOut',
  jwt: null,
  fingerprint: null,
};

export const admin = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logOut: () => {
      return initialState
    },
    logIn: (state, action: PayloadAction<AdminState>) => {
      state.status = 'loggedIn'
      state.jwt = action.payload.jwt
      state.fingerprint = action.payload.fingerprint
    },
    refreshToken: (state, action: PayloadAction<JWT>) => {
      state.status = 'loggedIn'
      state.jwt = action.payload
    }
  },
});

export const {logOut, logIn, refreshToken} = admin.actions;
export const selectAdmin = (state: RootState) => state.admin;
export default admin.reducer;