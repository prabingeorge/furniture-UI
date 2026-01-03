import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../contexts/APIContext";
import "./index.css";


const Signup = () => {
    const apiURL = import.meta.env.VITE_API_URL;

    const initialSignupInfo = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        // role: "user",
        status: "completed"
    }

    const [signupInfo, setSignupInfo] = useState(initialSignupInfo);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const addFieldValue = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            const { confirmPassword, ...signupInfoCopy } = signupInfo;
            if (!signupInfo?.name) {
                setError("Name should not be empty!");
                return;
            }
            if (!signupInfo?.email) {
                setError("Email should not be empty!");
                return;
            }
            if (!signupInfo?.phone) {
                setError("Phone should not be empty!");
                return;
            }
            if (!signupInfo?.password) {
                setError("Password should not be empty!");
                return;
            }
            if (!confirmPassword) {
                setError("Confirm password should not be empty!");
                return;
            }
            if (confirmPassword !== signupInfo?.password) {
                setError("Password and Confirm password should be same!");
                return;
            }
            const response = await api.post(apiURL + "/api/auth/register", signupInfoCopy);

            if (response?.statusText === "Created") {
                setSuccess("Registered successfully. Kindly do SignIn");
                setSignupInfo(initialSignupInfo);
            }

            //   navigate("/dashboard");
        } catch (error) {
            if(error?.response?.data?.message) {
                setError(error?.response?.data?.message);
                return;
            }
            if(error?.message) {
                setError(error?.message);
                return;
            }
            setError("Already info present!", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signup-view">
            <div className="signup-wrap">
                <div className="signup-html">
                    <label htmlFor="tab-2" className="tab sign-up">Sign Up</label>
                    <div className="signup-form">
                        <div>
                            <div className="group">
                                <label htmlFor="name" className="label">Name*</label>
                                <input type="text" name="name" placeholder="Name" value={signupInfo.name} onChange={addFieldValue} className="input" />
                            </div>
                            <div className="group">
                                <label htmlFor="email" className="label">Email*</label>
                                <input type="text" name="email" placeholder="Email" value={signupInfo.email} onChange={addFieldValue} className="input" />
                            </div>
                            <div className="group">
                                <label htmlFor="phone" className="label">Phone*</label>
                                <input type="text" name="phone" placeholder="Phone" value={signupInfo.phone} onChange={addFieldValue} className="input" />
                            </div>
                            <div className="group">
                                <label htmlFor="password" className="label">Password*</label>
                                <input type="password" name="password" placeholder="Password" value={signupInfo.password} onChange={addFieldValue} className="input" />
                            </div>
                            <div className="group">
                                <label htmlFor="name" className="label">Confirm Password*</label>
                                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={signupInfo.confirmPassword} onChange={addFieldValue} className="input" />
                            </div>
                            <div className="group group-error">
                                {error && <p className="error">{error}</p>}
                                {success && <p className="success">{success}</p>}
                            </div>
                            <div className="group">
                                <input type="submit" className="button" value="Sign Up" />
                            </div>
                            <div className="footer">
                                <label htmlFor="tab-1">Already Member?</label>
                                <Link className="click-link" to="/login">Click here</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Signup;