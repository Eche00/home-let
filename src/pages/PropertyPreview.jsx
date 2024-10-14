import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/PropertyPreview.css";

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
                console.log(selectedProperty);
                console.log(propertyId);
                setProperty(selectedProperty);
            })
            .catch((error) => {
                console.error("Error retrieving document:", error);
            });
    }, [propertyId]);

    return (
        <div key={property.id} className="previewPropertyContainer">
            {/* property title */}
            <h2 className="previewPropertyTitle">
                {property.title} ({property.houseType})
            </h2>

            {/* video section */}
            {property.video?.url && property.video.url !== "" && (
                <div className="previewPropertyVideoContainer">
                    <video className="previewPropertyVideo" controls>
                        <source src={property.video.url} type="video/mp4" />
                    </video>
                </div>
            )}

            {/* image section */}
            {property.imageUrls && property.imageUrls.length > 0 && (
                <div className="previewPropertyImgContainerOverflow">
                    <div className="previewPropertyImgContainer">
                        {property.imageUrls.map((url) => (
                            <img
                                key={url}
                                className="previewPropertyImg"
                                src={url}
                                alt="Property"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* property description */}
            <p className="previewPropertyDescription">
                <b>Description: </b>
                {property.description}
            </p>

            {/* property address */}
            <p className="previewPropertyAddress">
                <b>Address: </b>
                {property.address}, {property.city}, {property.state} State
            </p>

            {/* property amenities */}
            <p className="previewPropertyAmenities">
                <b>Amenities: </b>
                {property.amenities}
            </p>

            {/* property type */}
            <p className="previewPropertyType">For {property.type}</p>

            {/* room details */}
            <div className="previewPropertyRoomSection">
                <p>{property.bathrooms} Bathrooms</p>
                <p>{property.bedrooms} Bedrooms</p>
            </div>
        </div>
    );
}

export default PropertyPreview;
