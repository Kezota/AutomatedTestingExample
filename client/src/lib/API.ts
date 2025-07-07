import axios from "axios";
import { API_URL } from "./config";

export const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");

    if (token) {
      // .set() hanya tersedia kalau headers-nya sudah berbentuk AxiosHeaders
      request.headers?.set?.("Authorization", `Bearer ${token}`);
    }

    return request;
  },
  (error) => Promise.reject(error)
);
