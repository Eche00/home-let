import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import "../styles/PropertyPreview.css";
import RelatedProperties from "../components/RelatedProperties";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHomeLgAlt, faMapMarkerAlt, faRestroom } from "@fortawesome/free-solid-svg-icons";

// Skeleton Component
const Skeleton = () => {
    return (
        <div className="skeleton">
            <div className="skeleton-img"></div>
            <div className="skeleton-details">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-button"></div>
            </div>
        </div>
    );
};

// Modal Component
const Modal = ({ isOpen, closeModal, property }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Physical Inspection</h2>
                <p>
                    First check if user is authenticated, if not then display a button to
                    close modal and link to login page.
                </p>
                <p>
                    A form will be contained here to handle and create a collection called
                    inspections. It will contain the requested date, time, and will add
                    the vendor's id too.
                </p>
                <p>
                    On creation, the status becomes pending till the vendor accepts or
                    declines to decide its new state, then a complete state when it is
                    done.
                </p>
                <button onClick={closeModal} className="close-modal-button">
                    Close
                </button>
            </div>
        </div>
    );
};

function PropertyPreview() {
    // getting propertyId
    const { propertyId } = useParams();
    const [property, setProperty] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // state for modal

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
                setIsLoading(false); // Set loading to false when data is fetched
            })
            .catch((error) => {
                console.error("Error retrieving document:", error);
                setIsLoading(false); // In case of an error, stop loading
            });
    }, [propertyId]);

    // Function to handle modal open
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to handle modal close
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div key={property.id} className="previewPropertyContainer">
            {isLoading ? (
                <>
                    {/*  Display Skeleton while loading */}
                    <Skeleton />
                    {/* Related Properties Component */}
                    <RelatedProperties currentProperty={property} />
                </>
            ) : (
                <>
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
                    <div className="previewDetails">
                        <div className="flex-container">
                            <div className="flex-left">
                                <h2 className="previewPropertyTitle">
                                    {property.title} ({property.houseType})
                                </h2>
                                <p className="previewPropertyAddress">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} /> <b>Address: </b>
                                    {property.address}, {property.city}, {property.state} State
                                </p>
                            </div>
                            <div className="flex-right">
                                {/* video section */}
                                {property.video?.url && property.video.url !== "" && (
                                    <div className="previewPropertyVideoContainer">
                                        <a
                                            href={property.video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <button className="previewPropertyVideoButton">
                                                Request Virtual Tour
                                            </button>
                                        </a>
                                    </div>
                                )}
                                {/* To Open the agent's profile url */}
                                <button
                                    className="previewPropertyInspectButton"
                                    onClick={openModal} // open the modal on click
                                >
                                    Physical Inspection
                                </button>
                            </div>
                        </div>

                        {/* Property Description */}
                        <div className="previewPropertyDescription">
                            {property.description} with {property.amenities}

                            {/* Room Details */}
                            <div className="previewPropertyRoomSection">
                                <p>For {property.type}</p>
                                <p>
                                    <FontAwesomeIcon icon={faRestroom} /> {property.bathrooms}{" "}
                                    Bathrooms
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faHomeLgAlt} /> {property.bedrooms}{" "}
                                    Bedrooms
                                </p>
                            </div>

                            <div>
                                A physical tour of the building attracts an inspection fee of
                                4,000 NGN. Once requested, an inspection date will be set to
                                physically inspect the {property.houseType}.
                            </div>
                        </div>
                    </div>

                    {/* Related Properties Component */}
                    <RelatedProperties currentProperty={property} />

                    {/* Modal Component */}
                    <Modal isOpen={isModalOpen} closeModal={closeModal} property={property} />
                </>
            )}
        </div>
    );
}

export default PropertyPreview;
