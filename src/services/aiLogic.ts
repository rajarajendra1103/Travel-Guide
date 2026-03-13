import { mockTravelData } from '../data/mockTravelData';
import { mockTransportData } from '../data/mockTransportData';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Robustly parses JSON from an AI response string, handling markdown or trailing text.
 */
function cleanAndParseJSON(text: string) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("No valid JSON found in AI response");

    const jsonString = text.substring(start, end + 1);
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        // Fallback: try removing common markdown artifacts
        const cleaned = jsonString.replace(/\\n/g, '').replace(/\\"/g, '"');
        return JSON.parse(cleaned);
    }
}

/**
 * Base AI call function with retry logic
 */
async function callGemini(prompt: string, systemInstruction?: string) {
    if (!API_KEY) throw new Error("Google AI API Key is missing. Check your .env file.");

    const body = {
        contents: [{ parts: [{ text: prompt }] }],
        ...(systemInstruction && { system_instruction: { parts: [{ text: systemInstruction }] } })
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Gemini API failure");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

export async function getDiscoveryData(destination: string) {
    const normalizedQuery = destination.toLowerCase().trim();

    // Fuzzy matching for common typos from user
    const finalKey = normalizedQuery.includes('japan') ? 'japan' :
        (normalizedQuery.includes('goa') || normalizedQuery.includes('gova')) ? 'goa' :
            (normalizedQuery.includes('mumba') || normalizedQuery.includes('mubabia')) ? 'mumbai' : null;

    if (finalKey && mockTravelData[finalKey]) {
        console.log(`Using mock data for ${finalKey}`);
        return mockTravelData[finalKey];
    }

    const systemPrompt = `You are a professional travel scout. Return ONLY valid JSON for the requested destination. 
    Use the exact structure provided. Ensure Unsplash image URLs are relevant to the location.`;

    const prompt = `Generate travel data for "${destination}".
    Structure: {
        "summary": "Insider tip...",
        "weather": { "temp": "25°C", "condition": "Sunny", "humidity": "40%", "wind": "10km/h", "uv": "5", "safetyScore": 9 },
        "places": [{ "title": "Place", "category": "Hotel", "rating": 4.5, "address": "...", "price": "$$", "image": "...", "timings": { "open": "9am", "close": "6pm", "peak": "noon" }, "transport": [{ "mode": "Bus", "desc": "10m" }] }]
    }`;

    const raw = await callGemini(prompt, systemPrompt);
    return cleanAndParseJSON(raw);
}

/**
 * AI Logic for Trip Itinerary
 */
export async function getTripItinerary(details: any) {
    try {
        const systemPrompt = `You are an expert travel planner. Return ONLY valid JSON. 
        Format budget details as percentages. Ensure dates and activities align with the duration.`;

        const prompt = `Plan a ${details.duration}-day trip to ${details.destination} for ${details.groupSize} people (${details.groupType}) with a ${details.budget} budget ($${details.budgetAmount}). 
        Interests: ${details.interests.join(', ')}. 
        Must-visits: ${details.mustVisits.join(', ')}.
        
        CRITICAL: Return ONLY valid JSON.
        Structure: {
            "itinerary": [
                { 
                    "day": 1, 
                    "activities": [
                        { 
                            "name": "Activity Name", 
                            "category": "History/Culture/Nature", 
                            "timings": "09:00 AM - 11:00 AM", 
                            "cost": "$20", 
                            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                            "distance": "1.2 km",
                            "travelTime": "15 min",
                            "transport": "Walking",
                            "crowd": "Moderate"
                        }
                    ] 
                }
            ],
            "services": { 
                "weather": "24°C, Sunny", 
                "safety": "High", 
                "etiquette": "Standard norms", 
                "budgetBreakdown": { "food": "30%", "travel": "20%", "activities": "50%" } 
            }
        }`;

        console.log("Calling Gemini for Itinerary...");
        const raw = await callGemini(prompt, systemPrompt);
        console.log("Gemini Raw Itinerary Response:", raw);
        return cleanAndParseJSON(raw);
    } catch (error) {
        console.error("AI Planner Service Error:", error);

        // Fallback: Return a realistic mock itinerary if the AI fails
        console.log("Returning fallback itinerary for", details.destination);
        return {
            "itinerary": [
                {
                    "day": 1,
                    "activities": [
                        {
                            "name": `Explore ${details.destination} City Center`,
                            "category": "Culture",
                            "timings": "09:00 AM - 12:00 PM",
                            "cost": "$0 - $20",
                            "image": "https://images.unsplash.com/photo-1544013585-366aae35b9d7",
                            "distance": "0 km",
                            "travelTime": "0 mins",
                            "transport": "Walking",
                            "crowd": "Moderate"
                        },
                        {
                            "name": "Local Gastronomy Tour",
                            "category": "Food",
                            "timings": "01:00 PM - 03:00 PM",
                            "cost": "$30",
                            "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                            "distance": "1.2 km",
                            "travelTime": "15 mins",
                            "transport": "Taxi",
                            "crowd": "High"
                        }
                    ]
                }
            ],
            "services": {
                "weather": "22°C, Partially Cloudy",
                "safety": "Generally Safe",
                "etiquette": "Respect local customs, tipping varies.",
                "budgetBreakdown": { "food": "30%", "travel": "20%", "activities": "50%" }
            }
        };
    }
}

/**
 * AI Logic for Packing Assistant
 */
export async function getPackingList(destination: string, details: any) {
    try {
        const prompt = `Generate a smart packing list for a ${details.duration}-day trip to ${destination}.
        User Activities: ${details.interests.join(', ')}.
        Group: ${details.groupSize} people (${details.groupType}).
        
        Requirements:
        1. Categorize items by: "Weather Essentials", "Activity Gear", "Electronics & Essentials", "Toiletries".
        2. Adjust for weather: Suggest cold-wear (jackets, gloves) if cold, or breathable cotton/sunscreen if hot.
        3. Include activity-specific gear: e.g., Adventure (sports shoes, first-aid), Culture (modest wear).
        4. Include baggage rules info: Cabin limit, Check-in limit, Liquid limits (100ml), Restricted items.
        
        Return JSON:
        {
            "weather": { "temp": "22°C", "condition": "Sunny", "rainChance": "10%" },
            "items": [
                { "id": 1, "category": "Weather Essentials", "item": "Light Jacket", "packed": false, "weight": "0.5kg" }
            ],
            "baggageRules": {
                "cabin": "7kg",
                "checkin": "23kg",
                "liquidLimit": "100ml per container",
                "restricted": ["Power banks in check-in", "Flammables"]
            }
        }`;

        console.log("Generating Packing List for", destination);
        const raw = await callGemini(prompt, "You are a smart baggage assistant. Return ONLY valid JSON.");
        return cleanAndParseJSON(raw);
    } catch (error) {
        console.error("Packing AI Error:", error);
        return {
            "weather": { "temp": "N/A", "condition": "Clear", "rainChance": "0%" },
            "items": [
                { "id": 1, "category": "Weather Essentials", "item": "Comfortable Walking Shoes", "packed": false, "weight": "0.8kg" },
                { "id": 2, "category": "Electronics & Essentials", "item": "Universal Power Adapter", "packed": false, "weight": "0.2kg" },
                { "id": 3, "category": "Activity Gear", "item": "Activity-appropriate Clothing", "packed": false, "weight": "1.0kg" }
            ],
            "baggageRules": {
                "cabin": "7kg",
                "checkin": "23kg",
                "liquidLimit": "100ml containers",
                "restricted": ["No lithium batteries in check-in"]
            }
        };
    }
}

/**
 * AI Logic for Transport Availability
 */
export async function getTransportAvailability(location: string) {
    const normalizedQuery = location.toLowerCase().trim();
    const finalKey = normalizedQuery.includes('kyoto') || normalizedQuery.includes('japan') ? 'kyoto' :
        (normalizedQuery.includes('mumbai') ? 'mumbai' :
            (normalizedQuery.includes('goa') ? 'goa' : null));

    if (finalKey && mockTransportData[finalKey]) {
        console.log(`Using mock transport availability for ${finalKey}`);
        return mockTransportData[finalKey];
    }

    try {
        const prompt = `Analyze transport availability for "${location}". 
        Check if Bus, Train, Plane, and Metro are typically available or reach this village/town/city.
        Return JSON:
        {
            "location": "${location}",
            "modes": {
                "bus": { "available": true, "details": "Local and intercity buses available." },
                "train": { "available": true, "details": "Main railway station nearby." },
                "plane": { "available": false, "details": "Nearest airport is 50km away." },
                "metro": { "available": false, "details": "No metro system in this area." }
            }
        }`;

        console.log("Checking Transport Availability...");
        const raw = await callGemini(prompt, "You are a transport expert. Return ONLY valid JSON.");
        return cleanAndParseJSON(raw);
    } catch (error) {
        console.error("Transport AI Error:", error);
        return {
            "location": location,
            "modes": {
                "bus": { "available": true, "details": "Standard bus services." },
                "train": { "available": true, "details": "Railway connection available." },
                "plane": { "available": false, "details": "No airport." },
                "metro": { "available": false, "details": "No metro." }
            }
        };
    }
}

/**
 * AI Logic for Detailed Route Search
 */
export async function getRouteDetails(source: string, destination: string, mode: string, cityName?: string) {
    const combinedQuery = (source + destination + (cityName || '')).toLowerCase();
    const finalKey = combinedQuery.includes('kyoto') || combinedQuery.includes('japan') ? 'kyoto' :
        (combinedQuery.includes('mumbai') ? 'mumbai' :
            (combinedQuery.includes('goa') ? 'goa' : null));

    if (finalKey && mockTransportData[finalKey]?.routes?.[mode]) {
        console.log(`Using mock route details for ${finalKey} (${mode})`);
        return { routes: mockTransportData[finalKey].routes[mode] };
    }

    try {
        const prompt = `Provide 2 detailed ${mode} routes from "${source}" to "${destination}".
        Return JSON structure:
        {
            "routes": [
                {
                    "id": "R1",
                    "number": "A101",
                    "name": "Express Route",
                    "distance": "15.4 km",
                    "travelTime": "45 mins",
                    "totalPrice": "$2.50",
                    "color": "#6366f1",
                    "stopsCount": 8,
                    "timeline": [
                        { "name": "Start Stop", "arrival": "10:00 AM", "departure": "10:05 AM", "price": "$0.00", "type": "start" },
                        { "name": "Via Point A", "arrival": "10:20 AM", "departure": "10:22 AM", "price": "$1.20", "type": "intermediate" },
                        { "name": "End Stop", "arrival": "10:45 AM", "departure": "---", "price": "$2.50", "type": "end" }
                    ]
                }
            ]
        }`;

        console.log(`Searching for ${mode} routes between ${source} and ${destination}...`);
        const raw = await callGemini(prompt, "You are a transit router. Return ONLY valid JSON.");
        return cleanAndParseJSON(raw);
    } catch (error) {
        console.error("Route AI Error:", error);
        return {
            "routes": [
                {
                    "id": "fallback-1",
                    "number": "L1",
                    "name": "Local Link",
                    "distance": "12 km",
                    "travelTime": "30 mins",
                    "totalPrice": "$2.00",
                    "color": "#10b981",
                    "stopsCount": 5,
                    "timeline": [
                        { "name": source, "arrival": "Now", "departure": "Now", "price": "$0", "type": "start" },
                        { "name": "Mid Station", "arrival": "+15m", "departure": "+17m", "price": "$1", "type": "intermediate" },
                        { "name": destination, "arrival": "+30m", "departure": "---", "price": "$2", "type": "end" }
                    ]
                }
            ]
        };
    }
}
export async function getChatResponse(destination: string, message: string, history: any[]) {
    const prompt = `Destination Context: ${destination}. History: ${JSON.stringify(history)}. User: ${message}`;
    return await callGemini(prompt, "You are a helpful travel assistant. Be concise and friendly.");
}
