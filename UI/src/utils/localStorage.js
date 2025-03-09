const BASE_URL = "http://127.0.0.1:8000/"; // Ensure this is defined

export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
  window.dispatchEvent(new Event("storage")); 
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken") || null;
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
  window.dispatchEvent(new Event("storage"));
};

export const removeUser = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
};

export const setUser = (user) => {
  try {
    const formattedUser = {
      ...user,
      profile_picture: user.profile_picture
        ? `${BASE_URL}${user.profile_picture}`
        : null,
    };

    localStorage.setItem("user", JSON.stringify(formattedUser));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const parsedUser = JSON.parse(user);
    console.log("Stored User:", parsedUser);
    console.log("Profile Picture URL:", parsedUser?.profile_picture);

    return parsedUser;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    removeUser();
    return null;
  }
};
