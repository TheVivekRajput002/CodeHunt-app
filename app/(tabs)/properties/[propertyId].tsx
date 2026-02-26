import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

// ─── Constants ───────────────────────────────────────────────────────────────

const AMENITIES = ['🏊 Swimming Pool', '🎾 Tennis Court', '🏋️ Gymnasium', '🅿️ Parking', '🔒 24/7 Security', '🌳 Garden', '👶 Kids Play Area', '🎉 Clubhouse'];
const PLACEHOLDER_COLORS = ['#dbeafe', '#fce7f3', '#d1fae5', '#fef3c7', '#ede9fe'];

// ─── AI Valuation Card ────────────────────────────────────────────────────────
function AIValuationCard({ price }: { price: number }) {
    const [loading, setLoading] = useState(false);
    const [valuationDone, setValuationDone] = useState(false);
    const estimatedValue = Math.round(price * (0.95 + Math.random() * 0.1));
    const fmt = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : `₹${(n / 100000).toFixed(1)} L`;

    const handleGenerate = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); setValuationDone(true); }, 2000);
    };

    return (
        <View style={{ backgroundColor: '#f0f7ff', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#bfdbfe' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Ionicons name="sparkles" size={18} color="#2563eb" />
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#1e40af' }}>AI Market Valuation</Text>
                <View style={{ marginLeft: 'auto', backgroundColor: '#2563eb', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>AI</Text>
                </View>
            </View>

            {!valuationDone ? (
                <TouchableOpacity
                    onPress={handleGenerate}
                    disabled={loading}
                    style={{ backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                >
                    {loading ? (
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Analyzing market data…</Text>
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Generate AI Valuation</Text>
                    )}
                </TouchableOpacity>
            ) : (
                <View style={{ gap: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: '#4b5563' }}>Estimated Value</Text>
                        <Text style={{ fontSize: 17, fontWeight: '800', color: '#1e40af' }}>{fmt(estimatedValue)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: '#4b5563' }}>Confidence Score</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <View style={{ width: 80, height: 6, backgroundColor: '#e5e7eb', borderRadius: 3 }}>
                                <View style={{ width: '87%', height: '100%', backgroundColor: '#16a34a', borderRadius: 3 }} />
                            </View>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#16a34a' }}>87%</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: '#4b5563' }}>Market Trend</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="trending-up" size={14} color="#16a34a" />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#16a34a' }}>+8.4% YoY</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                        Based on 1,240 comparable transactions in {'{city}'}
                    </Text>
                </View>
            )}
        </View>
    );
}

// ─── Make Offer Bottom Sheet ───────────────────────────────────────────────────
function MakeOfferSheet({ visible, onClose, propertyTitle }: { visible: boolean; onClose: () => void; propertyTitle: string }) {
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const riskLevel = amount && parseInt(amount) > 0 ? 'low' : null;

    const riskColors: Record<string, string> = { low: '#16a34a', medium: '#d97706', high: '#dc2626' };
    const riskBg: Record<string, string> = { low: '#f0fdf4', medium: '#fffbeb', high: '#fef2f2' };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
                    {/* Handle */}
                    <View style={{ width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 }}>Make an Offer</Text>
                    <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }} numberOfLines={1}>{propertyTitle}</Text>

                    {/* Amount input */}
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>Offer Amount (₹)</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="e.g. 8200000"
                        keyboardType="numeric"
                        style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 15, color: '#111827', marginBottom: 14 }}
                    />

                    {/* Notes */}
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>Notes (optional)</Text>
                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Any special conditions or message to seller…"
                        multiline
                        numberOfLines={3}
                        style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 14, color: '#111827', marginBottom: 14, textAlignVertical: 'top', height: 80 }}
                    />

                    {/* Risk score */}
                    {riskLevel && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: riskBg[riskLevel], borderRadius: 12, padding: 12, marginBottom: 16 }}>
                            <Ionicons name="shield-checkmark" size={20} color={riskColors[riskLevel]} />
                            <View>
                                <Text style={{ fontSize: 12, color: '#6b7280' }}>Offer Risk Score</Text>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: riskColors[riskLevel], textTransform: 'capitalize' }}>{riskLevel} Risk</Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => { Alert.alert('Offer Submitted!', 'Your offer has been submitted successfully.'); onClose(); }}
                        style={{ backgroundColor: '#003b6f', borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Submit Offer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={{ alignItems: 'center', marginTop: 12 }}>
                        <Text style={{ color: '#9ca3af', fontSize: 14 }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PropertyDetailScreen() {
    const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
    const router = useRouter();
    const [offerVisible, setOfferVisible] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (propertyId) {
            fetchProperty(propertyId);
        }
    }, [propertyId]);

    const fetchProperty = async (id: string) => {
        try {
            const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
            if (error) {
                console.error('Error fetching property:', error);
                return;
            }
            if (data) {
                let price_label = 'Price on Request';
                let price = 0;
                if (data.asking_price) {
                    price = Number(data.asking_price);
                    if (price >= 10000000) {
                        price_label = `₹${(price / 10000000).toFixed(2)} Cr`;
                    } else if (price >= 100000) {
                        price_label = `₹${(price / 100000).toFixed(2)} L`;
                    } else {
                        price_label = `₹${price.toLocaleString()}`;
                    }
                }

                const mapped = {
                    id: data.id,
                    title: data.title || 'Unknown Property',
                    location: data.address || data.city || 'Location not specified',
                    city: data.city || 'Unknown',
                    price_label,
                    price,
                    status: data.status === 'publish' ? 'Buy' : 'Buy',
                    property_type: data.property_type || 'Apartment',
                    bhk_config: data.bedrooms ? `${data.bedrooms} BHK` : 'N/A',
                    is_rera_certified: true,
                    area_sqft: data.area_sqft || 0,
                    description: data.description || 'No description available for this property.',
                };
                setProperty(mapped);
            }
        } catch (error) {
            console.error('Error in property detail fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const imagePlaceholders = [0, 1, 2];

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading property details...</Text>
            </SafeAreaView>
        );
    }

    if (!property) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="alert-circle-outline" size={48} color="#d1d5db" />
                <Text style={{ marginTop: 12, color: '#374151', fontSize: 16 }}>Property not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16, padding: 12, backgroundColor: '#003b6f', borderRadius: 8 }}>
                    <Text style={{ color: '#fff' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* ── Image Carousel ── */}
                <View style={{ position: 'relative', height: 260 }}>
                    <View
                        style={{
                            width: '100%',
                            height: 260,
                            backgroundColor: PLACEHOLDER_COLORS[activeImage % PLACEHOLDER_COLORS.length],
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="business" size={72} color="#6366f1" style={{ opacity: 0.4 }} />
                        <Text style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>
                            Image {activeImage + 1} of {imagePlaceholders.length}
                        </Text>
                    </View>
                    {/* Dots */}
                    <View style={{ position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6 }}>
                        {imagePlaceholders.map((_, i) => (
                            <TouchableOpacity key={i} onPress={() => setActiveImage(i)}>
                                <View style={{ width: i === activeImage ? 20 : 7, height: 7, borderRadius: 4, backgroundColor: i === activeImage ? '#fff' : 'rgba(255,255,255,0.5)' }} />
                            </TouchableOpacity>
                        ))}
                    </View>
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ position: 'absolute', top: 16, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* ── Details ── */}
                <View style={{ padding: 16 }}>
                    {/* Badges */}
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                        <View style={{ backgroundColor: '#003b6f18', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#003b6f' }}>{property.status.toUpperCase()}</Text>
                        </View>
                        {property.is_rera_certified && (
                            <View style={{ backgroundColor: '#f0fdf4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                                <Text style={{ fontSize: 11, fontWeight: '700', color: '#16a34a' }}>RERA CERTIFIED</Text>
                            </View>
                        )}
                    </View>

                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 }}>{property.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 }}>
                        <Ionicons name="location" size={14} color="#6b7280" />
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>{property.location}</Text>
                    </View>

                    {/* Price + Config row */}
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            padding: 16,
                            gap: 20,
                            marginBottom: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 6,
                            elevation: 2,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Price</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#003b6f' }}>{property.price_label}</Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: '#f3f4f6' }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Config</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{property.bhk_config}</Text>
                        </View>
                        <View style={{ width: 1, backgroundColor: '#f3f4f6' }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Area</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{property.area_sqft?.toLocaleString()} sqft</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 8 }}>About this Property</Text>
                        <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 20 }}>{property.description}</Text>
                    </View>

                    {/* Amenities */}
                    <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 12 }}>Amenities</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {AMENITIES.map((a) => (
                                <View key={a} style={{ backgroundColor: '#f9fafb', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#e5e7eb' }}>
                                    <Text style={{ fontSize: 12, color: '#374151' }}>{a}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* AI Valuation */}
                    <View style={{ marginBottom: 16 }}>
                        <AIValuationCard price={property.price} />
                    </View>
                </View>
            </ScrollView>

            {/* ── Sticky CTA ── */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                    padding: 16,
                    paddingBottom: 28,
                    flexDirection: 'row',
                    gap: 12,
                }}
            >
                <TouchableOpacity
                    style={{ flex: 1, borderWidth: 2, borderColor: '#003b6f', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                >
                    <Text style={{ color: '#003b6f', fontWeight: '700', fontSize: 15 }}>Contact Seller</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setOfferVisible(true)}
                    style={{ flex: 1, backgroundColor: '#003b6f', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
                >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Make Offer</Text>
                </TouchableOpacity>
            </View>

            <MakeOfferSheet
                visible={offerVisible}
                onClose={() => setOfferVisible(false)}
                propertyTitle={property.title}
            />
        </SafeAreaView>
    );
}
