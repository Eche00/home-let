import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/Properties.css";

function ProductList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter properties based on the search input
  useEffect(() => {
    const propertyDataRef = collection(db, "propertyData");

    getDocs(propertyDataRef)
      .then((querySnap) => {
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));

        // Filter properties based on the search query
        const filteredData = propertyData.filter((property) => {
          return (
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.houseType.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        // Sort by most recent and set filtered properties
        const last5Properties = filteredData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProperties(last5Properties);
      })
      .catch((error) => {
        console.error("Error retrieving document:", error);
      });
  }, [searchQuery, navigate]); // Update whenever searchQuery changes

  // Handling clicked property
  const handleClick = (property) => {
    navigate(`/preview/${property.id}`);
  };

  return (
    <div className="search-container">
      {/* Search Input */}
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Describe a Property eg. Duplex in Owerri"
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchInput"
        />
      </div>

      {properties && properties.length > 0 ? (
        // property container
        <div className="searchDisplay">
          {properties.map((property) => (
            //  each property
            <div key={property.id} className="eachsearchedProperty">
              {/* property hero image  */}
              <img
                onClick={() => handleClick(property)}
                className="propertysearchHeroImage"
                src={property.imageUrls[0]}
                alt=""
              />
              {/* property type / title  */}
              <p className="property-type">For {property.type}</p>
              <h2 className="propertySearchTitle">{property.title}</h2>
              {/* property address  */}
              <div className="propertySearchAddress">
                <p className="property-Address">
                  <span>{property.state}</span> State
                </p>
                <p className="property-housetype">{property.houseType} </p>
              </div>

              <p className="dashedLine">
                <span className="dash0"></span>
                <span className="dash1"></span>
              </p>
              <div className="propertySearchRoomSection">
                <p>{property.bathrooms}: Bathrooms</p>
                <p>{property.bedrooms}: Bedrooms</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="npProperty">No properties found</p>
      )}
    </div>
  );
}

export default ProductList;
