import { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ setShowLogin }) => {
  const {
    setToken,
    url,
    loadCartData,
    fetchUserProfile,
    cartItems,
  } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (e) =>
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        currState === "Login"
          ? "/api/user/login"
          : "/api/user/register";

      const response = await axios.post(url + endpoint, data);

      if (response.data.success) {
        const newToken = response.data.token;

        setToken(newToken);
        localStorage.setItem("token", newToken);

        // Merge guest cart into user's server cart
        const guestEntries = Object.entries(cartItems).filter(
          ([, qty]) => qty > 0
        );

        for (const [itemId, qty] of guestEntries) {
          for (let i = 0; i < qty; i++) {
            await axios.post(
              `${url}/api/cart/add`,
              { itemId },
              {
                headers: { token: newToken },
              }
            );
          }
        }

        await loadCartData(newToken);
        await fetchUserProfile(newToken);

        toast.success(
          currState === "Login"
            ? "Logged in successfully!"
            : "Account created successfully!"
        );

        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const goToPage = (path) => {
    setShowLogin(false);
    navigate(path);
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={data.email}
            onChange={onChangeHandler}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            required
          />
        </div>

        <button type="submit">
          {currState === "Login" ? "Login" : "Create account"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />

          <p>
            By continuing, I agree to the{" "}
            <span onClick={() => goToPage("/terms")}>
              Terms of Use
            </span>
            {" & "}
            <span onClick={() => goToPage("/privacy")}>
              Privacy Policy
            </span>
            .
          </p>
        </div>

        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;