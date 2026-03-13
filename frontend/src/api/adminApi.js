import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
const API_URL = `${API_BASE_URL}/admin`;

const adminApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export const getAdminDashboard = () => adminApi.get("/dashboard");
export const getAllApplicants = () => adminApi.get("/applicants");

// --- Add these for Events ---
export const createEvent = (data) => adminApi.post("/add-event", data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateEvent = (id, data) => adminApi.put(`/update-event/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteEvent = (id) => adminApi.delete(`/delete-event/${id}`);

export default adminApi;