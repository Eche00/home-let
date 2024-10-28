import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // Import the FontAwesome icon you want to use
import "../../styles/MyRecent.css";
import { auth, db } from "../../lib/firebase";

function LastProperty() {
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const propertyDataRef = query(collection(db, "propertyData"));

    getDocs(propertyDataRef)
      .then((querySnap) => {
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));

        const matchingPropertyIds = propertyData.filter((property) =>
          property.id.endsWith(currentUser.uid)
        );
        const last5Properties = matchingPropertyIds
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 1);

        setProperties(last5Properties);
      })
      .catch((error) => {
        console.error("Error retrieving document:", error);
      });
  }, [navigate]);

  // Handling a clicked property
  const handleClick = (property) => {
    navigate(`/preview/${property.id}`);
  };

  return (
    <div className="myRecentProductsContainer">
      {properties && properties.length > 0 ? (
        // Property container
        <div className="myRecentProducts">
          {properties.map((property, index) => (
            // Each property
            <div
              key={index}
              className="eachPropertyRecent"
              onClick={() => handleClick(property)}
            >
              <h3 className="recentH3">My Latest Property</h3>

              {/* Property hero image  */}
              <img
                className="recentPropertyHeroImage"
                src={property.imageUrls}
                alt=""
              />
              {/* Property title  */}
              <h2 className="recentPropertyTitle">
                {property.title} ({property.houseType})
              </h2>
            </div>
          ))}
        </div>
      ) : (
        <div className="noPropertiesContainer">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="noPropertiesIcon" />
          <h4 className="noPropertiesHeading">There are no properties yet.</h4>
          <button className="addPropertyButton" onClick={() => navigate('/add')}>
            Add Property
          </button>
        </div>
      )}
    </div>
  );
}

export default LastProperty;
