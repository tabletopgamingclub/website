import axios from "axios";

const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(
  /\/+$/,
  "",
);

export const api = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
});
