import api from "./axios";

export const fetchPortfolio = () => api.get("/portfolio");
export const resetPortfolio = () => api.post("/portfolio/reset");
