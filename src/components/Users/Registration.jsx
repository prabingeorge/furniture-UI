import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../contexts/APIContext";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Registration = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const initialSignupInfo = {
        firstName: "",
        lastName: "",
        username: "",
        accountNumber: "",
        email: "",
        mobile: "",
        address: "",
        city: ""
    }

    const [signupInfo, setSignupInfo] = useState(initialSignupInfo);
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
        setError("");

        try {
            if (!signupInfo?.firstName) {
                setError("First name should not be empty!");
                return;
            }
            if (!signupInfo?.lastName) {
                setError("Last name should not be empty!");
                return;
            }
            if (!signupInfo?.username) {
                setError("Username should not be empty!");
                return;
            }
            if (!signupInfo?.accountNumber) {
                setError("Account number should not be empty!");
                return;
            }
            if (!signupInfo?.email) {
                setError("Email should not be empty!");
                return;
            }
            if (!signupInfo?.mobile) {
                setError("Mobile should not be empty!");
                return;
            }
            if (!signupInfo?.address) {
                setError("Address should not be empty!");
                return;
            }
            if (!signupInfo?.city) {
                setError("City should not be empty!");
                return;
            }
            const response = await api.post(apiURL + "/api/user/donation-user", signupInfo);
            navigate("/dashboard");
        } catch (error) {
            setError("Already info present!", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="registration-view">
            <div className="back-button-container">
                <Link className="back-link" to="/dashboard">Back</Link>
            </div>
            <div class="registration-wrap">
                <div class="registration-html">
                    <div className="registration-form">
                        <div>
                            <div class="group">
                                <label htmlFor="firstName" class="label">First Name*</label>
                                <input type="text" name="firstName" placeholder="First name" value={signupInfo.firstName} onChange={addFieldValue} className="input" />
                            </div>
                            <div class="group">
                                <label htmlFor="lastName" class="label">Last Name*</label>
                                <input type="text" name="lastName" placeholder="First name" value={signupInfo.lastName} onChange={addFieldValue} className="input" />
                            </div>
                            <div class="group">
                                <label htmlFor="username" class="label">Username*</label>
                                <input type="text" name="username" placeholder="username" value={signupInfo.username} onChange={addFieldValue} className="input" />
                            </div>
                            <div class="group">
                                <label htmlFor="accountNumber" class="label">Account Number*</label>
                                <input type="text" name="accountNumber" placeholder="First name" value={signupInfo.accountNumber} onChange={addFieldValue} className="input" />
                            </div>
                            <div class="group">
                                <label htmlFor="email" class="label">Email*</label>
                                <input type="text" name="email" placeholder="Email" value={signupInfo.email} onChange={addFieldValue} className="input" />
                            </div>
                            <div class="group">
                                <label htmlFor="mobile" class="label">Mobile*</label>
                                <input type="text" name="mobile" placeholder="Mobile" value={signupInfo.mobile} onChange={addFieldValue} className="input" />
                            </div>
                            <div class="group">
                                <label htmlFor="address" class="label">Address*</label>
                                <input type="text" name="address" placeholder="Address" value={signupInfo.address} onChange={addFieldValue} className="input" />
                            </div>
                            <div class="group">
                                <label htmlFor="city" class="label">City*</label>
                                <input type="text" name="city" placeholder="City" value={signupInfo.city} onChange={addFieldValue} className="input" />
                            </div>
                            <div className="group group-error">
                                {error && <p className="error">{error}</p>}
                            </div>
                            <div className="group">
                                <input type="reset" className="button reset" value="Reset" />
                                <input type="submit" className="button" value="Add" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Registration;