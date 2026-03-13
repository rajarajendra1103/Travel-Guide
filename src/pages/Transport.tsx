import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Train, Plane, Navigation, Search, ArrowRight, MapPin, Locate, Info, Building2, Landmark, Waves, Clock } from 'lucide-react';
import { getTransportAvailability, getRouteDetails } from '../services/aiLogic';
import './Transport.css';

const Transport: React.FC = () => {
    const [step, setStep] = useState<'search' | 'modes'>('search');
    const [query, setQuery] = useState('');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [transportData, setTransportData] = useState<any>(null);
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [searchSubMode, setSearchSubMode] = useState<'route' | 'p2p'>('p2p');
    const [routeResults, setRouteResults] = useState<any[]>([]);
    const [activeRoute, setActiveRoute] = useState<any | null>(null);

    const handleSearch = async () => {
        if (!query) return;
        setIsLoading(true);
        try {
            const data = await getTransportAvailability(query);
            setTransportData(data);
            setStep('modes');
        } catch (error) {
            console.error(error);
            alert("Location data unavailable. Please try another place.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRouteSearch = async () => {
        if (searchSubMode === 'p2p' && (!source || !destination)) return;
        setIsLoading(true);
        try {
            const data = await getRouteDetails(source || query, destination || 'City Center', selectedMode || 'bus', query);
            setRouteResults(data.routes);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocateMe = () => {
        setIsLoading(true);
        // Mocking geo-location detection
        setTimeout(() => {
            setSource("Current Location (Kyoto Station Area)");
            setIsLoading(false);
        }, 1000);
    };

    const renderStep = () => {
        switch (step) {
            case 'search':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="transport-search-hero">
                        <div className="glass search-card">
                            <div className="icon-badge">
                                <Navigation size={32} color="white" />
                            </div>
                            <h2>Where is your <span className="text-gradient">Destination?</span></h2>
                            <p>Search for any village, town, or city to see available transport modes.</p>

                            <div className="search-bar-wrapper">
                                <Search size={20} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter Village, Town, or City Name..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button className="explore-btn" onClick={handleSearch} disabled={isLoading}>
                                    {isLoading ? 'Searching...' : 'Check Availability'} <ArrowRight size={18} />
                                </button>
                            </div>

                            <div className="location-chips">
                                {['Kyoto', 'Mumbai', 'Goa', 'Tokyo'].map(loc => (
                                    <button key={loc} onClick={() => { setQuery(loc); handleSearch(); }} className="chip">
                                        {loc === 'Kyoto' ? <Building2 size={12} /> : loc === 'Goa' ? <Waves size={12} /> : <Landmark size={12} />}
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'modes':
                interface TransportMode {
                    id: string;
                    label: string;
                    icon: (color: string) => React.ReactNode;
                    color: string;
                }

                const modes: TransportMode[] = [
                    { id: 'bus', label: 'Bus', icon: (color: string) => <Bus size={28} color={color} />, color: '#6366f1' },
                    { id: 'train', label: 'Train', icon: (color: string) => <Train size={28} color={color} />, color: '#06b6d4' },
                    { id: 'plane', label: 'Plane', icon: (color: string) => <Plane size={28} color={color} />, color: '#f59e0b' },
                    { id: 'metro', label: 'Metro', icon: (color: string) => <Navigation size={28} color={color} />, color: '#ec4899' },
                ];

                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="modes-view">
                        <div className="view-header">
                            <div>
                                <h3 className="location-title">Transport in {transportData.location}</h3>
                                <p>Available transport modes analyzed by AI</p>
                            </div>
                            <div className="header-actions">
                                <button
                                    className="btn-primary nav-action-btn locate-variant"
                                    onClick={() => {
                                        setSelectedMode('navigation');
                                        setSearchSubMode('p2p');
                                        setSource('');
                                    }}
                                >
                                    <Locate size={18} /> Direct Navigation
                                </button>
                                <button className="btn-secondary" onClick={() => setStep('search')}>Change Location</button>
                            </div>
                        </div>

                        <div className="modes-grid">
                            {modes.map(mode => {
                                const info = transportData.modes[mode.id];
                                const isAvailable = info?.available;

                                return (
                                    <motion.div
                                        key={mode.id}
                                        whileHover={isAvailable ? { scale: 1.05, y: -5 } : {}}
                                        className={`mode-card ${isAvailable ? 'available' : 'unavailable'}`}
                                        onClick={() => {
                                            if (isAvailable) {
                                                setSelectedMode(mode.id);
                                                if (mode.id === 'navigation') setSearchSubMode('p2p');
                                            }
                                        }}
                                        style={{ '--accent-color': mode.color } as any}
                                    >
                                        <div className="mode-icon-box" style={{ background: isAvailable ? `rgba(${parseInt(mode.color.slice(1, 3), 16)}, ${parseInt(mode.color.slice(3, 5), 16)}, ${parseInt(mode.color.slice(5, 7), 16)}, 0.1)` : 'rgba(255,255,255,0.05)' }}>
                                            {mode.icon(isAvailable ? mode.color : 'rgba(255,255,255,0.2)')}
                                        </div>
                                        <h4>{mode.label}</h4>
                                        <p>{info?.details || 'Not available in this region'}</p>

                                        {isAvailable ? (
                                            <div className="available-tag">Dynamic • Click to Search</div>
                                        ) : (
                                            <div className="unavailable-tag">Static • No Services</div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <AnimatePresence>
                            {selectedMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    className="details-overlay glass"
                                >
                                    <div className="details-header">
                                        <div className="mode-label">
                                            {selectedMode.toUpperCase()} GUIDE
                                        </div>
                                        <div className="toggle-search">
                                            {selectedMode === 'navigation' ? (
                                                <>
                                                    <button
                                                        className={searchSubMode === 'p2p' ? 'active' : ''}
                                                        onClick={() => {
                                                            setSearchSubMode('p2p');
                                                            setSource('');
                                                        }}
                                                    >
                                                        Place-to-Place
                                                    </button>
                                                    <button
                                                        className={searchSubMode === 'locate' as any ? 'active' : ''}
                                                        onClick={() => {
                                                            setSearchSubMode('locate' as any);
                                                            handleLocateMe();
                                                        }}
                                                    >
                                                        My Location
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className={searchSubMode === 'p2p' ? 'active' : ''}
                                                        onClick={() => setSearchSubMode('p2p')}
                                                    >
                                                        Source to Destination
                                                    </button>
                                                    <button
                                                        className={searchSubMode === 'route' ? 'active' : ''}
                                                        onClick={() => setSearchSubMode('route')}
                                                    >
                                                        Route Search
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <button className="close-btn" onClick={() => setSelectedMode(null)}>×</button>
                                    </div>

                                    <div className="details-content">
                                        <div className="search-inputs">
                                            <div className="input-group">
                                                <Locate size={18} color="var(--primary)" />
                                                <input
                                                    type="text"
                                                    placeholder={searchSubMode === 'p2p' ? "Enter Starting Point..." : searchSubMode === 'locate' as any ? "Detecting location..." : "Enter Route Number..."}
                                                    value={source}
                                                    onChange={(e) => setSource(e.target.value)}
                                                    readOnly={searchSubMode === 'locate' as any}
                                                />
                                                {searchSubMode === 'p2p' && (
                                                    <button className="locate-mini-btn" onClick={handleLocateMe} title="Use My Location">
                                                        <Locate size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            {searchSubMode === 'p2p' && (
                                                <>
                                                    <div className="connector" />
                                                    <div className="input-group">
                                                        <MapPin size={18} color="var(--accent)" />
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Destination..."
                                                            value={destination}
                                                            onChange={(e) => setDestination(e.target.value)}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <button className="search-exec" onClick={handleRouteSearch} disabled={isLoading}>
                                                {isLoading ? 'Searching...' : `Search ${selectedMode}s`}
                                            </button>
                                        </div>

                                        <div className="route-exploration-grid">
                                            {/* Results List */}
                                            <div className="routes-list">
                                                {routeResults.map(route => (
                                                    <div
                                                        key={route.id}
                                                        className={`result-route-card ${activeRoute?.id === route.id ? 'active' : ''}`}
                                                        onClick={() => setActiveRoute(route)}
                                                    >
                                                        <div className="route-header">
                                                            <span className="route-num" style={{ background: route.color }}>{route.number}</span>
                                                            <div className="route-main">
                                                                <h5>{route.name}</h5>
                                                                <div className="quick-meta">
                                                                    <span><Navigation size={12} /> {route.distance}</span>
                                                                    <span><Clock size={12} /> {route.travelTime}</span>
                                                                </div>
                                                            </div>
                                                            <div className="route-price">{route.totalPrice}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {routeResults.length === 0 && !isLoading && (
                                                    <div className="results-placeholder">
                                                        <div className="glass-inner">
                                                            <Info size={32} color="var(--primary)" />
                                                            <p>Enter details above to see available routes</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Detailed View */}
                                            <AnimatePresence>
                                                {activeRoute && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                        className="route-details-panel"
                                                    >
                                                        {/* Interactive Map Placeholder */}
                                                        <div className="map-viz glass">
                                                            <div className="map-overlay">
                                                                <div className="map-controls">
                                                                    <button>+</button>
                                                                    <button>-</button>
                                                                </div>
                                                                <div className="route-path-info">
                                                                    <div className="dot" style={{ background: activeRoute.color }} />
                                                                    <span>Active Path Visualization</span>
                                                                </div>
                                                            </div>
                                                            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1450&auto=format&fit=crop" alt="Map View" />
                                                        </div>

                                                        {/* Full Timeline */}
                                                        <div className="full-timeline-card glass">
                                                            <div className="timeline-header">
                                                                <h4>Route Timeline</h4>
                                                                <div className="stops-pill">{activeRoute.stopsCount} Stops</div>
                                                            </div>
                                                            <div className="timeline-scroll">
                                                                {activeRoute.timeline.map((stop: any, idx: number) => (
                                                                    <div key={idx} className={`timeline-stop-row ${stop.type}`}>
                                                                        <div className="stop-left">
                                                                            <span className="arrival">{stop.arrival}</span>
                                                                            <span className="departure">{stop.departure}</span>
                                                                        </div>
                                                                        <div className="stop-spine">
                                                                            <div className="stop-node" style={{ borderColor: activeRoute.color }} />
                                                                            {idx < activeRoute.timeline.length - 1 && (
                                                                                <div className="stop-line" style={{ background: activeRoute.color }} />
                                                                            )}
                                                                        </div>
                                                                        <div className="stop-right">
                                                                            <div className="stop-name-row">
                                                                                <span className="stop-name">{stop.name}</span>
                                                                                <span className="stop-price">{stop.price}</span>
                                                                            </div>
                                                                            <span className="stop-meta">{stop.type === 'start' ? 'Origin' : stop.type === 'end' ? 'Destination' : 'Via Point'}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
        }
    };

    return (
        <div className="transport-page container">
            {renderStep()}
        </div>
    );
};

export default Transport;
