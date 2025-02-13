import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthToken = () => {
  return localStorage.getItem("access_token"); 
};

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const token = getAuthToken(); 

  const config = {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
       },
    ...(data && { data: JSON.stringify(data) }),
    withCredentials: true, 
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error.response || error.message);
    throw error;
  }
};
