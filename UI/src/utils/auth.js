import { jwtDecode } from "jwt-decode";  // Fix import
import { getAuthToken, removeAuthToken, removeUser } from "./localStorage";

export const decodeToken = () => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    return jwtDecode(token);
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      logoutUser();
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const logoutUser = () => {
  removeAuthToken();
  removeUser();
  window.dispatchEvent(new Event("storage"));
};

export const getUser = () => {
  try {
    const decodedToken = decodeToken();
    return decodedToken ? decodedToken.user : null; 
  } catch (error) {
    console.error("Error getting user from token:", error);
    return null;
  }
};
