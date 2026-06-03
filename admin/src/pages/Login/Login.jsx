import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { url } from "../../assets/assets";

const Login = ({ setToken }) => {
  const [currState, setCurrState] = useState("Login");
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currState === "Sign Up" && !image) {
        return toast.error("Restaurant image is required");
      }

      let newUrl = url;

      if (currState === "Login") {
        newUrl += "/api/restaurant/login";
      } else {
        newUrl += "/api/restaurant/register";
      }

      let response;

      if (currState === "Sign Up") {
        const formData = new FormData();

        formData.append("restaurantName", data.restaurantName);
        formData.append("ownerName", data.ownerName);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("phone", data.phone);
        formData.append("address", data.address);
        formData.append("image", image);
        response = await axios.post(newUrl, formData);
      } else {
        response = await axios.post(newUrl, {
          restaurantName: data.restaurantName,
          phone: data.phone,
          password: data.password,
        });
      }

      if (response.data.success) {
        if (currState === "Login") {
          localStorage.setItem("restaurantToken", response.data.token);
          setToken(response.data.token);

          navigate("/add");
        } else {
          toast.success("Signup Successful. Wait for admin approval.");

          setCurrState("Login");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Error");
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={onSubmitHandler}>
        <h2>
          {currState === "Login"
            ? "Restaurant Login"
            : "Restaurant Registration"}
        </h2>

        {currState === "Sign Up" && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
            <input
              type="text"
              name="restaurantName"
              placeholder="Restaurant Name"
              value={data.restaurantName}
              onChange={onChangeHandler}
              required
            />

            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={data.ownerName}
              onChange={onChangeHandler}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={data.phone}
              onChange={onChangeHandler}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Restaurant Address"
              value={data.address}
              onChange={onChangeHandler}
              required
            />
          </>
        )}

        {currState === "Login" ? (
          <>
            <input
              type="text"
              name="restaurantName"
              placeholder="Restaurant Name"
              value={data.restaurantName}
              onChange={onChangeHandler}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={data.phone}
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
          </>
        ) : (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
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
          </>
        )}

        <button type="submit">
          {currState === "Login" ? "Restaurant Login" : "Register Restaurant"}
        </button>

        {currState === "Login" ? (
          <p>
            Create Account?
            <span onClick={() => setCurrState("Sign Up")}>Sign Up</span>
          </p>
        ) : (
          <p>
            Already have account?
            <span onClick={() => setCurrState("Login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
