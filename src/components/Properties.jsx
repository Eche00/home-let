import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/Properties.css";

// Skeleton Loader Component
function SkeletonLoader() {
    return (
        <div className="skeleton-property">
            <div className="skeleton-image"></div>
            <div className="skeleton-title"></div>
        </div>
    );
}

function Properties() {
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
        <div className="properties-covers">
            <div className="reg-contents">
                <div>
                    <h1 className="title">New Properties</h1>
                    <div className="lastFiveProduct">
                        {loading || properties.length === 0 ? (
                            // Show skeleton loader for each property when loading or no properties are found
                            [1, 2, 3, 4].map((_, index) => (
                                <SkeletonLoader key={index} />
                            ))
                        ) : (
                            // Property container
                            properties.map((property) => (
                                // Each property, click event attached to the entire div
                                <div
                                    key={property.id}
                                    className="eachProperty"
                                    onClick={() => handleClick(property)} // Event handler moved here
                                >
                                    <div className="image-container">
                                        {/* Property hero image */}
                                        <img
                                            className="propertyHeroImage"
                                            src={property.imageUrls[0]}
                                            alt=""
                                        />
                                        {/* Property state (top-right corner of the image) */}
                                        <div className="property-state">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} /> <span>{property.state}</span>
                                        </div>
                                    </div>
                                    {/* Property title */}
                                    <h2 className="propertyTitle">
                                        {property.title} ({property.houseType})
                                    </h2>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Properties;
