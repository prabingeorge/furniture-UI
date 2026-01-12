import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { renderToString } from 'react-dom/server';
import Images from "../Images/Images";
import { CartContext } from "../../contexts/Cart";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../contexts/APIContext";
import "./index.css";

const EmailTemplate = ({ cartItems }) => {
    return (
        // < !DOCTYPE html >
        <html>
            <head>
                <title>Furniture App</title>
            </head>
            <body>
                <div id="root">
                    <div className="email-view">
                        <ul style={{ border: 'solid #1161ee', listStyle: 'none', padding: '0px' }}>
                            {cartItems?.length > 0 && cartItems.map(item => {
                                return (
                                    <li key={item?.id} style={{ display: 'flex', border: '2px solid #ffa500', margin: '5px', padding: '10px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div>
                                                Name: <label style={{ fontWeight: 'bold' }} key={item?.id}>{item?.item_name}</label>
                                            </div>
                                            <div>
                                                Price: <label style={{ fontWeight: 'bold' }} key={item?.id}>{item?.price}</label> per Product
                                            </div>
                                            <div>
                                                Discount: <label style={{ fontWeight: 'bold' }} key={item?.id}>{item?.discount_price}</label>
                                            </div>
                                            <div>
                                                Total: <label style={{ fontWeight: 'bold' }} key={item?.id}>{(item?.price - item?.discount_price) * item?.quantity}</label>
                                            </div>
                                            <div>
                                                Quantity: <label style={{ fontWeight: 'bold' }} key={item?.id}>{item?.quantity}</label>
                                            </div>
                                        </div>
                                        <div>
                                            <img style={{ height: '200px' }} src={'cid:' + item?.id + '@example.com'} alt={item?.image_name} />
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <script src="/bundle.js"></script>
            </body>
        </html>
    )
}

const ProductConfirmation = () => {

    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
    let navigate = useNavigate();
    const apiURL = import.meta.env.VITE_API_URL;
    const initialUserInfo = {
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        status: "confirmed"
    }

    const [userInfo, setUserInfo] = useState(initialUserInfo);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [emailValidationError, setEmailValidationError] = useState("");

    const addFieldValue = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const saveUserInfo = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            const { confirmPassword, ...userInfoCopy } = userInfo;
            if (!userInfo?.name) {
                setError("Name should not be empty!");
                return;
            }
            if (!userInfo?.email) {
                setError("Email should not be empty!");
                return;
            }
            if (!userInfo?.phone) {
                setError("Phone should not be empty!");
                return;
            }
            if (!userInfo?.password) {
                setError("Password should not be empty!");
                return;
            }
            if (!confirmPassword) {
                setError("Confirm password should not be empty!");
                return;
            }
            if (confirmPassword !== userInfo?.password) {
                setError("Password and Confirm password should be same!");
                return;
            }
            const response = await api.post(apiURL + "/api/auth/register", userInfoCopy);

            if (response?.statusText === "Created") {
                setSuccess("Registered successfully. Kindly do SignIn");
                setUserInfo(initialUserInfo);
            }

            //   navigate("/dashboard");
        } catch (error) {
            if (error?.response?.data?.message) {
                setError(error?.response?.data?.message);
                return;
            }
            if (error?.message) {
                setError(error?.message);
                return;
            }
            setError("Already info present!", error);
        }
    };

    const savePurchaseDetails = async () => {

        try {
            let response = null;
            const promises = cartItems.map(async (cartItem) => {
                const details = {
                    userId: user?.id,
                    categoriesId: cartItem?.categoryId,
                    listId: cartItem?.list_id,
                    listItemId: cartItem?.id,
                    quantity: cartItem?.quantity,
                    amount: cartItem?.price
                }
                response = await api.post(apiURL + "/api/user/purchase-detail", details);

            });
            await Promise.all(promises);
        } catch (error) {
            if (error?.response?.data?.message) {
                setError(error?.response?.data?.message);
                return;
            }
            if (error?.message) {
                setError(error?.message);
                return;
            }
            setError("Already info present!", error);
        }
    };

    const sendConfirmationEmail = async () => {
        try {
            const html = renderToString(<EmailTemplate cartItems={cartItems} />);
            const attachments = [];
            cartItems.map(item => {
                const attachment = {
                    filename: item?.image_name,
                    path: "D:/Divine/furniturem/API/public/images/details/" + item?.image_name,
                    cid: item?.id + '@example.com' //"nodemailer@example.com", // matches the cid in the img src attribute
                };
                attachments.push(attachment);
            });

            const emailBody = {
                to: user?.email,
                subject: "Furniture Order Confirmation",
                message: html,
                attachments: attachments
            }

            await api.post(apiURL + "/api/user-profile/send-mail", emailBody);
            // if (response?.statusText === "Created") {
            //     setSuccess("Order updated successfully");
            //     clearCart();
            //     navigate('/delivery');
            // }
        } catch (error) {
            if (error?.response?.data?.message) {
                setEmailValidationError(error?.response?.data?.message);
                return;
            }
        }
    }

    const confirmedClick = async () => {
        await savePurchaseDetails();
        await sendConfirmationEmail();
        clearCart();
        navigate('/delivery');
    };

    const removeItemClick = (item) => {
        removeFromCart(item);
    }

    const { login, user } = useAuth();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    // const [isLoggedIn, setIsLoggedIn] = useState(!!user?.phone);
    const [isNewUser, setIsNewUser] = useState(false);
    const [loginError, setLoginError] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");

        try {
            if (!credentials?.email) {
                setLoginError("Email should not be empty!");
                return;
            }
            if (!credentials?.password) {
                setLoginError("Password should not be empty!");
                return;
            }
            const response = await axios.post(
                apiURL + "/api/auth/login",
                credentials
            );
            const { token } = response.data;

            login(token);
            // setIsLoggedIn(true);
        } catch (error) {
            if (error?.response?.data?.message) {
                setLoginError(error?.response?.data?.message);
                return;
            }
            if (error?.message) {
                setLoginError(error?.message);
                return;
            }
            setLoginError("Invalid Email or password.", error);
        }
    };

    if (cartItems?.length === 0) {
        return (
            <div className="product-confirmation-view">
                <label className="no-product">No orders in the Cart!</label>
            </div>
        )
    }

    return (
        <div className="product-confirmation-view">
            <ul className="product-panel">
                {cartItems?.length > 0 && cartItems.map((item, index) => {
                    return (
                        <>
                            <li key={index} className="product-wrapper">
                                <div className="product-details">
                                    <div>
                                        Name: <label>{item?.item_name}</label>
                                    </div>
                                    <div>
                                        Price: <label>{item?.price}</label> per Product
                                    </div>
                                    <div>
                                        Discount: <label>{item?.discount_price}</label>
                                    </div>
                                    <div>
                                        Total: <label>{(item?.price - item?.discount_price) * item?.quantity}</label>
                                    </div>
                                    <div>
                                        Quantity: <label>{item?.quantity}</label>
                                    </div>
                                    <div className="footer-container">
                                        <input type="button" className="button" value="Remove" onClick={() => removeItemClick(item)} />
                                    </div>
                                </div>
                                <div>
                                    <Images fileName={item?.image_name} path={'details'} cssClass={'square-image'} />
                                </div>
                            </li>
                        </>

                    )
                })}
            </ul>
            {user && <div>
                <ul className="loggedin-panel">
                    <li>
                        Name: {user?.name}
                    </li>
                    <li>
                        Email: {user?.email}
                    </li>
                    <li>
                        Mobile: {user?.phone}
                    </li>
                </ul>
            </div>}
            {!user && !isNewUser && <div>
                <div className="login-header">
                    New User Click here to Register <Link className="link" onClick={() => setIsNewUser(true)}> Click</Link>
                </div>
                <div className="login-panel">
                    <ul className="login-container">
                        <li>
                            <label htmlFor="email" className="label">Email*</label>
                            <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleChange} className="input" />
                        </li>
                        <li>
                            <label htmlFor="password" className="label">Password*</label>
                            <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} className="input" />
                        </li>
                        <li>
                            {loginError && <p className="error">{loginError}</p>}
                        </li>
                        <li className="button-container">
                            <input type="button" className="button" value="Sign In" onClick={handleSubmit} />
                        </li>
                    </ul>
                </div>
            </div>}
            {!user && isNewUser && <div>
                <div className="login-header">
                    Already registered user <Link className="link" onClick={() => setIsNewUser(false)}> Click</Link>
                </div>
                <ul className="product-panel">
                    <li>
                        <div className="group">
                            <label htmlFor="name" className="label">Full Name*</label>
                            <input type="text" name="name" placeholder="Full Name" value={userInfo?.name} onChange={addFieldValue} className="input" />
                        </div>
                    </li>
                    <li>
                        <div className="group">
                            <label htmlFor="phone" className="label">Mobile*</label>
                            <input type="text" name="phone" placeholder="Mobile" value={userInfo?.phone} onChange={addFieldValue} className="input" />
                        </div>
                    </li>
                    <li>
                        <div className="group">
                            <label htmlFor="email" className="label">Email*</label>
                            <input type="email" name="email" placeholder="Email" value={userInfo?.email} onChange={addFieldValue} className="input" />
                        </div>
                    </li>
                    <li>
                        <div className="group">
                            <label htmlFor="password" className="label">Password*</label>
                            <input type="password" name="password" placeholder="Password" value={userInfo?.password} onChange={addFieldValue} className="input" />
                        </div>
                    </li>
                    <li>
                        <div className="group">
                            <label htmlFor="confirmPassword" className="label">Confirm Password*</label>
                            <input type="password" name="confirmPassword" placeholder="Confirm" value={userInfo?.confirmPassword} onChange={addFieldValue} className="input" />
                        </div>
                    </li>
                    {(error || success) && <li>
                        <div className="group group-error">
                            {error && <label className="error">{error}</label>}
                            {success && <label className="success">{success}</label>}
                        </div>
                    </li>}
                    <li>
                        <div className="group">
                            <input type="button" className="button" value="Save" onClick={saveUserInfo} />
                        </div>
                    </li>
                </ul>
            </div>
            }
            {user && emailValidationError && <div className="email-validation-container">
                <div className="group group-error">
                    <label className="error">{emailValidationError}</label>
                </div>
            </div>}
            {user && <div className="confirm-button-wrapper">
                <input type="button" className="button" value="Confirmed" onClick={confirmedClick} />
            </div>}
        </div>
    )
};

export default ProductConfirmation;