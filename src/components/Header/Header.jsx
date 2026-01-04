import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../contexts/APIContext";
import "./index.css";
import starLogo from "../../assets/images/header/star-logo.gif";

const Header = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedId = searchParams.get("id") || 1;
    const [categoriesList, setCategoriesList] = useState([]);
    const { user, logout } = useAuth();

    const apiURL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(apiURL + "/api/user/categories");
                const { data } = response;
                setCategoriesList([...data]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="header-view">
            <div className="header">
                <div className="header-wrapper">
                    <ul className="left-menu">
                        <li>
                            Furniture
                        </li>
                    </ul>
                    <ul className="right-menu">
                        <li>
                            Mobile: +91 8904761075
                        </li>
                        <li>
                            Email: prabingeorge@gmail.com
                        </li>
                    </ul>

                </div>
            </div>
            <div className="middle-header">
                <div>
                    <img src={starLogo} alt="logo" className="header-logo" />
                </div>
                <div className="menu-container">
                    {user?.name ? <>
                        <label onClick={logout}>{user?.name} (Logout)</label>
                    </>:
                    <label>Sign In</label>}
                    <label>Wishlist (0)</label>
                    <label>Cart (0)</label>
                </div>
            </div>
            <div className="bottom-header">
                <div>

                    <ul className="bottom-menu">
                        {categoriesList?.length > 0 && categoriesList.map((category, index) => {
                            return (
                                <li className={(selectedId == index + 1) ? 'active-menu' : 'non-active-menu'}>
                                    <Link to={`${'/dashboard?id=' + category?.id}`}>{category?.name}</Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Header;