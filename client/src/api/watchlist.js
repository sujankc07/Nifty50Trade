import api from "./axios";

export const fetchWatchlist = () => api.get("/watchlist");
export const addToWatchlist = (symbol) => api.post(`/watchlist/${symbol}`);
export const removeWatchlist = (symbol) => api.delete(`/watchlist/${symbol}`);
