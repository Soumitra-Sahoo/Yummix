import { useEffect, useState } from "react";
import axios from "axios";
import { useRider } from "../context/RiderContext.jsx";

const useDashboard = () => {
  const { BASE_URL, authHeader, token } = useRider();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/rider-dashboard`, authHeader());
        if (res.data.success) setData(res.data.data);
      } catch (err) {
        console.error("useDashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  return { data, loading };
};

export default useDashboard;