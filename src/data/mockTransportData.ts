export const mockTransportData: Record<string, any> = {
    "kyoto": {
        "location": "Kyoto, Japan",
        "modes": {
            "bus": { "available": true, "details": "Extensive city bus network. Kyoto City Bus covers most attractions." },
            "train": { "available": true, "details": "JR Lines and private railways like Hankyu and Keihan Connect to Osaka and Nara." },
            "plane": { "available": false, "details": "No airport in Kyoto. Nearest is Kansai International (KIX)." },
            "metro": { "available": true, "details": "Two subway lines: Karasuma (North-South) and Tozai (East-West)." }
        },
        "routes": {
            "bus": [
                {
                    "id": "kyoto-bus-205",
                    "number": "205",
                    "name": "Kinkaku-ji Loop",
                    "distance": "12.5 km",
                    "travelTime": "50 mins",
                    "totalPrice": "¥230",
                    "color": "#6366f1",
                    "stopsCount": 15,
                    "timeline": [
                        { "name": "Kyoto Station", "arrival": "09:00 AM", "departure": "09:05 AM", "price": "¥0", "type": "start" },
                        { "name": "Shijo Kawaramachi", "arrival": "09:15 AM", "departure": "09:17 AM", "price": "¥230", "type": "intermediate" },
                        { "name": "Kinkaku-ji Temple", "arrival": "09:50 AM", "departure": "---", "price": "¥230", "type": "end" }
                    ]
                },
                {
                    "id": "kyoto-bus-100",
                    "number": "100",
                    "name": "Raku Bus (Tourist)",
                    "distance": "15 km",
                    "travelTime": "60 mins",
                    "totalPrice": "¥230",
                    "color": "#ec4899",
                    "stopsCount": 10,
                    "timeline": [
                        { "name": "Kyoto Station", "arrival": "09:10 AM", "departure": "09:15 AM", "price": "¥0", "type": "start" },
                        { "name": "Kiyomizu-dera", "arrival": "09:30 AM", "departure": "09:32 AM", "price": "¥230", "type": "intermediate" },
                        { "name": "Ginkaku-ji", "arrival": "10:10 AM", "departure": "---", "price": "¥230", "type": "end" }
                    ]
                }
            ],
            "train": [
                {
                    "id": "kyoto-train-jr-nara",
                    "number": "200",
                    "name": "Nara Line (Local)",
                    "distance": "44 km",
                    "travelTime": "70 mins",
                    "totalPrice": "¥720",
                    "color": "#10b981",
                    "stopsCount": 12,
                    "timeline": [
                        { "name": "Kyoto Station", "arrival": "10:00 AM", "departure": "10:05 AM", "price": "¥0", "type": "start" },
                        { "name": "Inari Station", "arrival": "10:10 AM", "departure": "10:11 AM", "price": "¥150", "type": "intermediate" },
                        { "name": "Nara Station", "arrival": "11:15 AM", "departure": "---", "price": "¥720", "type": "end" }
                    ]
                },
                {
                    "id": "kyoto-train-hankyu",
                    "number": "H-Exp",
                    "name": "Hankyu Kyoto Line",
                    "distance": "45 km",
                    "travelTime": "45 mins",
                    "totalPrice": "¥410",
                    "color": "#9f1239",
                    "stopsCount": 8,
                    "timeline": [
                        { "name": "Kyoto-Kawaramachi", "arrival": "11:00 AM", "departure": "11:03 AM", "price": "¥0", "type": "start" },
                        { "name": "Katsura", "arrival": "11:12 AM", "departure": "11:13 AM", "price": "¥190", "type": "intermediate" },
                        { "name": "Osaka-Umeda", "arrival": "11:45 AM", "departure": "---", "price": "¥410", "type": "end" }
                    ]
                }
            ],
            "navigation": [
                {
                    "id": "kyoto-nav-1",
                    "number": "Live",
                    "name": "Walk + Metro + Walk",
                    "distance": "5.2 km",
                    "travelTime": "24 mins",
                    "totalPrice": "¥210",
                    "color": "#10b981",
                    "stopsCount": 4,
                    "timeline": [
                        { "name": "Your Location (near Station)", "arrival": "Now", "departure": "10:00 AM", "price": "¥0", "type": "start" },
                        { "name": "Kyoto Station (Subway)", "arrival": "10:05 AM", "departure": "10:08 AM", "price": "¥0", "type": "intermediate" },
                        { "name": "Karasuma Oike", "arrival": "10:15 AM", "departure": "10:16 AM", "price": "¥210", "type": "intermediate" },
                        { "name": "Marutamachi (Destination)", "arrival": "10:24 AM", "departure": "---", "price": "¥210", "type": "end" }
                    ]
                }
            ]
        }
    },
    "mumbai": {
        "location": "Mumbai, India",
        "modes": {
            "bus": { "available": true, "details": "BEST buses cover the entire city. Red buses are iconic." },
            "train": { "available": true, "details": "The lifeline of Mumbai. Western, Central, and Harbour lines." },
            "plane": { "available": true, "details": "Chhatrapati Shivaji Maharaj International Airport (BOM)." },
            "metro": { "available": true, "details": "Ghatkopar-Versova Line 1 and newly opened Lines 2A & 7." }
        },
        "routes": {
            "train": [
                {
                    "id": "mumbai-train-western",
                    "number": "WR Fast",
                    "name": "Western Line Fast",
                    "distance": "36 km",
                    "travelTime": "55 mins",
                    "totalPrice": "₹20",
                    "color": "#ef4444",
                    "stopsCount": 10,
                    "timeline": [
                        { "name": "Churchgate", "arrival": "08:00 AM", "departure": "08:05 AM", "price": "₹0", "type": "start" },
                        { "name": "Bandra", "arrival": "08:32 AM", "departure": "08:33 AM", "price": "₹10", "type": "intermediate" },
                        { "name": "Borivali", "arrival": "09:00 AM", "departure": "---", "price": "₹20", "type": "end" }
                    ]
                },
                {
                    "id": "mumbai-train-central",
                    "number": "CR Slow",
                    "name": "Central Line Local",
                    "distance": "54 km",
                    "travelTime": "90 mins",
                    "totalPrice": "₹25",
                    "color": "#3b82f6",
                    "stopsCount": 24,
                    "timeline": [
                        { "name": "CSMT", "arrival": "09:00 AM", "departure": "09:05 AM", "price": "₹0", "type": "start" },
                        { "name": "Dadar", "arrival": "09:20 AM", "departure": "09:22 AM", "price": "₹10", "type": "intermediate" },
                        { "name": "Thane", "arrival": "10:10 AM", "departure": "10:12 AM", "price": "₹20", "type": "intermediate" },
                        { "name": "Kalyan", "arrival": "10:30 AM", "departure": "---", "price": "₹25", "type": "end" }
                    ]
                }
            ],
            "navigation": [
                {
                    "id": "mumbai-nav-1",
                    "number": "Live",
                    "name": "Taxi + Train",
                    "distance": "22 km",
                    "travelTime": "45 mins",
                    "totalPrice": "₹150",
                    "color": "#10b981",
                    "stopsCount": 3,
                    "timeline": [
                        { "name": "Your Location (Colaba)", "arrival": "Now", "departure": "10:00 AM", "price": "₹0", "type": "start" },
                        { "name": "Churchgate Station", "arrival": "10:15 AM", "departure": "10:18 AM", "price": "₹100", "type": "intermediate" },
                        { "name": "Andheri (Destination)", "arrival": "10:45 AM", "departure": "---", "price": "₹150", "type": "end" }
                    ]
                }
            ]
        }
    },
    "goa": {
        "location": "Goa, India",
        "modes": {
            "bus": { "available": true, "details": "Kadamba Transport Corporation and private buses." },
            "train": { "available": true, "details": "Madgaon and Thivim are major stations on Konkan Railway." },
            "plane": { "available": true, "details": "Dabolim (South) and Mopa (North) airports." },
            "metro": { "available": false, "details": "No metro system in Goa." }
        },
        "routes": {
            "bus": [
                {
                    "id": "goa-bus-panjim-baga",
                    "number": "P1",
                    "name": "Panjim to Baga Shuttle",
                    "distance": "18 km",
                    "travelTime": "45 mins",
                    "totalPrice": "₹50",
                    "color": "#f59e0b",
                    "stopsCount": 6,
                    "timeline": [
                        { "name": "Panjim Bus Stand", "arrival": "11:00 AM", "departure": "11:10 AM", "price": "₹0", "type": "start" },
                        { "name": "Baga End", "arrival": "11:55 AM", "departure": "---", "price": "₹50", "type": "end" }
                    ]
                },
                {
                    "id": "goa-bus-margao-panjim",
                    "number": "M1",
                    "name": "Margao - Panjim Express",
                    "distance": "33 km",
                    "travelTime": "60 mins",
                    "totalPrice": "₹60",
                    "color": "#10b981",
                    "stopsCount": 4,
                    "timeline": [
                        { "name": "Margao Terminal", "arrival": "12:00 PM", "departure": "12:10 PM", "price": "₹0", "type": "start" },
                        { "name": "Bambolim", "arrival": "12:45 PM", "departure": "12:46 PM", "price": "₹40", "type": "intermediate" },
                        { "name": "Panjim Stand", "arrival": "1:00 PM", "departure": "---", "price": "₹60", "type": "end" }
                    ]
                }
            ],
            "navigation": [
                {
                    "id": "goa-nav-1",
                    "number": "Live",
                    "name": "Taxi Navigation",
                    "distance": "12 km",
                    "travelTime": "30 mins",
                    "totalPrice": "₹400",
                    "color": "#10b981",
                    "stopsCount": 2,
                    "timeline": [
                        { "name": "Your Hotel", "arrival": "Now", "departure": "Now", "price": "₹0", "type": "start" },
                        { "name": "Calangute Beach (Destination)", "arrival": "+30m", "departure": "---", "price": "₹400", "type": "end" }
                    ]
                }
            ]
        }
    }
};
