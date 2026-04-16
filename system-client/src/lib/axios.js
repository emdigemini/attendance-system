import axios from "axios";

export const apiAccount = axios.create({
  baseURL: `http://localhost:5002/api/accounts`,
  withCredentials: true 
});

export const apiUser = axios.create({
  baseURL: `http://localhost:5002/api/user`,
  withCredentials: true 
});

export const apiStudent = axios.create({
  baseURL: `http://localhost:5002/api/students`,
  withCredentials: true 
});

export const apiTeacher = axios.create({
  baseURL: `http://localhost:5002/api/teachers`,
  withCredentials: true 
});

export const apiClass = axios.create({
  baseURL: `http://localhost:5002/api/classes`,
  withCredentials: true 
});

export const apiSubject = axios.create({
  baseURL: `http://localhost:5002/api/subjects`,
  withCredentials: true
});

export const apiAttendance = axios.create({
  baseURL: `http://localhost:5002/api/attendance`,
  withCredentials: true
});

export const apiSched = axios.create({
  baseURL: `http://localhost:5002/api/schedule`,
  withCredentials: true
});
