
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DestinationData, VisaType } from "../types";

// Safe initialization of AI Client
const getAIClient = () => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
    } catch (e) {
        console.warn("GoogleGenAI Environment Check Failed");
    }
    return null;
};

const ai = getAIClient();

const destinationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    tagline: { type: Type.STRING },
    coordinates: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER }
      },
      required: ["lat", "lng"]
    },
    economics: {
      type: Type.OBJECT,
      properties: {
        localCurrency: { type: Type.STRING },
        homeCurrency: { type: Type.STRING },
        exchangeRate: { type: Type.NUMBER, description: "How much 1 unit of Home Currency buys in Local Currency" },
        inverseRate: { type: Type.NUMBER, description: "How much 1 unit of Local Currency costs in Home Currency" },
        budgetComparison: { type: Type.STRING, enum: ["Cheaper", "Similar", "Expensive"] },
        dailyCostLocal: { type: Type.NUMBER },
        dailyCostHome: { type: Type.NUMBER }
      },
      required: ["localCurrency", "homeCurrency", "exchangeRate", "inverseRate", "budgetComparison", "dailyCostLocal", "dailyCostHome"]
    },
    timeInfo: {
      type: Type.OBJECT,
      properties: {
        timeZoneName: { type: Type.STRING },
        gmtOffset: { type: Type.NUMBER, description: "GMT offset number (e.g. 9 or -5)" },
        timeDifference: { type: Type.STRING, description: "Text description relative to user home (e.g. '+3 hours')" },
        bestTimeToVisit: { type: Type.STRING }
      },
      required: ["timeZoneName", "gmtOffset", "timeDifference", "bestTimeToVisit"]
    },
    weatherInfo: {
      type: Type.OBJECT,
      properties: {
        season: { type: Type.STRING },
        temperature: { type: Type.STRING },
        advisory: { type: Type.STRING }
      },
      required: ["season", "temperature", "advisory"]
    },
    cultureTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    localTransport: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING },
            routeInfo: { type: Type.STRING },
            costLocal: { type: Type.NUMBER },
            costHome: { type: Type.NUMBER }
        },
        required: ["type", "routeInfo", "costLocal", "costHome"]
      }
    },
    visa: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: [VisaType.VISA_FREE, VisaType.VOA, VisaType.E_VISA, VisaType.EMBASSY] },
        cost: { type: Type.STRING },
        processingTime: { type: Type.STRING },
        documents: { type: Type.ARRAY, items: { type: Type.STRING } },
        warning: { type: Type.STRING },
        difficultyLevel: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard"] },
        allowedStay: { type: Type.STRING, description: "e.g. 90 Days" }
      },
      required: ["type", "cost", "processingTime", "documents", "warning", "difficultyLevel", "allowedStay"]
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["sightseeing", "food", "transport", "relax"] },
              },
              required: ["id", "time", "title", "description", "location", "type"]
            }
          }
        },
        required: ["day", "activities"]
      }
    }
  },
  required: ["name", "tagline", "coordinates", "economics", "timeInfo", "weatherInfo", "cultureTips", "visa", "itinerary", "localTransport"],
};

// --- Mock Data Generator for Offline Mode ---
const generateMockData = (destination: string, homeCurrency: string, days: number = 3): DestinationData => {
  // Simple deterministic hash for "random" but consistent data
  const seed = destination.length + destination.charCodeAt(0);
  
  return {
    name: destination,
    tagline: "The Adventure Awaits",
    coordinates: { lat: 20 + (seed % 20), lng: 70 + (seed % 30) },
    economics: {
      localCurrency: "USD", // Simplified
      homeCurrency: homeCurrency,
      exchangeRate: 1.0,
      inverseRate: 1.0,
      budgetComparison: seed % 2 === 0 ? "Cheaper" : "Expensive",
      dailyCostLocal: 100 + (seed % 50),
      dailyCostHome: 100 + (seed % 50)
    },
    timeInfo: {
      timeZoneName: "GMT",
      gmtOffset: 0,
      timeDifference: "Unknown offset",
      bestTimeToVisit: "Spring or Autumn"
    },
    weatherInfo: {
      season: "Sunny Season",
      temperature: "25°C / 77°F",
      advisory: "Pleasant weather expected."
    },
    cultureTips: [
      "Respect local customs and traditions.",
      "Tipping is appreciated but not mandatory.",
      "Public transport is the best way to get around."
    ],
    visa: {
      type: VisaType.VISA_FREE,
      cost: "Free",
      processingTime: "Instant / On Arrival",
      documents: ["Passport (6 months validity)", "Return Ticket"],
      warning: "Always verify with the official embassy.",
      difficultyLevel: "Easy",
      allowedStay: "30-90 Days"
    },
    localTransport: [
      { type: "Taxi", routeInfo: "Widely available app-based cabs", costLocal: 20, costHome: 20 },
      { type: "Metro", routeInfo: "City center connectivity", costLocal: 2, costHome: 2 }
    ],
    itinerary: Array.from({ length: days }).map((_, i) => ({
      day: i + 1,
      activities: [
        {
          id: `mock-d${i}-a1`,
          time: "09:00",
          title: `Explore ${destination} Landmarks`,
          description: "Visit the most iconic spots in the city center.",
          location: "City Center",
          type: "sightseeing"
        },
        {
          id: `mock-d${i}-a2`,
          time: "13:00",
          title: "Local Lunch Experience",
          description: "Taste the authentic flavors of the region.",
          location: "Old Town Market",
          type: "food"
        },
        {
          id: `mock-d${i}-a3`,
          time: "16:00",
          title: "Sunset Views",
          description: "Relax and enjoy the panoramic views.",
          location: "Scenic Point",
          type: "relax"
        }
      ]
    })),
    lastUpdated: Date.now()
  };
};

export const fetchDestinationIntelligence = async (
  destination: string, 
  userHomeCountry: string = 'India', 
  userCurrency: string = 'INR', 
  passportCountry: string = 'India',
  days: number = 3
): Promise<DestinationData> => {
  // If AI client is missing (no API key) or network fails, fallback to mock
  if (!ai) {
      console.warn("Gemini API Key missing. Returning Mock Data.");
      return generateMockData(destination, userCurrency, days);
  }

  try {
    const prompt = `
      Act as a Global Travel Intelligence Engine.
      User Profile:
      - Origin: ${userHomeCountry}
      - Passport: ${passportCountry}
      - Currency: ${userCurrency}
      
      Task: Provide comprehensive travel intelligence for a trip to ${destination} for ${days} days.
      
      Requirements:
      1. ECONOMICS: Detect destination currency. Calculate estimated exchange rate (1 ${userCurrency} = ? Local). Provide daily budget in BOTH currencies. Compare costs to ${userHomeCountry}.
      2. VISA: Determine specific visa rules for a ${passportCountry} passport holder entering ${destination}.
      3. TIME: Detect destination time zone and calculate offset relative to ${userHomeCountry}.
      4. TRANSPORT: List local transport options (Bus, Metro, Taxi/Grab/Uber) with specific route info (e.g. 'Line 1 to Center') and estimated cost per trip in both currencies.
      5. ITINERARY: Create a ${days}-day plan.

      Data must be strictly JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: destinationSchema,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as DestinationData;
      data.lastUpdated = Date.now();
      return data;
    }
    throw new Error("No data received from Gemini");
  } catch (error) {
    console.error("Gemini API Error / Network Failure:", error);
    // FALLBACK: Return Mock Data so the app doesn't crash
    console.log("Falling back to Offline/Mock Mode for:", destination);
    return generateMockData(destination, userCurrency, days);
  }
};
