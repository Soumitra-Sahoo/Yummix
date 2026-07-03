import { useEffect, useState } from "react";
import axios from "axios";
import { useRider } from "../context/RiderContext.jsx";

const useHistory = () => {
  const { BASE_URL, authHeader, token } = useRider();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/rider-order/history`,
          authHeader()
        );
        if (res.data.success) setOrders(res.data.data);
      } catch (err) {
        console.error("useHistory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  return { orders, loading };
};

export default useHistory;