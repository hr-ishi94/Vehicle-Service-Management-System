import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "./AxiosInstance";

export const createComponent = createAsyncThunk("components/create", async (componentData) => {
    return await apiRequest("/components/", "POST", componentData);
  });
  
  export const updateComponent = createAsyncThunk("components/update", async ({ id, componentData }) => {
    return await apiRequest(`/components/${id}/`, "PUT", componentData);
  });
  
  export const deleteComponent = createAsyncThunk("components/delete", async (id) => {
    return await apiRequest(`/components/${id}/`, "DELETE");
  });

  export const fetchRevenues = createAsyncThunk("revenues/fetchAll", async () => {
    return await apiRequest("/revenues/");
  });
  
  export const fetchRevenueGraph = createAsyncThunk("revenues/fetchGraph", async () => {
    return await apiRequest("/graph/revenue/");
  });
 