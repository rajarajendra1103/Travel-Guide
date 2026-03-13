import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Shield, Map, Eye, Globe, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

// Assets
import heroBg from '../assets/photo-1506744038136-46273834b3fb.avif';
import santoriniImg from '../assets/unnamed kdlfh.png';
import kyotoImg from '../assets/unnamed kelfj.png';
import zermattImg from '../assets/unnamed kfjlgidfk.png';

const Home: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!searchQuery) return;
        // Redirect to Discovery page with the search context
        navigate(`/discovery?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <img src={heroBg} alt="Scenic Travel Background" />
                </div>
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        The World, Tailored to You.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Experience the future of travel with AI-powered discovery and hyper-personalized planning.
                    </motion.p>
                    <motion.div
                        className="search-container"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="search-input-wrapper">
                            <Search size={20} color="#64748b" />
                            <input
                                type="text"
                                placeholder="Search city, landmark, or hotel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button className="explore-btn" onClick={handleSearch}>Explore</button>
                    </motion.div>
                </div>
                <div style={{ position: 'absolute', bottom: '40px' }}>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ color: 'white' }}
                    >
                        <ArrowRight size={24} style={{ transform: 'rotate(90deg)' }} />
                    </motion.div>
                </div>
            </section>

            {/* Content sections remain on Home page for exploration */}
            <section className="section-trending">
                <div className="section-header">
                    <div>
                        <h2>Trending Destinations</h2>
                        <p>Handpicked gems selected by our AI engine for this season.</p>
                    </div>
                </div>

                <div className="destinations-grid">
                    <DestinationCard image={santoriniImg} title="Santorini, Greece" price="From $1,200 / person" tag="Top Rated" />
                    <DestinationCard image={kyotoImg} title="Kyoto, Japan" price="From $880 / person" />
                    <DestinationCard image={zermattImg} title="Zermatt, Switzerland" price="From $1,500 / person" />
                </div>
            </section>

            <section className="section-features">
                <div className="features-left">
                    <span className="tag">EXCELLENCE IN TRAVEL</span>
                    <h2>Why Choose Our AI Platform</h2>
                    <p>We blend high-end travel expertise with cutting-edge artificial intelligence to deliver an experience that's completely centered around you.</p>
                    <button className="explore-btn" style={{ padding: '14px 28px' }}>Discover More Features</button>
                </div>
                <div className="features-right">
                    <FeatureItem icon={<Map size={24} />} title="AI Planning" desc="Generate complex multi-city itineraries in seconds based on your personal budget, pace, and interests." />
                    <FeatureItem icon={<Shield size={24} />} title="Safety Insights" desc="Real-time alerts, neighborhood safety scores, and local health information updated by our global network." />
                    <FeatureItem icon={<Eye size={24} />} title="360° Exploration" desc="Virtually walk through your destination, hotel room, and local attractions before you ever commit to a booking." />
                </div>
            </section>

            <section className="section-cta">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2>Ready for your journey?</h2>
                        <button className="start-btn">Start Your AI Journey</button>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="logo">
                            <MapPin size={24} style={{ color: '#3b82f6', marginRight: '8px' }} />
                            <span>Travel Guide</span>
                        </div>
                        <p>The world's first AI-native travel platform designed for modern explorers.</p>
                        <div className="social-links">
                            <a href="#" className="social-btn"><Globe size={18} /></a>
                            <a href="#" className="social-btn"><Instagram size={18} /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const DestinationCard: React.FC<{ image: string, title: string, price: string, tag?: string }> = ({ image, title, price, tag }) => (
    <div className="destination-card">
        <img src={image} alt={title} />
        {tag && <div className="tag-top-rated">{tag}</div>}
        <div className="card-overlay">
            <h3>{title}</h3>
            <p>{price}</p>
        </div>
    </div>
);

const FeatureItem: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
    <div className="feature-item">
        <div className="feature-icon">{icon}</div>
        <div className="feature-text">
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    </div>
);

export default Home;
