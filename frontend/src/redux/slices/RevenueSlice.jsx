import { createSlice } from "@reduxjs/toolkit";
import { fetchRevenueGraph, fetchRevenues } from "../../axios/OperationsServer";


const revenueSlice = createSlice({
    name: "revenues",
    initialState: { items: [], graph: {}, loading: false, error: null },
    reducers: {
      addRevenue: (state, action) => {
        state.items.push(action.payload); 
      },
      updateRevenue: (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; 
        }
      },
      deleteRevenue: (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload); 
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchRevenues.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchRevenues.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchRevenues.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(fetchRevenueGraph.fulfilled, (state, action) => {
          state.graph = action.payload; 
        });
    },
  });
  
  export const { addRevenue, updateRevenue, deleteRevenue } = revenueSlice.actions;
  export default revenueSlice.reducer;