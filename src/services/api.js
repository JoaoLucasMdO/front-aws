import axios from "axios";

const api = axios.create({
  baseURL: "http://18.215.24.30/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;