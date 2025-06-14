import axios from "axios";

const api = axios.create({
  baseURL: "http://dsm-vot-api-p2.duckdns.org/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;