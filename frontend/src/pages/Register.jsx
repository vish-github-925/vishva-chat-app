import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authSelector, reset, register } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { DotLoader } from "react-spinners";

const LoadingDiv = styled.h1`
  height: 90vh;
  width: 100%;
  display: grid;
  place-content: center;
`;

const RegisterPage = styled.div`
  padding: 0px 10px;
  text-align: center;
  margin-top: 150px;
  width: 100%;
  min-height: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  form {
    min-height: 100px;
    padding: 20px 30px;
    width: 400px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    .form-group {
      height: 35px;
      width: 90%;
      input {
        border: none;
        outline: none;
        height: 100%;
        width: 100%;
        border: 1px solid purple;
        border-radius: 5px;
        padding: 5px 10px;
      }
    }
    .submit {
      height: 75px;
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
          border-bottom: 2px solid purple;
        }
      }
    }
  }
`;
const Register = () => {
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
  }, [user, isError, navigate, dispatch, isSuccess]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }
    dispatch(register(formData));
    setFormData((prev) => ({
      ...prev,
      name: "",
      email: "",
      password: "",
      password2: "",
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
    <RegisterPage>
      <h1>
        Register <FaUserAlt />
      </h1>
      <p>Please create an account to proceed further</p>
      <form className="reg-form form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            name="name"
            id="name"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            name="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            name="password"
            id="password"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm your password"
            value={password2}
            name="password2"
            id="password2"
            onChange={handleChange}
          />
        </div>
        <div className="form-group submit">
          <button type="submit">Submit</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>{" "}
          </span>
        </div>
      </form>
    </RegisterPage>
  );
};
export default Register;
