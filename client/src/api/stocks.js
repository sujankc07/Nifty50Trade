import api from "./axios";

export const fetchPopularStocks = () => api.get("/stocks/popular");
export const searchStock = (symbol) => api.get(`/stocks/search/${symbol}`);
export const fetchChartData = (symbol) => api.get(`/stocks/chart/${symbol}`);
