import axios from "axios";

export const apiAccount = axios.create({
  baseURL: "http://localhost:5002/api/accounts"
});

export const apiStudent = axios.create({
  baseURL: "http://localhost:5002/api/students",
  withCredentials: true 
});

export const apiClass = axios.create({
  baseURL: "http://localhost:5002/api/classes"
});

export const apiAdmin = axios.create({
  baseURL: "http://localhost:5002/api/admins",
  withCredentials: true
});
