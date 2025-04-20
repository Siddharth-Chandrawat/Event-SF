import axios from "./axiosInstance";

export const loginUser = (email, password) => {
  return axios.post("/auth/login", { email, password }, { withCredentials: true });
};

export const registerUser = (email, password, role) => {
  return axios.post("/auth/register", { email, password, role }, { withCredentials: true });
};

export const updateUserProfile = ({ email, name }) => {
  return axios.post("/auth/edit", { email, name }, { withCredentials: true });
};