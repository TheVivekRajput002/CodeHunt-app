import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

// ─── Format Helpers ─────────────────────────────────────────────────────────
const formatPrice = (price: number) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
};

const STATUS_COLORS: Record<string, string> = {
    Buy: '#003b6f',
    Rent: '#7c3aed',
    'New Launch': '#d97706',
    Commercial: '#059669',
};

const TYPE_ICONS: Record<string, string> = {
    Apartment: 'business',
    Villa: 'home',
    Plot: 'grid',
    Commercial: 'storefront',
    Penthouse: 'star',
    Studio: 'cube',
    Rowhouse: 'home',
};

function PropertyRow({ item, onPress }: { item: any; onPress: () => void }) {
    const statusColor = STATUS_COLORS[item.status] ?? '#003b6f';
    const icon = TYPE_ICONS[item.property_type] ?? 'business';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.75}
            style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                marginBottom: 12,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
            }}
        >
            {/* Thumbnail */}
            <View
                style={{
                    width: 78,
                    height: 78,
                    borderRadius: 12,
                    backgroundColor: '#dbeafe',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Ionicons name={icon as any} size={32} color="#2563eb" />
            </View>

            <View style={{ flex: 1 }}>
                {/* Badges */}
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
                    <View style={{ backgroundColor: statusColor + '18', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor }}>{item.status.toUpperCase()}</Text>
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
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 5 }} numberOfLines={1}>
                    <Ionicons name="location-outline" size={11} color="#9ca3af" /> {item.location}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#003b6f' }}>{item.price_label}</Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>{item.bhk_config} • {item.area_sqft?.toLocaleString()} sqft</Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
        </TouchableOpacity>
    );
}

export default function PropertiesListScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching properties', error);
                return;
            }
            if (data) {
                const mapped = data.map((p) => ({
                    id: p.id,
                    title: p.title || 'Unknown Property',
                    location: p.address || p.city || 'Unknown Location',
                    price_label: formatPrice(Number(p.asking_price)),
                    status: p.status === 'publish' ? 'Buy' : 'Buy', // Adjust as needed
                    property_type: p.property_type || 'Apartment',
                    bhk_config: p.bedrooms ? `${p.bedrooms} BHK` : 'N/A',
                    is_rera_certified: true, // Defaulting to true for visual representation
                    area_sqft: p.area_sqft || 0,
                }));
                setProperties(mapped);
            }
        } catch (error) {
            console.error('Error mapping properties', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = properties.filter(
        (p) =>
            !query ||
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.location.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* Header */}
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#003b6f' }}>Properties</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{filtered.length} listings available</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/properties/create')}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: '#003b6f',
                        borderRadius: 12,
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                    }}
                >
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>List Property</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 11,
                        borderWidth: 1.5,
                        borderColor: '#e5e7eb',
                        gap: 8,
                    }}
                >
                    <Ionicons name="search" size={16} color="#9ca3af" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search properties…"
                        placeholderTextColor="#9ca3af"
                        style={{ flex: 1, fontSize: 14, color: '#111827' }}
                    />
                </View>
            </View>

            {/* List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                renderItem={({ item }) => (
                    <PropertyRow
                        item={item}
                        onPress={() => router.push(`/(tabs)/properties/${item.id}` as any)}
                    />
                )}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center', paddingTop: 60 }}>
                        <Ionicons name="home-outline" size={56} color="#d1d5db" />
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 12 }}>
                            No properties found
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
