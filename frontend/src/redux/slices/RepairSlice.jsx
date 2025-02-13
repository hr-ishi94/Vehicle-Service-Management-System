import { createSlice } from "@reduxjs/toolkit";
import { fetchRepairs } from "../../axios/UserServer";


const repairSlice = createSlice({
    name: "repairs",
    initialState: { items: [], loading: false, error: null },
    reducers: {
      addRepairAction: (state, action) => {
        state.items.push(action.payload);
      },
      updateRepairAction: (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      },
      deleteRepair: (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchRepairs.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchRepairs.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload; 
        })
        .addCase(fetchRepairs.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  });
  
  export const { addRepairAction, updateRepairAction, deleteRepair } = repairSlice.actions;
  export default repairSlice.reducer;