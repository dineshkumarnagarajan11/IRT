
export enum VisaType {
  VISA_FREE = 'Visa Free',
  VOA = 'Visa On Arrival',
  E_VISA = 'E-Visa',
  EMBASSY = 'Embassy Visa Required'
}

export interface VisaInfo {
  type: VisaType;
  cost: string;
  processingTime: string;
  documents: string[];
  warning: string;
  difficultyLevel: 'Easy' | 'Moderate' | 'Hard';
  allowedStay: string; // e.g. "90 Days"
}

export interface TransportOption {
  type: string;
  routeInfo: string;
  costLocal: number; // Cost in destination currency
  costHome: number; // Cost in user's home currency
}

export interface Expense {
  id: string;
  category: 'Food' | 'Transport' | 'Stay' | 'Activity' | 'Other';
  amount: number;
  currency: string;
  note?: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'sightseeing' | 'food' | 'transport' | 'relax';
}

export interface DayPlan {
  day: number;
  date?: string;
  activities: Activity[];
}

export interface Economics {
  localCurrency: string;
  homeCurrency: string;
  exchangeRate: number; // 1 HomeCurrency = X LocalCurrency
  inverseRate: number; // 1 LocalCurrency = X HomeCurrency
  budgetComparison: 'Cheaper' | 'Similar' | 'Expensive'; // Compared to home
  dailyCostLocal: number;
  dailyCostHome: number;
}

export interface TimeInfo {
  timeZoneName: string; // e.g. "JST"
  gmtOffset: number; // e.g. 9
  timeDifference: string; // e.g. "+13 hours"
  bestTimeToVisit: string;
}

export interface WeatherInfo {
  season: string; // e.g. "Rainy Season" or "Spring"
  temperature: string; // e.g. "25°C / 77°F"
  advisory: string; // e.g. "High humidity, carry water"
}

export interface DestinationData {
  name: string;
  tagline: string;
  coordinates: { lat: number; lng: number };
  economics: Economics;
  timeInfo: TimeInfo;
  weatherInfo: WeatherInfo;
  cultureTips: string[];
  visa: VisaInfo;
  itinerary: DayPlan[];
  localTransport: TransportOption[];
  lastUpdated: number; // Timestamp
}

export interface UserTrip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  expenses: Expense[];
  data: DestinationData; // Cached data
}

export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  image: string;
  location: string;
  caption: string;
  likes: number;
  timeAgo: string;
}

export type UserPlan = 'Free' | 'Plus' | 'Premium';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  homeCountry: string;
  passportCountry: string;
  currency: string;
}
