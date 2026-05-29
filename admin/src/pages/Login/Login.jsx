import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { url } from "../../assets/assets";

const Login = ({ setToken }) => {
  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
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
      let newUrl = url;

      if (currState === "Login") {
        newUrl += "/api/admin/login";
      } else {
        newUrl += "/api/user/register";
      }

      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        if (currState === "Login") {
          localStorage.setItem("adminToken", response.data.token);

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
        <h2>Admin {currState}</h2>

        {currState === "Sign Up" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={onChangeHandler}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={onChangeHandler}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={onChangeHandler}
          required
        />

        <button type="submit">
          {currState === "Login" ? "Login" : "Sign Up"}
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
