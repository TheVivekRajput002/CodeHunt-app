// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    city: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserPreferences {
    id: string;
    user_id: string;
    goal: 'Buy' | 'Rent' | 'Invest' | null;
    budget_min: number | null;
    budget_max: number | null;
    cities: string[];
    property_types: PropertyType[];
    created_at: string;
    updated_at: string;
}

// ─── Property ────────────────────────────────────────────────────────────────

export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Commercial' | 'Studio' | 'Penthouse' | 'Rowhouse';
export type PropertyStatus = 'Buy' | 'Rent' | 'New Launch' | 'Commercial';
export type BHKConfig = '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '4+ BHK' | 'Studio' | 'Plot';

export interface Property {
    id: string;
    title: string;
    description: string | null;
    location: string;
    city: string;
    price: number;
    price_label: string; // e.g. "₹45 L", "₹1.2 Cr"
    status: PropertyStatus;
    property_type: PropertyType;
    bhk_config: BHKConfig | null;
    images: string[];
    seller_id: string;
    is_rera_certified: boolean;
    is_hira_certified: boolean;
    area_sqft: number | null;
    completion_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Offer {
    id: string;
    property_id: string;
    buyer_id: string;
    amount: number;
    notes: string | null;
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    risk_score: 'low' | 'medium' | 'high' | null;
    created_at: string;
}

// ─── AI Agents ───────────────────────────────────────────────────────────────

export type AgentId = 'property-valuator' | 'market-analyst' | 'risk-scorer' | 'demand-forecaster';

export interface Agent {
    id: AgentId;
    name: string;
    description: string;
    icon: string; // icon name for @expo/vector-icons
    color: string;
    badge: string;
}

export interface AIGeneration {
    id: string;
    user_id: string;
    agent_id: AgentId;
    prompt: string;
    response: string;
    created_at: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// ─── AI Valuation ─────────────────────────────────────────────────────────────

export interface AIValuation {
    property_id: string;
    estimated_value: number;
    estimated_value_label: string;
    confidence_score: number; // 0–100
    market_trend: 'up' | 'down' | 'stable';
    comparable_sales: ComparableSale[];
    generated_at: string;
}

export interface ComparableSale {
    title: string;
    price: number;
    price_label: string;
    location: string;
    distance_km: number;
}

// ─── Navigation Params ────────────────────────────────────────────────────────

export type PropertiesStackParamList = {
    PropertiesList: undefined;
    PropertyDetail: { propertyId: string };
    CreateProperty: undefined;
};

export type AgentsStackParamList = {
    AgentsList: undefined;
    AgentChat: { agentId: AgentId };
};
