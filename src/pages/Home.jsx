import React, { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import "../styles/Home.css"
import defaultIMG from "../assets/bg-overlay.png"
import { useNavigate } from "react-router-dom"

function Home() {
    const [properties, setProperties] = useState([]) // all fetched properties
    const [filteredProperties, setFilteredProperties] = useState([]) // filtered search results
    const [searchFilters, setSearchFilters] = useState({
        location: "",
        priceRange: "",
        propertyType: "",
        bedrooms: "",
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true)
            try {
                const querySnapshot = await getDocs(collection(db, "propertyData"))
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setProperties(data)
                // initially, filteredProperties shows only first 9
                setFilteredProperties(data.slice(0, 9))
            } catch (error) {
                console.error("Error fetching properties:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProperties()
    }, [])

    const handleViewDetails = (id) => {
        navigate(`/preview/${id}`)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearchFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSearch = (e) => {
        e.preventDefault()

        setLoading(true)
        const filtered = properties.filter((property) => {
            const data = property.data

            const locationMatch = searchFilters.location
                ? (data.city?.toLowerCase().includes(searchFilters.location.toLowerCase()) ||
                   data.address?.toLowerCase().includes(searchFilters.location.toLowerCase()))
                : true

            let priceMatch = true
            if (searchFilters.priceRange) {
                const price = parseInt(data.price)
                const [min, max] = searchFilters.priceRange.split("-")
                if (max) {
                    priceMatch = price >= parseInt(min) && price <= parseInt(max)
                } else if (searchFilters.priceRange.endsWith("+")) {
                    priceMatch = price >= parseInt(min)
                }
            }

            const typeMatch = searchFilters.propertyType
                ? data.houseType?.toLowerCase() === searchFilters.propertyType.toLowerCase()
                : true

            let bedroomsMatch = true
            if (searchFilters.bedrooms) {
                if (searchFilters.bedrooms === "4+") {
                    bedroomsMatch = data.bedrooms >= 4
                } else {
                    bedroomsMatch = data.bedrooms === parseInt(searchFilters.bedrooms)
                }
            }

            return locationMatch && priceMatch && typeMatch && bedroomsMatch
        })

        setFilteredProperties(filtered)  // <-- show ALL matching results here, no slice
        setLoading(false)
    }

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="home-hero">
                <div className="home-hero-overlay">
                    <h1 className="home-hero-title">Home Let</h1>
                    <p className="home-hero-subtitle">Find your perfect rental home</p>
                    <form className="home-search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={searchFilters.location}
                            onChange={handleInputChange}
                        />
                        <select
                            name="priceRange"
                            value={searchFilters.priceRange}
                            onChange={handleInputChange}
                        >
                            <option value="">Price Range</option>
                            <option value="0-150000">₦0 - ₦150,000</option>
                            <option value="150000-300000">₦150,000 - ₦300,000</option>
                            <option value="300000+">₦300,000+</option>
                        </select>
                        <select
                            name="propertyType"
                            value={searchFilters.propertyType}
                            onChange={handleInputChange}
                        >
                            <option value="">Property Type</option>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                        </select>
                        <select
                            name="bedrooms"
                            value={searchFilters.bedrooms}
                            onChange={handleInputChange}
                        >
                            <option value="">Bedrooms</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4+">4+</option>
                        </select>
                        <button type="submit">Search</button>
                    </form>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="home-property-section">
                <h2 className="home-section-title">Featured Properties</h2>
                {loading ? (
                    <p className="home-loading-message">Loading...</p>
                ) : filteredProperties.length === 0 ? (
                    <p className="home-empty-message">No properties available right now.</p>
                ) : (
                    <div className="home-property-grid">
                        {filteredProperties.map((property) => (
                            <div className="home-property-card" key={property.id}>
                                <div className="home-property-image">
                                    <img
                                        src={property.data.imageUrls?.[0] || defaultIMG}
                                        alt={property.data.title || "Just Another House"}
                                    />
                                    <span className="home-property-type">
                                        {property.data.houseType || "N/A"}
                                    </span>
                                </div>
                                <div className="home-property-info">
                                    <h3>{property.data.title || "Just Another House"}</h3>
                                    <p className="home-location">
                                        {property.data.address}, {property.data.city},{" "}
                                        {property.data.state}
                                    </p>
                                    <div className="home-property-details">
                                        <span>{property.data.bedrooms || "N/A"} bed</span>
                                        <span>{property.data.bathrooms || "N/A"} bath</span>
                                    </div>
                                    <p className="home-price">
                                        ₦
                                        {property.data.price
                                            ? parseInt(property.data.price).toLocaleString()
                                            : "15000"}{" "}
                                        / month
                                    </p>
                                    <button
                                        className="home-view-btn"
                                        onClick={() => handleViewDetails(property.id)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Features Section */}
            <section className="home-features">
                <h2 className="home-section-title">Why Choose Home Let?</h2>
                <div className="home-features-grid">
                    <div className="home-feature-card">
                        <img src="/images/secure.svg" alt="Secure" />
                        <h3>Secure Listings</h3>
                        <p>We verify every property to ensure safety and trust.</p>
                    </div>
                    <div className="home-feature-card">
                        <img src="/images/support.svg" alt="Support" />
                        <h3>24/7 Support</h3>
                        <p>Our team is here to help anytime during your rental journey.</p>
                    </div>
                    <div className="home-feature-card">
                        <img src="/images/affordable.svg" alt="Affordable" />
                        <h3>Affordable Prices</h3>
                        <p>Get the best deals without compromising on comfort.</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="home-about">
                <div className="home-about-image">
                    <img src="/images/about-home.jpg" alt="About Home Let" />
                </div>
                <div className="home-about-text">
                    <h2>About Home Let</h2>
                    <p>
                        We believe everyone deserves a place to call home. Our platform
                        makes it easy to find trusted rental properties across Nigeria.
                    </p>
                    <p>
                        Whether moving to Lagos or Abuja, we offer verified listings and
                        exceptional service to ease your search.
                    </p>
                    <button className="home-learn-more-btn">Learn More</button>
                </div>
            </section>

            {/* Testimonials */}
            <section className="home-testimonials">
                <h2 className="home-section-title">What Our Users Say</h2>
                <div className="home-testimonials-grid">
                    <div className="home-testimonial-card">
                        <p>"Home Let made finding my new apartment so easy and stress-free!"</p>
                        <span>- Ada, Lagos</span>
                    </div>
                    <div className="home-testimonial-card">
                        <p>"Amazing support and great property options. Highly recommended."</p>
                        <span>- Chidi, Abuja</span>
                    </div>
                    <div className="home-testimonial-card">
                        <p>"Affordable prices and reliable listings. Love this platform."</p>
                        <span>- Ngozi, Port Harcourt</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="home-footer-content">
                    <h3>Home Let</h3>
                    <p>Helping you find your ideal rental home with ease and comfort.</p>
                    <p>© {new Date().getFullYear()} Home Let. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Home
