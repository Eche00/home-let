import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../../styles/MyRecents.css";
import { auth, db } from "../../lib/firebase";

function MyRecents() {
  const currentUser = auth.currentUser;

  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState({});

  useEffect(() => {
    // const propertyDataRef = collection(db, "propertyData");
    const propertyDataRef = query(collection(db, "propertyData"));

    getDocs(propertyDataRef)
      .then((querySnap) => {
        //const propertyData = querySnap.docs.map((doc) => doc.data().data);
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));

        const matchingPropertyIds = propertyData.filter((property) =>
          property.id.endsWith(currentUser.uid)
        );
        const last5Properties = matchingPropertyIds
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

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
      <h3 className="recentH3">My top 5 Properties:</h3>

      {properties && properties.length > 0 ? (
        // property container
        <div className="myRecentProducts">
          {properties.map((property, index) => (
            //  each property
            <div key={index} className="eachPropertyRecent">
              {/* property hero image  */}
              <img
                className="recentPropertyHeroImage"
                src={property.imageUrls}
                alt=""
              />
              {/* property title  */}
              <h2 className="recentPropertyTitle">
                {property.title} ({property.houseType})
              </h2>
              {/* property title  */}
              <h2 className="recentPropertyTitle">For {property.type}</h2>
              <button
                className="viewButton"
                onClick={() => handleClick(property)}>
                view
              </button>
            </div>
          ))}
          <Link to="/vendorproperties" className="viewMore">
            More &rarr;
          </Link>
        </div>
      ) : (
        <p className="noProperty">You have no properties created.</p>
      )}
    </div>
  );
}

export default MyRecents;
