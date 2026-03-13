import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Sun, Umbrella, Zap, MapPin
} from 'lucide-react';
import './Planner.css';
import { getPackingList } from '../services/aiLogic';

const Packing: React.FC = () => {
    const [destination, setDestination] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [packingList, setPackingList] = useState<any[]>([]);
    const [weather, setWeather] = useState<any>(null);
    const [customItem, setCustomItem] = useState('');

    const generatePackingList = async () => {
        if (!destination) return;
        setIsGenerating(true);
        try {
            const data = await getPackingList(destination, { duration: 3, groupSize: 1, groupType: 'Solo', interests: [] });
            setWeather(data.weather);
            setPackingList(data.items);
        } catch (error) {
            console.error('Packing AI failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const togglePacked = (id: number) => {
        setPackingList(packingList.map(item =>
            item.id === id ? { ...item, packed: !item.packed } : item
        ));
    };

    const addCustomItem = () => {
        if (!customItem) return;
        setPackingList([...packingList, {
            id: Date.now(),
            category: 'Custom',
            item: customItem,
            packed: false,
            weight: '0.1kg'
        }]);
        setCustomItem('');
    };

    return (
        <div className="planner-page" style={{ padding: '40px' }}>
            <div className="glass" style={{ padding: '40px', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ background: 'var(--primary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <Briefcase size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Smart Packing Assistant</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>AI-driven baggage optimization and essentials list.</p>
                </div>

                <div className="search-container" style={{ marginBottom: '32px' }}>
                    <div className="search-input-wrapper">
                        <MapPin size={20} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Where are you going?"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && generatePackingList()}
                        />
                    </div>
                    <button className="explore-btn" onClick={generatePackingList} disabled={isGenerating || !destination}>
                        {isGenerating ? 'Analyzing...' : 'Generate List'}
                    </button>
                </div>

                <AnimatePresence>
                    {weather && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '20px', borderRadius: '16px', marginBottom: '32px', display: 'flex', gap: '30px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sun size={28} color="var(--primary)" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{weather.temp} - {weather.condition}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Destination Weather Analysis</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', gap: '15px' }}>
                                <div className="meta-item"><Umbrella size={16} /> {weather.rainChance} Rain</div>
                                <div className="meta-item"><Zap size={16} /> AI Optimized</div>
                            </div>
                        </motion.div>
                    )}

                    {packingList.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="packing-grid">
                            <div className="packing-category" style={{ gridColumn: '1 / -1' }}>
                                <ul className="packing-list">
                                    {packingList.map((item) => (
                                        <li key={item.id} className="packing-item">
                                            <input
                                                type="checkbox"
                                                checked={item.packed}
                                                onChange={() => togglePacked(item.id)}
                                            />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>{item.category}</span>
                                                <span style={{ fontSize: '0.95rem', color: item.packed ? 'var(--text-secondary)' : 'white', textDecoration: item.packed ? 'line-through' : 'none' }}>{item.item}</span>
                                            </div>
                                            {item.weight && <span className="weight-indicator">{item.weight}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ gridColumn: '1 / -1', marginTop: '32px', display: 'flex', gap: '12px' }}>
                                <input
                                    type="text" className="planner-input" placeholder="Add custom item..."
                                    value={customItem}
                                    onChange={(e) => setCustomItem(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                                />
                                <button className="explore-btn" onClick={addCustomItem}>Add</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Packing;
