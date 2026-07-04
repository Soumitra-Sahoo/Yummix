import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const RiderContext = createContext({});
export const useRider = () => useContext(RiderContext);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LOCATION_POLL_MS = 30_000;
const ASSIGN_POLL_MS = 8_000;

const RiderContextProvider = ({ children }) => {
  const [rider, setRider] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("riderToken") || "");
  const [pendingAssignment, setPendingAssignment] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const locationIntervalRef = useRef(null);
  const assignIntervalRef = useRef(null);

  const authHeader = () => ({ headers: { token } });

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/api/rider/profile`,
        authHeader(),
      );
      if (res.data.success) setRider(res.data.data);
      else logout();
    } catch (err) {
      
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/rider/login`, {
        email,
        password,
      });
      if (res.data.success) {
        const newToken = res.data.token;
        setToken(newToken);
        localStorage.setItem("riderToken", newToken);
        toast.success("Welcome back!");
        return true;
      } else {
        toast.error(res.data.message);
        return false;
      }
    } catch {
      toast.error("Login failed. Check your connection.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setRider(null);
    setPendingAssignment(null);
    setCurrentOrder(null);
    localStorage.removeItem("riderToken");
    clearInterval(locationIntervalRef.current);
    clearInterval(assignIntervalRef.current);
  };

  const sendLocation = () => {
    if (!token || !rider?.isOnline) return;
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          await axios.post(
            `${BASE_URL}/api/rider/update-location`,
            { lat: pos.coords.latitude, lng: pos.coords.longitude },
            authHeader(),
          );
        } catch {
          
        }
      },
      () => {
        /* permission denied — silent */
      },
    );
  };

  const pollAssignment = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/api/rider-order/pending-assignment`,
        authHeader(),
      );
      if (res.data.success && res.data.data) {
        const assignment = res.data.data;
        if (!pendingAssignment || pendingAssignment._id !== assignment._id) {
          setPendingAssignment(assignment);
          navigator.vibrate?.([300, 100, 300]);
          toast.info("🛵 New delivery assigned!", {
            autoClose: false,
            toastId: "new-assignment",
          });
        }
      } else {
        setPendingAssignment(null);
      }
    } catch {

    }
  };

  const fetchCurrentOrder = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/api/rider-order/assigned`,
        authHeader(),
      );
      if (res.data.success) setCurrentOrder(res.data.data);
    } catch {
      
    }
  };

  const toggleOnline = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/rider/toggle-online`,
        {},
        authHeader(),
      );
      if (res.data.success) {
        setRider((prev) => ({ ...prev, isOnline: res.data.isOnline }));
        toast.success(res.data.message);
        if (res.data.isOnline) {
          sendLocation();
        }
      }
    } catch {
      toast.error("Failed to update online status");
    }
  };

  useEffect(() => {
    clearInterval(locationIntervalRef.current);
    clearInterval(assignIntervalRef.current);

    if (token && rider?.isOnline) {
      sendLocation();
      locationIntervalRef.current = setInterval(sendLocation, LOCATION_POLL_MS);
      assignIntervalRef.current = setInterval(pollAssignment, ASSIGN_POLL_MS);
    }

    return () => {
      clearInterval(locationIntervalRef.current);
      clearInterval(assignIntervalRef.current);
    };
  }, [token, rider?.isOnline]);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchCurrentOrder();
    }
  }, [token]);

  const value = {
    BASE_URL,
    rider,
    setRider,
    token,
    loading,
    login,
    logout,
    fetchProfile,
    toggleOnline,
    pendingAssignment,
    setPendingAssignment,
    currentOrder,
    setCurrentOrder,
    fetchCurrentOrder,
    authHeader,
  };

  return (
    <RiderContext.Provider value={value}>{children}</RiderContext.Provider>
  );
};

export default RiderContextProvider;
