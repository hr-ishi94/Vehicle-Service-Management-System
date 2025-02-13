import { configureStore, createSlice } from "@reduxjs/toolkit";
import ComponentReducer from './slices/ComponentSlice'
import VehicleReducer from './slices/VehicleSlice'
import IssueReducer from './slices/IssueSlice'
import RepairReducer from './slices/RepairSlice'
import RevenueReducer from './slices/RevenueSlice'
import {loginUser, logoutUser} from '../axios/Auth'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { combineReducers } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; });
  },
});


const rootReducer = combineReducers({
    auth: authSlice.reducer,
    components: ComponentReducer,
    vehicles: VehicleReducer,
    issues: IssueReducer,
    repairs: RepairReducer,
    revenues: RevenueReducer,
 
});


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
  };
  
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
reducer: persistedReducer,
});


export default store
export const persistor = persistStore(store);