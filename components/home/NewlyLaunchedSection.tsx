import React, { useRef, useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { newlyLaunchedProperties, Property } from '@/data/properties';
import PropertyCard from './PropertyCard';
import { supabase } from '@/lib/supabase';

const CARD_WIDTH = 290;
const CARD_GAP = 14;

export default function NewlyLaunchedSection() {
    const flatListRef = useRef<FlatList<any>>(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error('Error fetching properties from Supabase:', error);
                // Fallback to dummy data if fetch fails
                setProperties(newlyLaunchedProperties);
                return;
            }

            if (data && data.length > 0) {
                const mappedProperties: Property[] = data.map((dbProp) => {
                    // Format price to Cr or L
                    let priceDisplay = 'Price on Request';
                    if (dbProp.asking_price) {
                        const price = Number(dbProp.asking_price);
                        if (price >= 10000000) {
                            priceDisplay = `₹${(price / 10000000).toFixed(2)} Cr`;
                        } else if (price >= 100000) {
                            priceDisplay = `₹${(price / 100000).toFixed(2)} L`;
                        } else {
                            priceDisplay = `₹${price.toLocaleString()}`;
                        }
                    }

                    return {
                        id: dbProp.id,
                        name: dbProp.title || 'Unknown Property',
                        location: dbProp.address || 'Location not specified',
                        city: dbProp.city || 'Unknown City',
                        priceRange: priceDisplay,
                        config: dbProp.bedrooms && dbProp.property_type ? `${dbProp.bedrooms} BHK ${dbProp.property_type}` : (dbProp.property_type || 'Apartments'),
                        badge: 'NEW LAUNCH',
                        certifications: ['RERA'],
                        extraInfo: dbProp.status === 'under_construction' ? 'Under Construction' : 'Ready to Move',
                        extraInfoType: 'completion',
                        image: '🏢',
                    };
                });
                setProperties(mappedProperties);
            } else {
                setProperties(newlyLaunchedProperties); // Fallback to dummy data if empty
            }
        } catch (error) {
            console.error('Exception fetching properties:', error);
            setProperties(newlyLaunchedProperties);
        } finally {
            setLoading(false);
        }
    };

    const total = properties.length;

    return (
        <View style={{ marginTop: 24, paddingBottom: 8 }}>
            {/* ── Section Header ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    marginBottom: 16,
                    gap: 12,
                }}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: '#eff6ff',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 20 }}>🏢</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827' }}>
                        Newly launched projects
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>
                        Preferred units at zero brokerage
                    </Text>
                </View>
            </View>

            {/* ── Horizontal Card List ── */}
            <FlatList
                ref={flatListRef}
                data={properties}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
                renderItem={({ item }) => <PropertyCard property={item} />}
                onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(
                        e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP)
                    );
                    setScrollIndex(Math.max(0, Math.min(newIndex, total - 1)));
                }}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH + CARD_GAP,
                    offset: (CARD_WIDTH + CARD_GAP) * index,
                    index,
                })}
                snapToInterval={CARD_WIDTH + CARD_GAP}
                decelerationRate="fast"
            />

            {/* ── Dot Indicators ── */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                {properties.map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: i === scrollIndex ? 20 : 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: i === scrollIndex ? '#003b6f' : '#d1d5db',
                        }}
                    />
                ))}
            </View>
        </View>
    );
}
