import React, { useRef, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { newlyLaunchedProperties, Property } from '@/data/properties';
import PropertyCard from './PropertyCard';

const CARD_WIDTH = 290;
const CARD_GAP = 14;

export default function NewlyLaunchedSection() {
    const flatListRef = useRef<FlatList<Property>>(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const total = newlyLaunchedProperties.length;

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
                data={newlyLaunchedProperties}
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
                {newlyLaunchedProperties.map((_, i) => (
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
