import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, ChevronRight, Zap, Eye,
    Cloud, Shield, MessageSquare, Wind, Droplets, Sun, Map as MapIcon,
    Star, Heart, Activity, FileText, AlertTriangle, Phone, X,
    Image, Camera, Route, Map as MapIcon2, Info, Clock
} from 'lucide-react';
import './Discovery.css';
import { getDiscoveryData, getChatResponse } from '../services/aiLogic';
import { useLocation, useNavigate } from 'react-router-dom';

// Imports updated

const Discovery: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || 'Santorini, Greece';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [destination, setDestination] = useState(initialQuery);
    const [activeCategory, setActiveCategory] = useState('All');
    const [aiFilter, setAiFilter] = useState(true);
    const [showRules, setShowRules] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [aiSummary, setAiSummary] = useState('');
    const [weather, setWeather] = useState<any>(null);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: string, text: string }[]>([]);
    const [userInput, setUserInput] = useState('');

    const categories = ['All', 'Landmarks', 'Hotels', 'Restaurants', 'Museums'];

    const performSmartSearch = async (query: string) => {
        setIsSearching(true);
        setDestination(query);
        try {
            const data = await getDiscoveryData(query);
            setAiSummary(data.summary);
            setWeather(data.weather);
            setResults(data.places);
        } catch (error) {
            console.error('Smart Search failed:', error);
            // Handle error state by clearing results or showing error UI
        } finally {
            setIsSearching(false);
        }
    };

    React.useEffect(() => {
        const query = new URLSearchParams(location.search).get('q') || 'Santorini, Greece';
        setSearchQuery(query);
        setDestination(query);
        performSmartSearch(query);
    }, [location.search]);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const updatedMessages = [...chatMessages, { role: 'user', text: userInput }];
        setChatMessages(updatedMessages);
        setUserInput('');

        try {
            const response = await getChatResponse(destination, userInput, chatMessages);
            setChatMessages([...updatedMessages, { role: 'ai', text: response }]);
        } catch (error) {
            console.error('Chat failed:', error);
        }
    };

    return (
        <div className="discovery-page">
            <header className="discovery-header">
                <div className="discovery-container">
                    <div className="breadcrumbs">
                        <span className="breadcrumb-item">Discovery</span>
                        <ChevronRight size={14} />
                        <span className="breadcrumb-item">Europe</span>
                        <ChevronRight size={14} />
                        <span className="breadcrumb-item active">Greece</span>
                    </div>

                    <div className="header-main">
                        <div className="header-title">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                Exploring <span className="text-gradient">{destination}</span>
                            </motion.h1>
                            <p>{aiSummary || 'AI-powered curated results based on your preference...'}</p>
                        </div>
                        <div className="secondary-search">
                            <div className="search-input-wrapper glass">
                                <Search size={18} color="var(--text-secondary)" />
                                <input
                                    type="text"
                                    placeholder="Search landmarks, hotels..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ color: 'white' }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            // Update URL instead of just calling the function
                                            navigate(`/discovery?q=${encodeURIComponent(searchQuery)}`);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="discovery-container">
                <div className="discovery-layout">
                    <div className="results-panel">
                        <div className="filter-chips">
                            <div className="chip-group">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="ai-toggle"
                                onClick={() => setAiFilter(!aiFilter)}
                                style={{ opacity: aiFilter ? 1 : 0.6 }}
                            >
                                <Zap size={16} fill={aiFilter ? "currentColor" : "none"} />
                                Smart AI Filter: {aiFilter ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        <div className="results-grid">
                            {isSearching ? (
                                <div style={{ padding: '60px', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <Zap size={40} color="var(--primary)" />
                                    </motion.div>
                                    <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>AI is uncovering gems in {destination}...</p>
                                </div>
                            ) : (
                                results.length > 0 ? (
                                    results.map((res, i) => (
                                        <DiscoveryCard
                                            key={i}
                                            title={res.title || 'Untitled Spot'}
                                            category={res.category || 'Unknown'}
                                            image={res.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                                            rating={res.rating || 5.0}
                                            address={res.address || 'Address not available'}
                                            price={res.price || 'Contact for price'}
                                            timings={res.timings || { open: 'N/A', close: 'N/A', peak: 'N/A' }}
                                            transport={res.transport || []}
                                            gallery={res.gallery || []}
                                            pano={res.pano}
                                            vr={res.vr}
                                        />
                                    ))
                                ) : (
                                    <div style={{ padding: '60px', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>No results found for {destination}. Try a different search.</p>
                                        <button className="explore-btn" onClick={() => performSmartSearch(destination)} style={{ marginTop: '16px' }}>
                                            Try Again
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <aside className="discovery-sidebar">
                        <div className="widget weather-large">
                            <div className="widget-title"><Cloud size={16} /> Local Environment</div>
                            <div className="weather-display">
                                <Sun size={48} color="#fbbf24" style={{ margin: '0 auto' }} />
                                <div className="temp-main">{weather?.temp || '24°C'}</div>
                                <div style={{ fontWeight: 600 }}>{weather?.condition || 'Sunny'} • {destination}</div>
                            </div>
                            <div className="weather-stats">
                                <div className="stat-item">
                                    <Droplets size={14} color="#3b82f6" />
                                    <div>{weather?.humidity || '45%'} Humidity</div>
                                </div>
                                <div className="stat-item">
                                    <Wind size={14} color="#94a3b8" />
                                    <div>{weather?.wind || '12km/h'} Wind</div>
                                </div>
                                <div className="stat-item">
                                    <Activity size={14} color="#f97316" />
                                    <div>UV Index: {weather?.uv || '4'}</div>
                                </div>
                                <div className="stat-item">
                                    <MapPin size={14} color="#ef4444" />
                                    <div>Near live location</div>
                                </div>
                            </div>
                        </div>

                        <div className="widget ai-summary-box">
                            <div className="widget-title"><Zap size={16} color="var(--primary)" /> AI Insider Perspective</div>
                            <p className="summary-text">
                                {aiSummary || 'Loading AI insights...'}
                            </p>
                        </div>

                        <div className="widget">
                            <div className="widget-title"><Shield size={16} color="#10b981" /> Safety Index</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{weather?.safetyScore || '8.9'} / 10</span>
                                <span style={{ fontSize: '0.8rem', color: '#10b981' }}>{weather?.safetyScore > 7 ? 'Very Safe' : 'Safe'}</span>
                            </div>
                            <div className="safety-meter">
                                <div className="safety-fill" style={{ width: `${(weather?.safetyScore || 8.9) * 10}%` }} />
                            </div>
                            <div className="mini-map">
                                <MapIcon size={32} color="var(--text-secondary)" />
                                <span style={{ marginLeft: '10px', fontSize: '0.8rem' }}>Interactive Mini-Map</span>
                            </div>
                            <button className="rules-btn" onClick={() => setShowRules(true)}>
                                <Shield size={16} /> View Safety Rules
                            </button>
                        </div>

                        <button className="ask-assistant-btn" onClick={() => setShowChat(true)}>
                            <MessageSquare size={20} />
                            Ask My Assistant
                        </button>
                    </aside>
                </div>
            </main>

            <AnimatePresence>
                {showRules && (
                    <SafetyRulesModal onClose={() => setShowRules(false)} />
                )}
                {showChat && (
                    <AIChatModal
                        messages={chatMessages}
                        onClose={() => setShowChat(false)}
                        onSubmit={handleChatSubmit}
                        userInput={userInput}
                        onInputChange={(val) => setUserInput(val)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const AIChatModal: React.FC<{
    messages: any[],
    onClose: () => void,
    onSubmit: (e: React.FormEvent) => void,
    userInput: string,
    onInputChange: (val: string) => void
}> = ({ messages, onClose, onSubmit, userInput, onInputChange }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="safety-modal-overlay" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="safety-panel chat-panel" onClick={e => e.stopPropagation()}>
            <div className="safety-header">
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Travel Assistant</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Ask anything about your destination</p>
                </div>
                <button onClick={onClose} className="glass" style={{ padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
            </div>
            <div className="chat-content" style={{ height: '400px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '16px', margin: '0 auto' }} />
                        <p>Hi! I'm your travel expert. How can I help you today?</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`chat-message ${m.role}`} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div className="message-bubble" style={{
                            background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            maxWidth: '80%',
                            fontSize: '0.95rem'
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <form className="chat-input" onSubmit={onSubmit} style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={(e) => onInputChange(e.target.value)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                />
                <button type="submit" className="explore-btn" style={{ padding: '12px' }}><Zap size={18} /></button>
            </form>
        </motion.div>
    </motion.div>
);

const SafetyRulesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="safety-modal-overlay"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="safety-panel"
            onClick={e => e.stopPropagation()}
        >
            <div className="safety-header">
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Global Safety & Readiness</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Santorini, Greece • Updated 2 hours ago</p>
                </div>
                <button onClick={onClose} style={{ color: 'white', background: 'none', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            <div className="safety-content">
                <div className="safety-section">
                    <h4><FileText size={18} /> Documentation Required</h4>
                    <div className="safety-list">
                        <div className="safety-item"><span>ID / Passport:</span> <span>Required</span></div>
                        <div className="safety-item"><span>Visa:</span> <span>Schengen (if non-EU)</span></div>
                        <div className="safety-item"><span>Permits:</span> <span>Drones (Restricted)</span></div>
                        <div className="safety-item"><span>Health:</span> <span>Not Required</span></div>
                    </div>
                </div>

                <div className="safety-section">
                    <h4><Activity size={18} /> Local Rules & Manners</h4>
                    <div className="safety-list">
                        <div className="safety-item"><span>Dress Code:</span> <span>Smart Casual</span></div>
                        <div className="safety-item"><span>Photography:</span> <span>No Privacy Invasion</span></div>
                        <div className="safety-item"><span>Cultural:</span> <span>Respect quiet hours</span></div>
                        <div className="safety-item"><span>Laws:</span> <span>Strict littering fines</span></div>
                    </div>
                </div>

                <div className="safety-section">
                    <h4><Phone size={18} /> Emergency Services</h4>
                    <div className="emergency-grid">
                        <div className="emergency-box"><span>Police</span><strong>100</strong></div>
                        <div className="emergency-box"><span>Medical</span><strong>166</strong></div>
                        <div className="emergency-box"><span>Fire</span><strong>199</strong></div>
                        <div className="emergency-box"><span>Embassy</span><strong>+30 210...</strong></div>
                    </div>
                </div>

                <div className="safety-section">
                    <h4><AlertTriangle size={18} /> Banned Products</h4>
                    <div className="banned-tags">
                        <span className="banned-tag">Illegal Drugs</span>
                        <span className="banned-tag">Drones (unlicensed)</span>
                        <span className="banned-tag">Alcohol in Public</span>
                        <span className="banned-tag">Loud Electronics</span>
                        <span className="banned-tag">Sharp Objects</span>
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

const DiscoveryCard: React.FC<{
    title: string, category: string, image: string, rating: number,
    address: string, price: string,
    transport: { mode: string, desc: string }[],
    timings: { open: string, close: string, peak: string },
    gallery?: string[],
    pano?: string,
    vr?: string
}> = ({ title, category, image, rating, address, price, transport, timings, gallery = [], pano, vr }) => {
    const [showDistance, setShowDistance] = useState(false);
    const [isLoadingDistance, setIsLoadingDistance] = useState(false);
    const [activeVisual, setActiveVisual] = useState<'gallery' | 'pano' | 'vr' | null>(null);

    const handleCheckDistance = () => {
        setIsLoadingDistance(true);
        setTimeout(() => {
            setIsLoadingDistance(false);
            setShowDistance(true);
        }, 1200);
    };

    return (
        <motion.div
            className="discovery-card"
            whileHover={{ y: -5 }}
        >
            <div className="card-media">
                <img src={image} alt={title} />
                <div className="main-360-overlay">
                    <button className="vr-badge" onClick={() => setActiveVisual('pano')}>
                        <Eye size={18} />
                        <span>360° View</span>
                    </button>
                </div>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                    <button className="nav-icon-btn glass" style={{ padding: '8px', borderRadius: '50%' }}>
                        <Heart size={18} />
                    </button>
                </div>
            </div>

            <div className="card-body">
                <div className="card-top">
                    <div>
                        <span className="category-badge">{category}</span>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{title}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800 }}>
                        <Star size={16} fill="#f59e0b" color="#f59e0b" /> {rating}
                    </div>
                </div>

                <div className="visual-experience-section">
                    <p className="section-label">Visual Experience</p>
                    <div className="visual-btns-grid">
                        <button className="visual-btn-mini glass" onClick={() => setActiveVisual('gallery')}><Image size={14} /> Gallery</button>
                        <button className="visual-btn-mini glass" onClick={() => setActiveVisual('pano')}><Camera size={14} /> 360° Panorama</button>
                        <button className="visual-btn-mini glass" onClick={() => setActiveVisual('vr')}><Zap size={14} /> View in VR</button>
                    </div>
                </div>

                <div className="location-details-section">
                    <div className="address-row" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <MapPin size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{address}</span>
                        <MapIcon2 size={16} style={{ cursor: 'pointer' }} />
                    </div>

                    {!showDistance ? (
                        <button
                            className={`distance-btn glass ${isLoadingDistance ? 'loading' : ''}`}
                            onClick={handleCheckDistance}
                            disabled={isLoadingDistance}
                        >
                            <Route size={16} /> {isLoadingDistance ? 'Acquiring GPS...' : 'Check Distance & Route'}
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="distance-info-panel"
                        >
                            <div className="dist-row">
                                <MapPin size={14} /> <span>Distance: <strong>4.2 km</strong></span>
                            </div>
                            <div className="dist-row">
                                <Clock size={14} /> <span>Est. Time: <strong>12 mins</strong></span>
                            </div>
                            <div className="route-tags">
                                <span className="route-tag">Fastest Route (via Oia Rd)</span>
                                <span className="route-tag">Scenic Coastal Route</span>
                            </div>
                            <button className="reset-dist" onClick={() => setShowDistance(false)}>Reset</button>
                        </motion.div>
                    )}
                </div>

                <div className="expanded-info-grid">
                    <div className="info-block">
                        <p className="block-label">Transport Available</p>
                        <div className="transport-mini-list">
                            {Array.isArray(transport) ? transport.map((t: any, i: number) => (
                                <span key={i}>{typeof t === 'string' ? t : `${t.mode || 'Travel'} (${t.desc || 'N/A'})`}</span>
                            )) : <span>{String(transport)}</span>}
                        </div>
                    </div>
                    <div className="info-block">
                        <p className="block-label">Timings</p>
                        <div style={{ fontSize: '0.8rem' }}>
                            {typeof timings === 'object' && timings !== null ? (
                                <>
                                    <div><strong>Open:</strong> {timings.open || 'N/A'}</div>
                                    <div><strong>Close:</strong> {timings.close || 'N/A'}</div>
                                    <div><strong>Peak:</strong> {timings.peak || 'N/A'}</div>
                                </>
                            ) : (
                                <div>{String(timings)}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Estimated Cost</span>
                        <span style={{ fontSize: '1rem', fontWeight: 800 }}>{price}</span>
                    </div>
                    <button className="flex-btn btn-secondary glass" style={{ flex: 1 }}>
                        <Info size={18} /> Spot Details
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {activeVisual && (
                    <VisualExperienceModal
                        type={activeVisual}
                        data={{ gallery, pano, vr, title }}
                        onClose={() => setActiveVisual(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const VisualExperienceModal: React.FC<{
    type: 'gallery' | 'pano' | 'vr',
    data: { gallery: string[], pano?: string, vr?: string, title: string },
    onClose: () => void
}> = ({ type, data, onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="safety-modal-overlay" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="safety-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
            <div className="safety-header">
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{data.title} - {type.toUpperCase()}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{type === 'gallery' ? 'High definition location gallery' : 'Immersive experience'}</p>
                </div>
                <button onClick={onClose} className="glass" style={{ padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
            </div>
            <div className="safety-content" style={{ display: 'block', padding: '20px', height: '60vh', overflowY: 'auto' }}>
                {type === 'gallery' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                        {data.gallery.length > 0 ? data.gallery.map((img, i) => (
                            <img key={i} src={img} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '16px' }} alt={`${data.title} ${i}`} />
                        )) : <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>No images found in gallery.</p>}
                    </div>
                )}
                {type === 'pano' && (
                    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#111', borderRadius: '16px', overflow: 'hidden' }}>
                        <img src={data.pano || data.gallery[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.5)' }} alt="Pano Background" />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <Camera size={64} color="var(--primary)" style={{ marginBottom: '20px', margin: '0 auto' }} />
                            <h3 style={{ marginBottom: '10px' }}>360° Panorama Loaded</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Interactive preview generated from location imagery.</p>
                            <button className="explore-btn" style={{ marginTop: '20px' }}>Enter Panorama</button>
                        </div>
                    </div>
                )}
                {type === 'vr' && (
                    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#111', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
                        <Zap size={64} color="var(--primary)" />
                        <div style={{ textAlign: 'center' }}>
                            <h3>VR Experience Ready</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Put on your VR headset to explore {data.title} in virtual reality.</p>
                        </div>
                        <button className="explore-btn">Launch VR Mode</button>
                    </div>
                )}
            </div>
        </motion.div>
    </motion.div>
);

export default Discovery;
