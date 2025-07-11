import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/RelatedProperties.css"; 

function RelatedProperties({ currentProperty }) {
    const [relatedProperties, setRelatedProperties] = useState([]);
    const [noRelatedProperties, setNoRelatedProperties] = useState(false);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        if (currentProperty && currentProperty.state) {
            const propertyDataRef = collection(db, "propertyData");
            getDocs(propertyDataRef)
                .then((querySnap) => {
                    const allProperties = querySnap.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data().data,
                    }));

                    const filteredProperties = allProperties.filter(
                        (property) =>
                            property.state.toLowerCase() === currentProperty.state.toLowerCase() &&
                            property.id !== currentProperty.id
                    );

                    if (filteredProperties.length === 0) {
                        setNoRelatedProperties(true);
                    } else {
                        setNoRelatedProperties(false);
                    }

                    setRelatedProperties(filteredProperties.slice(0, 3));
                    setLoading(false); // Stop loading once data is fetched
                })
                .catch((error) => {
                    console.error("Error retrieving related properties:", error);
                    setLoading(false); // Stop loading on error
                });
        }
    }, [currentProperty]);

    const handlePropertyClick = (propertyId) => {
        navigate(`/preview/${propertyId}`);
    };

    return (
        <div className="relatedPropertiesContainer">
            <h3>Related Properties in {currentProperty.state}</h3>

            {loading ? (
                <div className="skeleton-container">
                    {/* Display 3 skeleton placeholders */}
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton-property">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-title"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    ))}
                </div>
            ) : noRelatedProperties ? (
                <p>No related properties found in {currentProperty.state}.</p>
            ) : (
                <div className="relatedPropertiesGrid">
                    {relatedProperties.map((property) => (
                        <div
                            key={property.id}
                            className="relatedPropertyCard"
                            onClick={() => handlePropertyClick(property.id)}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={property.imageUrls[0]}
                                alt={property.title}
                                className="relatedPropertyImg"
                            />
                            <div className="relatedPropertyDetails">
                                <h4>{property.title}</h4>
                                <p>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}, {property.city}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RelatedProperties;
