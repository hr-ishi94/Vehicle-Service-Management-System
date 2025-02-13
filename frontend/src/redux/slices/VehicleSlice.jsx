import { createSlice } from "@reduxjs/toolkit";
import { fetchVehicles } from "../../axios/UserServer";

const vehicleSlice = createSlice({
    name: "vehicles",
    initialState: { items: [], loading: false, error: null },
    reducers: {
      addVehicle: (state, action) => {
        state.items.push(action.payload);
      },
      updateVehicleAction: (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; 
        }
      },
      deleteVehicle: (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload); 
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchVehicles.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchVehicles.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload; 
        })
        .addCase(fetchVehicles.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  });
  
export const { addVehicle, updateVehicleAction, deleteVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;