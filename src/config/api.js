import axios from "axios";
import { backendURL } from "../constants/constants";

const api = axios.create({
  baseURL: `${backendURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
