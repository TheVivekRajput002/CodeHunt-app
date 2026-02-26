import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PropertyStatus, PropertyType } from '@/types';
import { supabase } from '@/lib/supabase';

// ─── Filter config ────────────────────────────────────────────────────────────
const STATUS_FILTERS: PropertyStatus[] = ['Buy', 'Rent', 'New Launch', 'Commercial'];
const PROPERTY_TYPES: PropertyType[] = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Studio', 'Penthouse', 'Rowhouse'];

// ─── Mock search results (replaced with Supabase later) ──────────────────────
const MOCK_RESULTS = [
    { id: '1', title: 'Prestige Lakeside Habitat', location: 'Whitefield, Bangalore', price_label: '₹85 L', status: 'Buy', property_type: 'Apartment', bhk_config: '3 BHK', is_rera_certified: true },
    { id: '2', title: 'Brigade Cornerstone Utopia', location: 'Yelahanka, Bangalore', price_label: '₹1.2 Cr', status: 'New Launch', property_type: 'Apartment', bhk_config: '2 BHK', is_rera_certified: true },
    { id: '3', title: 'Godrej Nurture', location: 'Sarjapur Road, Bangalore', price_label: '₹72 L', status: 'Buy', property_type: 'Apartment', bhk_config: '2 BHK', is_rera_certified: false },
    { id: '4', title: 'Sobha Clovelly', location: 'Hebbal, Bangalore', price_label: '₹2.1 Cr', status: 'Buy', property_type: 'Villa', bhk_config: '4 BHK', is_rera_certified: true },
    { id: '5', title: 'Purva Zenium', location: 'Aerospace Park, Bangalore', price_label: '₹55 L', status: 'New Launch', property_type: 'Apartment', bhk_config: '1 BHK', is_rera_certified: true },
    { id: '6', title: 'DLF The Crest', location: 'Sector 54, Gurgaon', price_label: '₹3.8 Cr', status: 'Buy', property_type: 'Penthouse', bhk_config: '4 BHK', is_rera_certified: true },
];

// ─── Subcomponents ───────────────────────────────────────────────────────────

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: active ? '#003b6f' : '#fff',
                borderWidth: 1.5,
                borderColor: active ? '#003b6f' : '#e5e7eb',
                marginRight: 8,
            }}
        >
            <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : '#374151' }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function ResultCard({ item, onPress }: { item: typeof MOCK_RESULTS[0]; onPress: () => void }) {
    const statusColor: Record<string, string> = {
        'Buy': '#003b6f',
        'Rent': '#7c3aed',
        'New Launch': '#d97706',
        'Commercial': '#059669',
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                marginBottom: 12,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
            }}
        >
            {/* Placeholder image */}
            <View
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    backgroundColor: '#e0e7ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Ionicons name="business" size={30} color="#6366f1" />
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <View
                        style={{
                            backgroundColor: statusColor[item.status] + '20',
                            borderRadius: 6,
                            paddingHorizontal: 7,
                            paddingVertical: 2,
                        }}
                    >
                        <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor[item.status] }}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                    {item.is_rera_certified && (
                        <View style={{ backgroundColor: '#f0fdf4', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: '#16a34a' }}>RERA</Text>
                        </View>
                    )}
                </View>

                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 }} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }} numberOfLines={1}>
                    <Ionicons name="location-outline" size={11} color="#9ca3af" /> {item.location}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#003b6f' }}>{item.price_label}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>{item.bhk_config}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SearchScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [activeStatus, setActiveStatus] = useState<PropertyStatus | null>(null);
    const [properties, setProperties] = useState<typeof MOCK_RESULTS>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const { data, error } = await supabase.from('properties').select('*');
            if (error) {
                console.error('Error fetching search properties:', error);
                setProperties(MOCK_RESULTS);
                return;
            }

            if (data && data.length > 0) {
                const mapped = data.map((p) => {
                    let price_label = 'Price on Request';
                    if (p.asking_price) {
                        const price = Number(p.asking_price);
                        if (price >= 10000000) {
                            price_label = `₹${(price / 10000000).toFixed(2)} Cr`;
                        } else if (price >= 100000) {
                            price_label = `₹${(price / 100000).toFixed(2)} L`;
                        } else {
                            price_label = `₹${price.toLocaleString()}`;
                        }
                    }

                    return {
                        id: p.id,
                        title: p.title || 'Unknown Project',
                        location: p.address || p.city || 'Location not specified',
                        price_label,
                        status: 'Buy', // Replace with real status mapping if available
                        property_type: p.property_type || 'Apartment',
                        bhk_config: p.bedrooms ? `${p.bedrooms} BHK` : 'Config N/A',
                        is_rera_certified: true, // Assuming default true for now
                    };
                });
                setProperties(mapped);
            } else {
                setProperties(MOCK_RESULTS);
            }
        } catch (error) {
            console.error('Exception fetching from Supabase for search:', error);
            setProperties(MOCK_RESULTS);
        } finally {
            setLoading(false);
        }
    };

    const filtered = properties.filter((p) => {
        const matchesQuery =
            !query ||
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.location.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = !activeStatus || p.status === activeStatus;
        return matchesQuery && matchesStatus;
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* ── Header ── */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#003b6f', marginBottom: 14 }}>
                    Find Properties 🔍
                </Text>

                {/* Search Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 14,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        borderWidth: 1.5,
                        borderColor: '#e5e7eb',
                        gap: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 2,
                    }}
                >
                    <Ionicons name="search" size={18} color="#9ca3af" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search by city, locality, project…"
                        placeholderTextColor="#9ca3af"
                        style={{ flex: 1, fontSize: 14, color: '#111827' }}
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* ── Status Filter Chips ── */}
            <View>
                <FlatList
                    horizontal
                    data={STATUS_FILTERS}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
                    renderItem={({ item }) => (
                        <FilterChip
                            label={item}
                            active={activeStatus === item}
                            onPress={() => setActiveStatus(activeStatus === item ? null : item)}
                        />
                    )}
                />
            </View>

            {/* ── Results ── */}
            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#003b6f" />
                </View>
            ) : filtered.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
                    <Ionicons name="home-outline" size={56} color="#d1d5db" />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 16 }}>
                        No properties found
                    </Text>
                    <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 6, textAlign: 'center' }}>
                        Try adjusting your search or filters
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                    renderItem={({ item }) => (
                        <ResultCard
                            item={item}
                            onPress={() => router.push(`/(tabs)/properties?id=${item.id}` as any)}
                        />
                    )}
                    ListHeaderComponent={
                        <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                            {filtered.length} propert{filtered.length === 1 ? 'y' : 'ies'} found
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}
