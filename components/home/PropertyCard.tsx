import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Property } from '@/data/properties';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const isBadgeAmber = property.badge === 'NEW LAUNCH';

    return (
        <View
            style={{
                width: 290,
                backgroundColor: '#ffffff',
                borderRadius: 16,
                marginRight: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 3,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#f3f4f6',
            }}
        >
            {/* ── Card Top ── */}
            <View style={{ padding: 14, paddingBottom: 10 }}>
                {/* Badge */}
                <View
                    style={{
                        alignSelf: 'flex-start',
                        backgroundColor: isBadgeAmber ? '#fef3c7' : '#dbeafe',
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 10,
                            fontWeight: '800',
                            color: isBadgeAmber ? '#92400e' : '#1e40af',
                            letterSpacing: 0.5,
                        }}
                    >
                        {property.badge}
                    </Text>
                </View>

                {/* Property image + certifications */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
                    {/* Circular image */}
                    <View style={{ position: 'relative' }}>
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: '#f0f9ff',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: '#e0f2fe',
                            }}
                        >
                            <Text style={{ fontSize: 30 }}>{property.image}</Text>
                        </View>
                        {/* Certifications overlaid */}
                        <View
                            style={{
                                position: 'absolute',
                                bottom: -4,
                                left: '50%',
                                transform: [{ translateX: -30 }],
                                flexDirection: 'row',
                                gap: 3,
                            }}
                        >
                            {property.certifications.map((cert) => (
                                <View
                                    key={cert}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#dcfce7',
                                        borderRadius: 10,
                                        paddingHorizontal: 5,
                                        paddingVertical: 2,
                                        gap: 2,
                                        borderWidth: 1,
                                        borderColor: '#bbf7d0',
                                    }}
                                >
                                    <Ionicons name="shield-checkmark" size={8} color="#16a34a" />
                                    <Text style={{ fontSize: 8, fontWeight: '700', color: '#16a34a' }}>{cert}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Property details */}
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 2 }}
                            numberOfLines={1}
                        >
                            {property.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                            {property.location}, {property.city}
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#003b6f', marginBottom: 2 }}>
                            {property.priceRange}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#374151' }}>{property.config}</Text>
                    </View>
                </View>

                {/* Extra info row */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        marginTop: 4,
                    }}
                >
                    {property.extraInfoType === 'increase' ? (
                        <>
                            <Ionicons name="trending-up" size={13} color="#16a34a" />
                            <Text style={{ fontSize: 12, fontWeight: '600', color: '#16a34a' }}>
                                {property.extraInfo}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text style={{ fontSize: 12 }}>🕐</Text>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>{property.extraInfo}</Text>
                        </>
                    )}
                </View>
            </View>

            {/* ── Divider ── */}
            <View style={{ height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 14 }} />

            {/* ── Card Footer ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 12,
                    paddingTop: 10,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Feather name="tag" size={13} color="#003b6f" />
                    <Text style={{ fontSize: 11, color: '#374151', flex: 1 }} numberOfLines={2}>
                        Get preferred options @zero brokerage
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#003b6f',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        marginLeft: 8,
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>View Number</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
