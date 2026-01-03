import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./index.css";

const Login = () => {
  const apiURL = import.meta.env.VITE_API_URL;

  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!credentials?.email) {
        setError("Email should not be empty!");
        return;
      }
      if (!credentials?.password) {
        setError("Password should not be empty!");
        return;
      }
      const response = await axios.post(
        apiURL + "/api/auth/login",
        credentials
      );
      const { token } = response.data;

      login(token);
      navigate("/dashboard");
    } catch (error) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
        return;
      }
      if (error?.message) {
        setError(error?.message);
        return;
      }
      setError("Invalid Email or password.", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-view">
        <div className="login-wrap">
          <div className="login-html">
            <label htmlFor="tab-2" className="tab sign-in">Sign In</label>
            <div className="login-form">
              <div>
                <div className="group">
                  <label htmlFor="email" className="label">Email*</label>
                  <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} className="input" />
                </div>
                <div className="group">
                  <label htmlFor="password" className="label">Password*</label>
                  <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} className="input" />
                </div>
                <div className="group group-error">
                  {error && <p className="error">{error}</p>}
                </div>
                <div className="group">
                  <input type="submit" className="button" value="Sign In" />
                </div>
                <div className="hr"></div>
                <div className="footer">
                  <Link to="/">Forgot Password!</Link>
                  <div>
                    New User?<Link to="/signup"> Click here!</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;