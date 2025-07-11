import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/Properties.css";

function ProductList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState({});

  // getting properties from db
  useEffect(() => {
    const propertyDataRef = collection(db, "propertyData");

    getDocs(propertyDataRef)
      .then((querySnap) => {
        //const propertyData = querySnap.docs.map((doc) => doc.data().data);
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));
        // getting last five updated property
        const last5Properties = propertyData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 50);
        console.log(last5Properties);
        setProperties(last5Properties);
      })
      .catch((error) => {
        console.error("Error retrieving document:", error);
      });
  }, [navigate]);

  // handling clicked property
  const handleClick = (property) => {
    setSelectedProperty(property.id);
    navigate(`/preview/${property.id}`);
    console.log(property.id);
  };

  return (
    <div>
      {properties && properties.length > 0 ? (
        // property container
        <div className="lastFiveProduct">
          {properties.map((property) => (
            //  each property
            <div key={property.id} className="eachProperty">
              {/* property hero image  */}
              <img
                onClick={() => handleClick(property)}
                className="propertyHeroImage"
                src={property.imageUrls[0]}
                alt=""
              />
              {/* property title  */}
              <h2 className="propertyTitle">
                {property.title} ({property.houseType})
              </h2>
              {/* property address  */}
              <p className="property-Address">
                <span>{property.state}</span> State
              </p>
              <p className="property-housetype">{property.housetype}</p>
              <p className="property-type">For {property.type}</p>
              <div className="propertyRoomSection">
                <p>{property.bathrooms}: Bathrooms</p>
                <p>{property.bedrooms}: Bedrooms</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No properties found</p>
      )}
    </div>
  );
}

export default ProductList;
