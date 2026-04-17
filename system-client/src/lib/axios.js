import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/api";

export const apiAccount = axios.create({
  baseURL: `${BASE_URL}/accounts`,
  withCredentials: true 
});

export const apiUser = axios.create({
  baseURL: `${BASE_URL}/user`,
  withCredentials: true 
});

export const apiStudent = axios.create({
  baseURL: `${BASE_URL}/students`,
  withCredentials: true 
});

export const apiTeacher = axios.create({
  baseURL: `${BASE_URL}/teachers`,
  withCredentials: true 
});

export const apiClass = axios.create({
  baseURL: `${BASE_URL}/classes`,
  withCredentials: true 
});

export const apiSubject = axios.create({
  baseURL: `${BASE_URL}/subjects`,
  withCredentials: true
});

export const apiAttendance = axios.create({
  baseURL: `${BASE_URL}/attendance`,
  withCredentials: true
});

export const apiSched = axios.create({
  baseURL: `${BASE_URL}/schedule`,
  withCredentials: true
});
