import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Images from "../Images/Images";
import api from "../../contexts/APIContext";
import { CartContext } from "../../contexts/Cart";
import './index.css';

const ProductOrder = () => {
    const { cartItems } = useContext(CartContext);
    let params = useParams();

    const [productQuantity, setProductQuantity] = useState(1);
    const [product, setProduct] = useState(null);

    const apiURL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.post(apiURL + "/api/user/categories-list-items-details", { id: params?.listItemId });
                const { data } = response;
                setProduct(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [params?.id]);

    return (
        <>
            <div className="product-order-view">
                <div>
                    <Images fileName={product?.image_name} path={'details'} cssClass={'order-rectangle-image'} />
                </div>
                <div className="order-right-panel">
                    <ul className="order-summary">
                        <li className="product-name">
                            {product?.item_name}
                        </li>
                        <li>
                            <label>Ratings:</label> {product?.ratings}
                        </li>
                        <li>
                            <label>Total Saled Count:</label> {product?.send_items_count}
                        </li>
                        <li>
                            <hr />
                        </li>
                        <li>
                            <label>Price:</label>{product?.price}
                        </li>
                        <li>
                            <label>Discount:</label>{product?.discount_price}
                        </li>
                        <li>
                            <label>Total Price:</label>{product?.price - product?.discount_price}
                        </li>
                        <li className="product-counter">
                            <label>Quantity:</label>
                            <div className="counter-wrapper">
                                <input type="button" className="counter-button" value={'-'} disabled={productQuantity <= 1} onClick={() => {
                                    if (productQuantity <= 1) {
                                        return;
                                    }
                                    setProductQuantity(productQuantity - 1);
                                }} />
                                <label className="counter-label">{productQuantity}</label>
                                <input type="button" className="counter-button" value={'+'} disabled={productQuantity >= 10} onClick={() => {
                                    if (productQuantity >= 10) {
                                        return;
                                    }
                                    setProductQuantity(productQuantity + 1);
                                }} />
                            </div>
                        </li>
                        <li>
                            <label>Total Price: </label> {(product?.price - product?.discount_price) * productQuantity} (incl. of all taxes)
                        </li>
                        <li>
                            <Link to={`${'/product-confirmation/' + product?.id}`}>
                                <input type="button" className="buy-now" value={'BUY NOW'} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
};

export default ProductOrder;