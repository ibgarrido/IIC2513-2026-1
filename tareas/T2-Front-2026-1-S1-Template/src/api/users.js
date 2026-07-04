import axios from "axios";
import { userProfileImageRaw } from "../utils/userFromApi";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

export function buildUserUpdateBody(user, { username, image, password }) {
  const u = username.trim();
  const imageTrim = image.trim();
  const prevImage = userProfileImageRaw(user);
  const body = {};
  if (u !== user.username) body.username = u;
  if (imageTrim !== prevImage) body.image = imageTrim || null;
  if (password) body.password = password;
  return body;
}

export async function updateUser(id, body) {
  const { data } = await axios.put(
    `${API_URL}/users/${id}`,
    body,
    getAuthHeaders()
  );
  return data;
}

export async function deleteUser(id) {
  await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
}
