import { jwtDecode } from "jwt-decode";
import axios from "./axios";
import { User } from "@/@types/user";

const isTokenValid = (authToken: string): boolean => {
  try {
    const decoded: { exp?: number } = jwtDecode(authToken);
    if (!decoded.exp) {
      console.error("Token does not contain an expiration time.");
      return false;
    }

    const currentTime = Date.now() / 1000; // Current time in seconds since epoch
    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return false;
  }
};

const setSession = (authToken?: string | null, user?: User | null): void => {
  if (typeof authToken === "string" && authToken.trim() !== "") {
    // Store token in local storage and set authorization header for axios
    localStorage.setItem("authToken", authToken);
    axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;

    // Store user data if provided
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  } else {
    // Remove token and user from local storage and delete authorization header from axios
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common.Authorization;
  }
};

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (err) {
    console.error("Failed to parse stored user:", err);
    return null;
  }
};

export { isTokenValid, setSession, getStoredUser };
