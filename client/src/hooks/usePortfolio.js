import { useState, useEffect } from "react";
import { fetchPortfolio } from "../api/portfolio";

export const usePortfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchPortfolio();
      setData(res.data);
    } catch (err) {
      setError("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, refetch: load };
};
