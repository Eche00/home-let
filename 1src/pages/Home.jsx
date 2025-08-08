import React, { useEffect, useState, useRef } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import "../styles/Home.css"
import defaultIMG from "../assets/bg-overlay.png"
import hood from "../assets/hood.jpg"
import { useNavigate } from "react-router-dom"
import Loading from "../components/loading"
import "@fortawesome/fontawesome-free/css/all.min.css"

function Home() {
    const [properties, setProperties] = useState([])
    const [filteredProperties, setFilteredProperties] = useState([])
    const [searchFilters, setSearchFilters] = useState({
        location: "",
        priceRange: "",
        propertyType: "",
        bedrooms: "",
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const featuredRef = useRef(null)

    // Fetch properties from Firebase
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
                setFilteredProperties(data.slice(0, 8))
            } catch (error) {
                console.error("Error fetching properties:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProperties()
    }, [])

    // Navigate to property details
    const handleViewDetails = (id) => {
        navigate(`/preview/${id}`)
    }

    // Handle search input change
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearchFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Apply filters and update results
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

        setFilteredProperties(filtered)
        setLoading(false)

        if (featuredRef.current) {
            featuredRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="home-container">
            {/* Hero Section with Search */}
            <section className="home-hero">
                <div className="home-hero-overlay">
                    <h1 className="home-hero-title">Ready to Find your Next Rental?</h1>
                    <p className="home-hero-subtitle">
                        Discover verified homes in your ideal location. Whether you're upgrading, relocating, or just browsing, we’ve got something that fits your lifestyle and budget.
                    </p>
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
                            <option value="" disabled hidden>
                                Select Price Range
                            </option>
                            <option value="0-200000">₦0 - ₦200,000</option>
                            <option value="200000-500000">₦200,000 - ₦500,000</option>
                            <option value="500000-1000000">₦500,000 - ₦1,000,000</option>
                            <option value="1000000+">₦1,000,000+</option>
                        </select>
                        <select
                            name="propertyType"
                            value={searchFilters.propertyType}
                            onChange={handleInputChange}
                        >
                            <option value="">Property Type</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Duplex">Duplex</option>
                            <option value="Bungalow">Bungalow</option>
                            <option value="Farmhouse">Farmhouse</option>
                            <option value="Flat">Flat</option>
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
            <section className="home-property-section" ref={featuredRef}>
                <h2 className="home-section-title">Featured Properties</h2>
                {loading ? (
                    <Loading />
                ) : filteredProperties.length === 0 ? (
                    <p className="home-empty-message">No properties available right now.</p>
                ) : (
                    <div className="home-property-grid">
                        {filteredProperties.map((property) => (
                            <div
                                className="home-property-card"
                                key={property.id}
                                onClick={() => handleViewDetails(property.id)}
                            >
                                <div className="home-property-image">
                                    <img
                                        src={property.data.imageUrls?.[0] || defaultIMG}
                                        alt={property.data.title || "Just Another House"}
                                    />
                                    <span className="home-property-type">
                                        {property.data.houseType || "Free House"}
                                    </span>
                                </div>
                                <div className="home-property-info">
                                    <h3>{property.data.title || "Just Another House"}</h3>
                                    <p className="home-location">
                                        {property.data.address}, {property.data.city}, {property.data.state}
                                    </p>
                                    <div className="home-property-details">
                                        <span>{property.data.bedrooms || "2"} bed</span>
                                        <span>{property.data.bathrooms || "3"} bath</span>
                                    </div>
                                    <p className="home-price">
                                        ₦
                                        {property.data.price
                                            ? parseInt(property.data.price).toLocaleString()
                                            : "15000"}{" "}
                                        Yearly
                                    </p>
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
                        <i className="fas fa-shield-alt feature-icon"></i>
                        <h3>Verified Listings</h3>
                        <p>Every property is carefully reviewed to ensure it’s safe, authentic, and ready for you.</p>
                    </div>
                    <div className="home-feature-card">
                        <i className="fas fa-headset feature-icon"></i>
                        <h3>Always Available</h3>
                        <p>From viewing to moving in, our support team is here for you—day or night.</p>
                    </div>
                    <div className="home-feature-card">
                        <i className="fas fa-money-bill-wave feature-icon"></i>
                        <h3>Transparent Pricing</h3>
                        <p>No extra charges, no surprises. What you see is what you pay.</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="home-about">
                <div className="home-about-text">
                    <h2>About Home Let</h2>
                    <p>
                        At Home Let, we’re more than just a rental platform — we’re your trusted partner in finding a place to truly call home. Whether you're a student looking for your first apartment, a family relocating to a new city, or a professional seeking comfort and convenience, our goal is to simplify your search and bring you closer to the perfect space.
                    </p>
                    <p>
                        We work hand-in-hand with landlords, agents, and local experts to ensure every listing is verified and up-to-date. From accurate pricing to high-quality photos and honest descriptions, we’re committed to transparency and reliability at every step. No more scams, misleading ads, or wasted time.
                    </p>
                    <p>
                        With a growing presence in major cities across Nigeria — including Lagos, Abuja, Port Harcourt, and beyond — we’re constantly expanding our reach to connect more people with safe, affordable, and accessible rental homes. Our smart filters, user-friendly interface, and customer-first approach mean you spend less time searching and more time settling in.
                    </p>
                    <p>
                        Home Let was built to put renters first. Backed by a passionate team, responsive support, and a vision for better housing experiences, we are here to help you navigate every part of your rental journey with confidence and ease.
                    </p>
                    <button className="home-learn-more-btn">Learn More</button>
                </div>
            </section>

            {/* Stats & Explore Section */}
            <section className="home-stats-section">
                <div className="home-stats-grid">
                    <div className="home-stats-left">
                        <h2>Explore More With Home Let</h2>
                        <p>
                            Browse thousands of verified rental properties across Nigeria — from cozy apartments to spacious family homes. Whether you're relocating, investing, or simply searching for a better space, Home Let makes the journey easier, faster, and more reliable.
                        </p>
                        <button className="home-explore-btn" onClick={() => navigate("/explore")}>
                            Explore Properties
                        </button>
                        <button className="home-contact-btn" onClick={() => navigate("/contact")}>
                            Contact Us
                        </button>
                    </div>

                    <div className="home-stats-center">
                        <img src={hood} alt="Explore Home Let" />
                    </div>

                    <div className="home-stats-right">
                        <div className="stat-item">
                            <h3>{properties.length}</h3>
                            <p>Properties</p>
                        </div>
                        <div className="stat-item">
                            <h3>24/7</h3>
                            <p>Support</p>
                        </div>
                        <div className="stat-item">
                            <h3>200+</h3>
                            <p>Vendors</p>
                        </div>
                        <div className="stat-item">
                            <h3>5,000+</h3>
                            <p>Customers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
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
        </div>
    )
}

export default Home
