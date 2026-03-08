import { useState, useEffect } from "react";
import { fetchPopularStocks } from "../api/stocks";

export const useStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const res = await fetchPopularStocks();
      setStocks(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load stocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { stocks, loading, error, refetch: load };
};
