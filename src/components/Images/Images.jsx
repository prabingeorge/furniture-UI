import { Link } from "react-router-dom";
import './index.css';

// const baseUrl = `http://localhost:5173/src/assets/images/`;
const baseUrl = `/assets/images/`;

const Images = ({fileName, categoryId, id, path, cssClass}) => {
    const url = baseUrl + path + '/' + fileName;

    return (
        <div className="images-view">
            <Link to={"/categories-list/" + categoryId +"/" + id}>
                <img className={cssClass} src={url} alt={fileName} />
            </Link>
        </div>
    )
}

export default Images;