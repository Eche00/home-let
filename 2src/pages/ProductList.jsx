import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import defaultIMG from "../assets/bg-overlay.png";
import "../styles/Home.css";
import "../styles/Properties.css";


function ProductList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Update search input state
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const propertyDataRef = collection(db, "propertyData");

    getDocs(propertyDataRef)
      .then((querySnap) => {
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));

        // Filter properties based on search query
        const filteredData = propertyData.filter((property) => {
          return (
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.houseType.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        // Sort by most recent createdAt date
        const sortedProperties = filteredData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProperties(sortedProperties);
      })
      .catch((error) => {
        console.error("Error retrieving document:", error);
      });
  }, [searchQuery]);

  // Navigate to property preview on click
  const handleClick = (property) => {
    navigate(`/preview/${property.id}`);
  };

  return (
    <div className="search-container">
      {/* Search input */}
      <div className="home-search-form-section">
        <input
          type="text"
          placeholder="eg. Duplex in Owerri"
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchInput"
        />
      </div>

      {/* Properties grid or no properties message */}
      {properties.length > 0 ? (
        <section className="home-property-grid">
          {properties.map((property) => (
            <div
              key={property.id}
              className="home-property-card"
              onClick={() => handleClick(property)}
            >
              <div className="home-property-image">
                <img
                  src={property.imageUrls?.[0] || defaultIMG}
                  alt={property.title || "Just Another Property's Image"}
                />
                <span className="home-property-type">{property.houseType || "Just Another Property"} for {property.type || "Renting"}</span>
              </div>
              <div className="home-property-info">
                <h3>{property.title || "Just Another Property"}</h3>
                <p className="home-location">
                  {property.address || "My New House"}, {property.state || "My State"}
                </p>
                <div className="home-property-details">
                  <span>{property.bedrooms || "2"} bed</span>
                  <span>{property.bathrooms || "3"} bath</span>
                </div>
                <p className="home-price">
                  ₦{property.price ? parseInt(property.price).toLocaleString() : "150000"} Yearly
                </p>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <p className="home-empty-message">No properties found</p>
      )}
    </div>
  );
}

export default ProductList;
