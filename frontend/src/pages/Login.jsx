import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { authSelector, reset, login } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { DotLoader } from "react-spinners";
const LoadingDiv = styled.h1`
  height: 90vh;
  width: 100%;
  display: grid;
  place-content: center;
`;

const LoginPage = styled.div`
  margin-top: 100px;
  width: 100%;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  form {
    min-height: 100px;
    padding: 20px 10px;
    min-width: 300px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;

    input {
      height: 35px;

      border: none;
      outline: none;
      width: 100%;
      border: 1px solid purple;
      border-radius: 5px;
      padding: 5px 10px;
    }

    .submit {
      height: 70px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      button {
        margin-top: 10px;
        height: 45px;
        width: 75px;
        background-color: #c3ff99;
        color: black;
        cursor: pointer;
        border: none;
        outline: none;
        border-radius: 5px;
      }
      span {
        font-size: 15px;
      }
      a {
        color: #c3ff99;
        font-size: 20px;
        transition: all 2s ease-in;
        &:hover {
          border-bottom: 2px solid #c3ff99;
        }
      }
    }
  }
  @media (max-width: 500px) {
    margin-top: 200px;
    input {
      height: 60px;
    }
  }
`;
const Login = () => {
  // hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, isError, message } =
    useSelector(authSelector);
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
    setFormData((prev) => ({
      ...prev,
      email: "",
      password: "",
    }));
  };

  if (isLoading) {
    return (
      <LoadingDiv>
        <DotLoader />
      </LoadingDiv>
    );
  }
  return (
    <LoginPage>
      <h1>
        Login <FaSignInAlt />
      </h1>
      <p>Please login to proceed further</p>
      <form className="reg-form form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          name="email"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          name="password"
          id="password"
          onChange={handleChange}
        />
        <div className="submit">
          <button type="submit" className="submit">
            Submit
          </button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>{" "}
          </span>
        </div>
      </form>
    </LoginPage>
  );
};
export default Login;
