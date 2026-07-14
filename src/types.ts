export enum TouristCategory {
  Historical = "Histórico",
  Cultural = "Cultural",
  Religious = "Religioso",
  Beach = "Praia",
  Nature = "Natureza",
  Ecotourism = "Ecoturismo",
  Rural = "Rural",
  Adventure = "Aventura",
  Gastronomic = "Gastronómico",
  Scientific = "Científico",
  Photographic = "Fotográfico",
  Family = "Familiar"
}

export interface Province {
  id: string;
  name: string;
  capital: string;
  history: string;
  location: string;
  population: string;
  climate: string;
  culture: string;
  gastronomy: string;
  mapCoord: { lat: number; lng: number };
  image: string;
  videoUrl: string;
  curiosities: string[];
  bestSeason: string;
  hotels: { name: string; stars: number; price: string }[];
  restaurants: { name: string; specialty: string; price: string }[];
  transport: string[];
  rating: number;
}

export interface TouristSpot {
  id: string;
  name: string;
  provinceId: string;
  category: TouristCategory;
  description: string;
  history: string;
  curiosities: string[];
  image: string;
  videoUrl: string;
  mapCoord: { lat: number; lng: number };
  price: string;
  hours: string;
  bestSeason: string;
  visitDuration: string;
  difficulty: string;
  whatToBring: string[];
  oQueFazer: string[];
  nearbyHotels: string[];
  nearbyRestaurants: string[];
  rating: number;
  commentsCount: number;
}

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface Review {
  id: string;
  spotId?: string;
  provinceId?: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
  replies: { author: string; text: string; date: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  snippet: string;
  content: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  history: string;
  recipe: string[];
  image: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  duration: string;
}

export interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
  image: string;
}

export interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  visitedSpots: string[];
  favoriteSpots: string[];
  role: "admin" | "tourist";
}
