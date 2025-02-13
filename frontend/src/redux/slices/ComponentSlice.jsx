import { createSlice } from "@reduxjs/toolkit";
import { fetchComponents } from "../../axios/UserServer";

const ComponentSlice = createSlice({
    name: "components",
    initialState: { items: [], loading: false, error: null },
    reducers: {
        addComponent: (state, action) => {
          state.items.push(action.payload);
        },
        updateComponentAction: (state, action) => {
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        },
        deleteComponentAction: (state, action) => {
          state.items = state.items.filter(item => item.id !== action.payload); 
        },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchComponents.pending, (state) => { state.loading = true; })
        .addCase(fetchComponents.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
        .addCase(fetchComponents.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
    },
  });


export const { addComponent, updateComponentAction, deleteComponentAction } = ComponentSlice.actions;
export default ComponentSlice.reducer;