import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export const getPublicEvents = () => axios.get(`${API_BASE_URL}/user/events`);