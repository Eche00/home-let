import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/PropertyPreview.css";
import RelatedProperties from "../components/RelatedProperties";  // Import the RelatedProperties component

function PropertyPreview() {
    const { propertyId } = useParams(); // getting propertyId
    const [property, setProperty] = useState({});

    useEffect(() => {
        // getting the properties from the db
        const propertyDataRef = collection(db, "propertyData");
        getDocs(propertyDataRef)
            .then((querySnap) => {
                const propertyData = querySnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data().data,
                }));
                // filtering the db to check for the id which matches the propertyId
                const selectedProperty = propertyData.find(
                    (prop) => prop.id === propertyId
                );
                setProperty(selectedProperty);
            })
            .catch((error) => {
                console.error("Error retrieving document:", error);
            });
    }, [propertyId]);

    return (
        <div key={property.id} className="previewPropertyContainer">
            {/* Image Section */}
            {property.imageUrls && property.imageUrls.length > 0 && (
                <div className="previewPropertyImgContainer">
                    <img
                        key={property.imageUrls[0]}
                        className="previewPropertyImgLarge"
                        src={property.imageUrls[0]}
                        alt="Property"
                        onClick={() => window.open(property.imageUrls[0], "_blank")}
                    />
                    <div className="previewPropertyImgSideContainer">
                        {property.imageUrls.slice(1, 3).map((url) => (
                            <img
                                key={url}
                                className="previewPropertyImg"
                                src={url}
                                alt="Property"
                                onClick={() => window.open(url, "_blank")}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Property Title and Details */}
            <div className="flex-container">
                <div className="flex-left">
                    <h2 className="previewPropertyTitle">
                        {property.title} ({property.houseType})
                    </h2>
                    <p className="previewPropertyAddress">
                        <b>Address: </b>
                        {property.address}, {property.city}, {property.state} State
                    </p>
                </div>
                <div className="flex-right">
                    {/* video section */}
                    {property.video?.url && property.video.url !== "" && (
                        // * A click on this button checks if the user is authenticated, if not then navigate back to login
                        // !  If user is logged in, create a collection (inspections), 
                        // ! which contains the id  of the customer and the vendor, and a status array for pending, accepted, cancelled, completed, and null   
                        // ! Physical inspections has a cost too                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //    
                        <div className="previewPropertyVideoContainer">
                            <a href={property.video.url} target="_blank" rel="noopener noreferrer">
                                <button className="previewPropertyVideoButton">Request Virtual Tour</button>
                            </a>
                        </div>
                    )}
                    {/* To Open the agent's profile url */}
                    <button
                        className="previewPropertyInspectButton"
                    // * A click on this button will
                    >
                        Physical Inspection
                    </button>
                </div>
            </div>

            {/* Property Description */}
            <div className="previewPropertyDescription">
                {property.description} with {property.amenities}
            </div>

            {/* Room Details */}
            <div className="previewPropertyRoomSection">
                <p>For {property.type}</p>
                <p>{property.bathrooms} Bathrooms</p>
                <p>{property.bedrooms} Bedrooms</p>
            </div>

            {/* Related Properties Component */}
            <RelatedProperties currentProperty={property} />
        </div>
    );
}

export default PropertyPreview;
