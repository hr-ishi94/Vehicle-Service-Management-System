import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "./AxiosInstance";



export const fetchComponents = createAsyncThunk("components/fetchAll", async () => {
  return await apiRequest("/components/");
});

export const fetchVehicles = createAsyncThunk("vehicles/fetchAll", async () => {
  return await apiRequest("/vehicles/");
});

export const fetchIssues = createAsyncThunk("issues/fetchAll", async () => {
  return await apiRequest("/issues/");
});

export const fetchRepairs = createAsyncThunk("repairs/fetchAll", async () => {
  return await apiRequest("/repairs/");
});

export const createVehicle = createAsyncThunk("vehicles/create", async (vehicleData) => {
  return await apiRequest("/vehicles/", "POST", vehicleData);
});

export const updateVehicle = createAsyncThunk("vehicles/update", async ({ id, vehicleData }) => {
  return await apiRequest(`/vehicles/${id}/`, "PUT", vehicleData);
});

export const updateVehicleStatus = createAsyncThunk("vehicles/update", async ({ id, status }) => {
  return await apiRequest(`/vehicles/${id}/`, "PATCH", {status});
});

export const deleteVehicle = createAsyncThunk("vehicles/delete", async (id) => {
  return await apiRequest(`/vehicles/${id}/`, "DELETE");
});


export const createIssue = createAsyncThunk("issues/create", async (issueData) => {
  return await apiRequest("/issues/", "POST", issueData);
});

export const updateIssue = createAsyncThunk("issues/update", async ({ id, issueData }) => {
  return await apiRequest(`/issues/${id}/`, "PUT", issueData);
});

export const deleteIssue = createAsyncThunk("issues/delete", async (id) => {
  return await apiRequest(`/issues/${id}/`, "DELETE");
});


export const createRepair = createAsyncThunk("repairs/create", async (repairData) => {
  return await apiRequest("/repairs/", "POST", repairData);
});

export const updateRepair = createAsyncThunk("repairs/update", async ({ id, repairData }) => {
  return await apiRequest(`/repairs/${id}/`, "PUT", repairData);
});

export const deleteRepair = createAsyncThunk("repairs/delete", async (id) => {
  return await apiRequest(`/repairs/${id}/`, "DELETE");
});

