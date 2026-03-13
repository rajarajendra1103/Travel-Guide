import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MapPin, Users, Clock, ArrowRight, Plus,
    Trash2, Briefcase, Sun, Wind, Umbrella, Navigation,
    ShieldCheck, Activity, Plane, Package, Zap
} from 'lucide-react';
import './Planner.css';
import { getTripItinerary, getPackingList as getAIPackingList } from '../services/aiLogic';

type Step = 'destination' | 'basic_info' | 'pre_planned' | 'itinerary' | 'packing';

const Planner: React.FC = () => {
    const [step, setStep] = useState<Step>('destination');
    const [formData, setFormData] = useState({
        destination: '',
        budget: 'Medium',
        duration: 3,
        groupSize: 1,
        groupType: 'Solo',
        groupAges: '',
        gender: 'Not specified',
        interests: [] as string[],
        budgetAmount: ''
    });
    const [prePlanned, setPrePlanned] = useState<string[]>([]);
    const [itinerary, setItinerary] = useState<any[]>([]);
    const [services, setServices] = useState<any>(null);
    const [customItem, setCustomItem] = useState('');
    const [customPlace, setCustomPlace] = useState('');
    const [packingData, setPackingData] = useState<any>(null);

    const interests = ['Adventure', 'Culture', 'History', 'Food', 'Nature', 'Shopping', 'Nightlife'];
    const genders = ['Male', 'Female', 'Other', 'Not specified'];


    // Initial packing list based on some defaults, can be made dynamic later
    const [packingList, setPackingList] = useState([
        { id: 4, category: 'Electronics', item: 'Universal Adapter', packed: true, weight: '0.2kg' },
    ]);


    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const data = await getTripItinerary({
                ...formData,
                mustVisits: prePlanned
            });

            setItinerary(data.itinerary);
            setServices(data.services || {
                weather: "Data unavailable",
                safety: "Neutral",
                etiquette: "Standard travel norms",
                budgetBreakdown: { food: "33%", travel: "33%", activities: "34%" }
            });
            setStep('itinerary');
        } catch (error: any) {
            console.error('AI Generation failed:', error);
            // Since aiLogic handles fallbacks, this block will rarely be reached, 
            // but we keep it for unexpected network crashes.
            alert(`Planning System Notice: ${error?.message || 'Connection unstable'}. Using local intelligence to build your plan.`);
            setStep('itinerary');
        } finally {
            setIsGenerating(false);
        }
    };

    const addPrePlanned = (val: string) => {
        if (val) {
            setPrePlanned([...prePlanned, val]);
        }
    };

    const removePrePlanned = (index: number) => {
        setPrePlanned(prePlanned.filter((_, i) => i !== index));
    };

    const togglePacked = (id: number) => {
        setPackingList(packingList.map(item =>
            item.id === id ? { ...item, packed: !item.packed } : item
        ));
    };

    const addCustomPackingItem = () => {
        if (customItem) {
            setPackingList([...packingList, {
                id: Date.now(),
                category: 'Custom',
                item: customItem,
                packed: false,
                weight: '0.1kg'
            }]);
            setCustomItem('');
        }
    };

    const fetchPackingList = async () => {
        setIsGenerating(true);
        try {
            const data = await getAIPackingList(formData.destination, formData);
            setPackingData(data);
            setPackingList(data.items);
            setStep('packing');
        } catch (error) {
            console.error('Failed to fetch packing list:', error);
            alert('Could not generate smart packing list. Using defaults.');
            setStep('packing');
        } finally {
            setIsGenerating(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'destination':
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="step-container">
                        <div className="glass" style={{ padding: '60px', borderRadius: '32px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <motion.div
                                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)' }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <MapPin size={40} color="white" />
                            </motion.div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Let's Start Your <span className="text-gradient">Trip Story</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>Where do you want the AI to take you?</p>

                            <div className="search-container" style={{ maxWidth: '100%', marginBottom: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="search-input-wrapper">
                                    <Search size={22} color="var(--primary)" />
                                    <input
                                        type="text"
                                        className="planner-input"
                                        style={{ border: 'none', padding: '15px', background: 'transparent', fontSize: '1.2rem' }}
                                        placeholder="Enter Destination (e.g. Kyoto, Japan)"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    />
                                </div>
                                <button
                                    className="explore-btn"
                                    style={{ padding: '15px 40px', borderRadius: '16px' }}
                                    onClick={() => setStep('basic_info')}
                                    disabled={!formData.destination}
                                >
                                    Build Plan <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'basic_info':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-container">
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Tell us about your trip</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Help AI customize your itinerary based on these details.</p>

                        <table className="input-table">
                            <tbody>
                                <tr>
                                    <td className="input-label">Travel Budget</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {['Budget', 'Medium', 'Premium'].map((b: string) => (
                                                    <button
                                                        key={b}
                                                        className={`interest-chip ${formData.budget === b ? 'active' : ''}`}
                                                        onClick={() => setFormData({ ...formData, budget: b })}
                                                    >
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={formData.budget}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                >
                                                    <input
                                                        type="text"
                                                        className="planner-input"
                                                        placeholder={`Enter ${formData.budget} amount (e.g. $1,500)`}
                                                        value={formData.budgetAmount}
                                                        onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="input-label">Duration (Days)</td>
                                    <td>
                                        <input
                                            type="number" className="planner-input" value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="input-label">Group Size</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <input
                                                type="number" className="planner-input" style={{ width: '80px' }} value={formData.groupSize}
                                                onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) })}
                                            />
                                            <span style={{ color: 'var(--text-secondary)' }}>Travelers</span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {['Solo', 'Couple', 'Family', 'Friends'].map((t: string) => (
                                                    <button
                                                        key={t}
                                                        className={`interest-chip ${formData.groupType === t ? 'active' : ''}`}
                                                        onClick={() => setFormData({ ...formData, groupType: t })}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                            {formData.groupSize > 1 && (
                                                <input
                                                    type="text" className="planner-input" style={{ flex: 1, minWidth: '200px' }}
                                                    placeholder="Specify ages (e.g. 25, 28, 5)"
                                                    value={formData.groupAges}
                                                    onChange={(e) => setFormData({ ...formData, groupAges: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="input-label">Gender</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {genders.map((g: string) => (
                                                <button
                                                    key={g}
                                                    className={`interest-chip ${formData.gender === g ? 'active' : ''}`}
                                                    onClick={() => setFormData({ ...formData, gender: g })}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="input-label">Interests</td>
                                    <td>
                                        <div className="interest-chips">
                                            {interests.map((i: string) => (
                                                <button
                                                    key={i}
                                                    className={`interest-chip ${formData.interests.includes(i) ? 'active' : ''}`}
                                                    onClick={() => {
                                                        const newInterests = formData.interests.includes(i)
                                                            ? formData.interests.filter(item => item !== i)
                                                            : [...formData.interests, i];
                                                        setFormData({ ...formData, interests: newInterests });
                                                    }}
                                                >
                                                    {i}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="btn-group">
                            <button className="btn-secondary" onClick={() => setStep('destination')}>Back</button>
                            <button className="explore-btn" style={{ flex: 1 }} onClick={() => setStep('pre_planned')}>Next Step</button>
                        </div>
                    </motion.div>
                );

            case 'pre_planned':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-container">
                        <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Any Must-Visit Places?</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Mention any landmarks or spots you've already decided to visit.</p>

                            <div className="pre-planned-section">
                                <div className="place-input-row">
                                    <input
                                        type="text"
                                        className="planner-input"
                                        placeholder="Enter place name..."
                                        value={customPlace}
                                        onChange={(e) => setCustomPlace(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addPrePlanned(customPlace);
                                                setCustomPlace('');
                                            }
                                        }}
                                    />
                                    <button className="explore-btn" onClick={() => {
                                        addPrePlanned(customPlace);
                                        setCustomPlace('');
                                    }}><Plus size={20} /></button>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {prePlanned.map((p, i) => (
                                        <div key={i} className="interest-chip active" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {p} <Trash2 size={14} onClick={() => removePrePlanned(i)} style={{ cursor: 'pointer' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="btn-group">
                                <button className="btn-secondary" onClick={() => setStep('basic_info')}>Skip</button>
                                <button
                                    className={`explore-btn ${isGenerating ? 'loading' : ''}`}
                                    style={{ flex: 1 }}
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? 'AI is Planning...' : 'Generate Itinerary'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'itinerary':
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="planner-page">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{formData.destination} Itinerary</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>{formData.duration} Days • {formData.groupType} • {formData.budget} Budget</p>
                            </div>
                            <button className="explore-btn" onClick={async () => {
                                setIsGenerating(true);
                                try {
                                    const context = `Itinerary: ${itinerary.map(d => d.activities.map((a: any) => a.name).join(', ')).join('. ')}`;
                                    const data = await getAIPackingList(formData.destination, context);
                                    setPackingList(data.items || []);
                                    setStep('packing');
                                } catch (err) {
                                    console.error('Packing AI failed:', err);
                                } finally {
                                    setIsGenerating(false);
                                }
                            }}>
                                <Briefcase size={20} /> {isGenerating ? 'Analyzing...' : 'Packing Assistant'}
                            </button>
                        </div>

                        {services && (
                            <div className="glass" style={{ padding: '30px', borderRadius: '24px', marginBottom: '40px', border: '1px solid var(--primary)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Zap size={18} /> AI Travel Intel & Services
                                </h3>
                                <table className="input-table" style={{ margin: 0, background: 'transparent', border: 'none' }}>
                                    <tbody>
                                        <tr>
                                            <td className="input-label" style={{ padding: '12px 0' }}>Weather Analysis</td>
                                            <td style={{ padding: '12px 0' }}>{services.weather}</td>
                                        </tr>
                                        <tr>
                                            <td className="input-label" style={{ padding: '12px 0' }}>Safety Rating</td>
                                            <td style={{ padding: '12px 0' }}>{services.safety}</td>
                                        </tr>
                                        <tr>
                                            <td className="input-label" style={{ padding: '12px 0' }}>Local Etiquette</td>
                                            <td style={{ padding: '12px 0' }}>{services.etiquette}</td>
                                        </tr>
                                        <tr>
                                            <td className="input-label" style={{ padding: '12px 0' }}>Cost Breakdown</td>
                                            <td style={{ padding: '12px 0' }}>
                                                <div style={{ display: 'flex', gap: '20px' }}>
                                                    <span>🍔 Food: {services.budgetBreakdown.food}</span>
                                                    <span>🚕 Travel: {services.budgetBreakdown.travel}</span>
                                                    <span>🎟 Activities: {services.budgetBreakdown.activities}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '20px' }}>
                            <button className="explore-btn" style={{ padding: '16px 40px', borderRadius: '16px' }} onClick={fetchPackingList}>
                                <Briefcase size={20} /> Get Smart Packing List
                            </button>
                        </div>

                        <div className="itinerary-timeline">
                            <div className="timeline-line" />
                            {itinerary.map(day => (
                                <div key={day.day} className="day-section">
                                    <div className="day-header">
                                        <div className="day-badge">{day.day}</div>
                                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Day {day.day}</h3>
                                    </div>

                                    <div className="activities-container">
                                        {day.activities.map((act: any, idx: number) => (
                                            <div key={idx} className="timeline-activity">
                                                <div className="timeline-dot" />
                                                <div className="activity-card">
                                                    <div className="activity-media">
                                                        <img src={act.image} alt={act.name} className="activity-image" />
                                                        <div className="activity-time-tag">{act.timings}</div>
                                                    </div>
                                                    <div className="activity-info">
                                                        <div className="activity-type-row">
                                                            <span className="activity-category">{act.category}</span>
                                                            <div className="dot-divider" />
                                                            <span className="activity-cost-tag">{act.cost}</span>
                                                        </div>
                                                        <h4>{act.name}</h4>
                                                        <div className="activity-meta-grid">
                                                            <div className="meta-pill"><Navigation size={12} /> {act.distance}</div>
                                                            <div className="meta-pill"><Clock size={12} /> {act.travelTime}</div>
                                                            <div className="meta-pill"><Plane size={12} /> {act.transport}</div>
                                                            <div className="meta-pill"><Users size={12} /> {act.crowd}</div>
                                                        </div>
                                                    </div>
                                                    <div className="activity-actions">
                                                        <button className="spot-btn">Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'packing':
                const weather = packingData?.weather || { temp: '22°C', condition: 'Clear', rainChance: '10%' };
                const rules = packingData?.baggageRules || { cabin: '7kg', checkin: '23kg', liquidLimit: '100ml', restricted: [] };

                const packedCount = packingList.filter(i => i.packed).length;

                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="step-container">
                        <div className="packing-assistant-panel" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <div>
                                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Smart <span className="text-gradient">Packing Guide</span></h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>AI-curated for {formData.destination} • {formData.duration} Days</p>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div className="glass" style={{ padding: '8px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: packedCount === packingList.length ? 'var(--success)' : 'var(--primary)' }} />
                                        <span style={{ fontWeight: 700 }}>{packedCount}/{packingList.length} Packed</span>
                                    </div>
                                    <button className="btn-secondary" onClick={() => setStep('itinerary')}>Back to Plan</button>
                                </div>
                            </div>

                            {/* Weather Card */}
                            <div className="glass" style={{ padding: '24px', borderRadius: '24px', marginBottom: '32px', display: 'flex', gap: '40px', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Sun size={32} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{weather.temp} - {weather.condition}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Destination Forecast • {weather.rainChance} Rain</div>
                                    </div>
                                </div>
                                <div style={{ height: '40px', width: '1px', background: 'var(--glass-border)' }} />
                                <div style={{ flex: 1, display: 'flex', gap: '24px' }}>
                                    <div className="meta-pill"><Umbrella size={16} /> Rain Ready</div>
                                    <div className="meta-pill"><Wind size={16} /> Wind: Normal</div>
                                    <div className="meta-pill"><Activity size={16} /> High Activity</div>
                                </div>
                            </div>

                            <div className="packing-grid">
                                {['Weather Essentials', 'Activity Gear', 'Electronics & Essentials', 'Toiletries', 'Custom'].map(cat => (
                                    <PackingSection
                                        key={cat}
                                        title={cat}
                                        icon={cat === 'Weather Essentials' ? <Sun size={18} /> :
                                            cat === 'Activity Gear' ? <Activity size={18} /> :
                                                cat === 'Toiletries' ? <Package size={18} /> : <Zap size={18} />}
                                        items={packingList.filter(i => i.category === cat)}
                                        onToggle={togglePacked}
                                    />
                                ))}

                                <div className="packing-category rules-card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <h5 style={{ color: '#10b981' }}><ShieldCheck size={18} /> Airline Security & Baggage</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div className="rule-item">
                                            <span>Cabin Limit:</span>
                                            <strong style={{ color: 'white' }}>{rules.cabin}</strong>
                                        </div>
                                        <div className="rule-item">
                                            <span>Check-in:</span>
                                            <strong style={{ color: 'white' }}>{rules.checkin}</strong>
                                        </div>
                                        <div className="rule-item">
                                            <span>Liquids:</span>
                                            <strong style={{ color: 'white' }}>{rules.liquidLimit}</strong>
                                        </div>
                                        <div className="warning-box">
                                            <p><strong>Restricted:</strong> {rules.restricted?.join(', ') || 'No power banks in check-in.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                <input
                                    type="text" className="planner-input" style={{ background: 'rgba(0,0,0,0.3)', border: 'none' }}
                                    placeholder="Need anything else? Add extra items here..."
                                    value={customItem}
                                    onChange={(e) => setCustomItem(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomPackingItem()}
                                />
                                <button className="explore-btn" style={{ padding: '12px 30px' }} onClick={addCustomPackingItem}>➕ Add</button>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="planner-page">
            <AnimatePresence mode="wait">
                {renderStep()}
            </AnimatePresence>
        </div>
    );
};

const PackingSection = ({ title, icon, items, onToggle }: any) => (
    <div className="packing-category">
        <h5>{icon} {title}</h5>
        <ul className="packing-list">
            {items.map((item: any) => (
                <li key={item.id} className={`packing-item ${item.packed ? 'packed' : ''}`}>
                    <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => onToggle(item.id)}
                    />
                    <span style={{ flex: 1, textDecoration: item.packed ? 'line-through' : 'none', opacity: item.packed ? 0.5 : 1 }}>{item.item}</span>
                    <span className="weight-indicator">{item.weight}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default Planner;

