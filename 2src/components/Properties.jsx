import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import defaultIMG from "../assets/bg-overlay.png";
import "../styles/Home.css";
import "../styles/Properties.css";


// Skeleton loader styled like home property card
function SkeletonLoader() {
  return (
    <div className="home-property-card skeleton">
      <div className="home-property-image skeleton-image" />
      <div className="home-property-info">
        <div className="skeleton-title" />
        <div className="skeleton-text" />
        <div className="skeleton-details" />
      </div>
    </div>
  );
}

function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const propertyDataRef = collection(db, "propertyData");

    getDocs(propertyDataRef)
      .then((querySnap) => {
        const propertyData = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().data,
        }));

        const last5Properties = propertyData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setProperties(last5Properties);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error retrieving document:", error);
        setLoading(false);
      });
  }, []);

  const handleClick = (property) => {
    navigate(`/preview/${property.id}`);
  };

  return (
    <div className="home-container">
      <section className="home-property-section">
        <h2 className="home-section-title">Latest Listings</h2>
        <div className="home-property-grid">
          {loading || properties.length === 0
            ? [1, 2, 3].map((_, i) => <SkeletonLoader key={i} />)
            : properties.map((property) => (
              <div
                key={property.id}
                className="home-property-card"
                onClick={() => handleClick(property)}
              >
                <div className="home-property-image">
                  <img
                    src={property.imageUrls?.[0] || defaultIMG}
                    alt={property.title || "Just Another Property"}
                  />
                  <span className="home-property-type">{property.houseType} for {property.type}</span>
                </div>
                <div className="home-property-info">
                  <h3>{property.title}</h3>
                  <p className="home-location">
                    {property.address}, {property.state}
                  </p>
                  <p className="home-price">
                    ₦{property.price ? parseInt(property.price).toLocaleString() : "150000"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Properties;
