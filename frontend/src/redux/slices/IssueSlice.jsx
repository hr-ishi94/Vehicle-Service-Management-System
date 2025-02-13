import { createSlice } from "@reduxjs/toolkit";
import { fetchIssues } from "../../axios/UserServer";

const issueSlice = createSlice({
    name: "issues",
    initialState: { items: [], loading: false, error: null },
    reducers: {
      addIssueAction: (state, action) => {
        state.items.push(action.payload); // Instantly add to UI
      },
      updateIssueAction: (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; 
        }
      },
      deleteIssue: (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchIssues.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchIssues.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchIssues.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  });
  
export const { addIssueAction, updateIssueAction, deleteIssue } = issueSlice.actions;
export default issueSlice.reducer;