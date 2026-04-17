import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/api";

export const apiAccount = axios.create({
  baseURL: `${BASE_URL}/api/accounts`,
  withCredentials: true 
});

export const apiUser = axios.create({
  baseURL: `${BASE_URL}/api/user`,
  withCredentials: true 
});

export const apiStudent = axios.create({
  baseURL: `${BASE_URL}/api/students`,
  withCredentials: true 
});

export const apiTeacher = axios.create({
  baseURL: `${BASE_URL}/api/teachers`,
  withCredentials: true 
});

export const apiClass = axios.create({
  baseURL: `${BASE_URL}/api/classes`,
  withCredentials: true 
});

export const apiSubject = axios.create({
  baseURL: `${BASE_URL}/api/subjects`,
  withCredentials: true
});

export const apiAttendance = axios.create({
  baseURL: `${BASE_URL}/api/attendance`,
  withCredentials: true
});

export const apiSched = axios.create({
  baseURL: `${BASE_URL}/api/schedule`,
  withCredentials: true
});
