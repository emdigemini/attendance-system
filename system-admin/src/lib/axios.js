import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/api";

export const apiAccount = axios.create({
  baseURL: `${BASE_URL}/api/accounts`
});

export const apiStudent = axios.create({
  baseURL: `${BASE_URL}/api/students`,
  withCredentials: true 
});

export const apiClass = axios.create({
  baseURL: `${BASE_URL}/api/classes`
});

export const apiAdmin = axios.create({
  baseURL: `${BASE_URL}/api/admins`,
  withCredentials: true
});
