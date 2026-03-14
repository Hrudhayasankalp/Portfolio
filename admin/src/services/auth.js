import API from "./api";

export const login = async (username, password) => {
  const res = await API.post("/auth/login", { username, password });

  localStorage.setItem("token", res.data.token);

  return res.data;
};