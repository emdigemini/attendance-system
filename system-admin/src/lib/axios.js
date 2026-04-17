import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/api";

console.log(BASE_URL);

export const apiAccount = axios.create({
  baseURL: `${BASE_URL}/accounts`
});

export const apiStudent = axios.create({
  baseURL: `${BASE_URL}/students`,
  withCredentials: true 
});

export const apiClass = axios.create({
  baseURL: `${BASE_URL}/classes`
});

export const apiAdmin = axios.create({
  baseURL: `${BASE_URL}/admins`,
  withCredentials: true
});
