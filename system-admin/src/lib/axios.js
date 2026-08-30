import axios from "axios";

const SERVER = import.meta.env.VITE_APP_SERVER;
const BASE_URL = import.meta.env.VITE_MODE === "development" ? "http://localhost:5005/api" : `${SERVER}/api`;

export const apiAccount = axios.create({
  baseURL: `${BASE_URL}/accounts`,
  withCredentials: true 
});

export const apiStudent = axios.create({
  baseURL: `${BASE_URL}/students`,
  withCredentials: true 
});

export const apiClass = axios.create({
  baseURL: `${BASE_URL}/classes`,
  withCredentials: true 
});

export const apiAdmin = axios.create({
  baseURL: `${BASE_URL}/admins`,
  withCredentials: true
});
