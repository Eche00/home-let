import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "../../styles/RecentProperties.css";
import { db } from "../../lib/firebase";

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <div className="skeleton-property">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
    </div>
  );
}

function RecentProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Getting properties from db
  useEffect(() => {
    const propertyDataRef = collection(db, "propertyData");

    getDocs(propertyDataRef)
      .then((querySnap) => {
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));
        // Getting recently updated properties
        const last5Properties = propertyData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setProperties(last5Properties);
        setLoading(false); // Set loading to false when data is loaded
      })
      .catch((error) => {
        console.error("Error retrieving document:", error);
        setLoading(false); // Even in case of error, stop showing loading
      });
  }, [navigate]);

  // Handling a clicked property
  const handleClick = (property) => {
    navigate(`/preview/${property.id}`);
  };

  return (
    <div className="allVendorPropertyContainer">
      <h3 className="recentH3">Recently Added Products:</h3>

      {properties && properties.length > 0 ? (
        // property container

        <div className="vendorProducts">
          {properties.map((property) => (
            //  each property
            <div
              key={property.id}
              onClick={() => handleClick(property)}
              className="eachProperty">
              {/* property hero image  */}
              <img
                className="propertyHeroImage"
                src={property.imageUrls}
                alt=""
              />
              {/* property title  */}
              <h2 className="propertyTitle">
                {property.title} ({property.houseType})
              </h2>
            </div>
          ))}
        </div>
      ) : (
        <p className="noProperty">No properties found </p>
      )}
    </div>
  );
}

export default RecentProperties;
