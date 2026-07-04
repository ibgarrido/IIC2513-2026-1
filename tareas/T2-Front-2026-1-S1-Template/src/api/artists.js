import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

function genresToApiArray(genres) {
  if (Array.isArray(genres)) return genres.filter(Boolean);
  if (typeof genres === "string")
    return genres.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

export const fetchArtistsForSale = async (
  page = 1,
  limit = 10,
  search = "",
  favorite = false
) => {
  return fetchArtists(page, limit, true, search, favorite);
};

export const fetchArtists = async (
  page = 1,
  limit = 10,
  forSale = false,
  search = "",
  favorite = false
) => {
  const params = { page, limit, forSale, search };
  if (favorite) params.favorite = true;
  const config = { params };
  if (favorite) Object.assign(config, getAuthHeaders());
  const { data } = await axios.get(`${API_URL}/artists`, config);
  return data;
};

export const fetchMyArtistsPage = async (page = 1, limit = 10, search = "") => {
  const { data } = await axios.get(`${API_URL}/artists/my`, {
    params: { page, limit, search },
    ...getAuthHeaders(),
  });
  return data;
};

export const createArtist = async (artist) => {
  const payload = {
    name: artist.name,
    hypeLevel: artist.hypeLevel,
    genres: genresToApiArray(artist.genres),
    price: artist.price,
    imageUrl: artist.imageUrl ?? artist.image_url,
  };
  const { data } = await axios.post(
    `${API_URL}/artists`,
    payload,
    getAuthHeaders()
  );
  return data;
};

export const updateArtist = async (id, payload) => {
  const body = {
    name: payload.name,
    hypeLevel: payload.hypeLevel,
    genres: genresToApiArray(payload.genres),
    price: payload.price,
    imageUrl: payload.imageUrl ?? payload.image_url,
  };
  const { data } = await axios.put(
    `${API_URL}/artists/${id}`,
    body,
    getAuthHeaders()
  );
  return data;
};

export const deleteArtist = async (id) => {
  const { data } = await axios.delete(
    `${API_URL}/artists/${id}`,
    getAuthHeaders()
  );
  return data;
};

export const buyArtist = async (id) => {
  const { data } = await axios.post(
    `${API_URL}/artists/${id}/buy`,
    {},
    getAuthHeaders()
  );
  return data;
};

export const fetchArtistById = async (id) => {
  const { data } = await axios.get(`${API_URL}/artists/${id}`);
  return data;
};

export const addFavorite = async (id) => {
  const { data } = await axios.post(
    `${API_URL}/artists/${id}/favorite`,
    {},
    getAuthHeaders()
  );
  return data;
};

export const removeFavorite = async (id) => {
  const { data } = await axios.delete(
    `${API_URL}/artists/${id}/favorite`,
    getAuthHeaders()
  );
  return data;
};

export const sellArtist = async (id) => {
  const { data } = await axios.post(
    `${API_URL}/artists/${id}/sell`,
    {},
    getAuthHeaders()
  );
  return data;
};
