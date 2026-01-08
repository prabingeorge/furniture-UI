import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Images from "../Images/Images";
import api from "../../contexts/APIContext";
import "./index.css";

const Dashboard = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id") || 1;

  const apiURL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post(apiURL + "/api/user/categories-list-by-id", { category_id: selectedId });
        const { data } = response;
        setCategoriesList([...data]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedId]);

  if (categoriesList?.length === 0) {
    return (
      <div className="dashboard">
        <div>
          <div className="images-container">
            <label className="no-data">No data is available.</label>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div>
        <div className="images-container">
          {categoriesList?.length > 0 && categoriesList.map((category) => {
            return (
              <div key={category?.id}>
                <div>
                  <Images fileName={category?.image_name} categoryId={category?.category_id} id={category?.id} path={'dashboard'} cssClass={'circle-image'} />
                </div>
                <div className="type-container">
                  <label>{category?.type}</label>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;