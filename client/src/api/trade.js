import api from "./axios";

export const buyStock = (data) => api.post("/trade/buy", data);
export const sellStock = (data) => api.post("/trade/sell", data);
export const fetchTradeHistory = (page) =>
  api.get(`/trade/history?page=${page}&limit=20`);
