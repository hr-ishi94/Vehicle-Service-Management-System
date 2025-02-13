import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "./AxiosInstance";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/login/", "POST", credentials);
      return response; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
  
export const logoutUser = createAsyncThunk("auth/logout", async () => {
return await apiRequest("/logout/", "POST");
});
  