import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import "../styles/VendorProperties.css";


function VendorProperties() {
  const currentUser = auth.currentUser;

  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

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

        console.log(matchingPropertyIds);

        setProperties(matchingPropertyIds);
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
    <div className="allVendorPropertyContainer">
      <h3 className="recentH3">My Properties:</h3>

      {properties && properties.length > 0 ? (
        // property container
        <div className="vendorProducts">
          {properties.map((property, index) => (
            //  each property
            <div
              key={index}
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
        <p className="noProperty">You have no properties created.</p>
      )}
    </div>
  );
}

export default VendorProperties;
