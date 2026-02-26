import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PropertyType, BHKConfig, PropertyStatus } from '@/types';

const PROPERTY_TYPES: PropertyType[] = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Studio', 'Penthouse', 'Rowhouse'];
const BHK_OPTIONS: BHKConfig[] = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'Studio', 'Plot'];
const STATUS_OPTIONS: PropertyStatus[] = ['Buy', 'Rent', 'New Launch', 'Commercial'];

function SectionLabel({ children }: { children: string }) {
    return <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6, marginTop: 14 }}>{children}</Text>;
}

function OptionChip<T extends string>({
    label, selected, onPress,
}: { label: T; selected: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                backgroundColor: selected ? '#003b6f' : '#f9fafb',
                borderWidth: 1.5, borderColor: selected ? '#003b6f' : '#e5e7eb',
                marginRight: 8, marginBottom: 8,
            }}
        >
            <Text style={{ fontSize: 13, fontWeight: '600', color: selected ? '#fff' : '#374151' }}>{label}</Text>
        </TouchableOpacity>
    );
}

export default function CreatePropertyScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        area_sqft: '',
    });
    const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
    const [bhk, setBhk] = useState<BHKConfig | null>(null);
    const [status, setStatus] = useState<PropertyStatus | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const update = (key: keyof typeof form) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

    const handleSubmit = async () => {
        if (!form.title || !form.location || !form.price || !propertyType || !status) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        setSubmitting(true);
        // TODO: save to Supabase properties table
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert('Property Listed!', 'Your property has been submitted successfully.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        }, 1500);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 10 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={20} color="#111827" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>List Your Property</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>Zero brokerage • Free listing</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
                {/* Title */}
                <SectionLabel>Property Title *</SectionLabel>
                <TextInput
                    value={form.title} onChangeText={update('title')}
                    placeholder="e.g. Spacious 3 BHK with sea view"
                    style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 14, color: '#111827', backgroundColor: '#fff' }}
                />

                {/* Description */}
                <SectionLabel>Description</SectionLabel>
                <TextInput
                    value={form.description} onChangeText={update('description')}
                    placeholder="Describe the property, highlights, nearby landmarks…"
                    multiline numberOfLines={4}
                    style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 14, color: '#111827', backgroundColor: '#fff', height: 100, textAlignVertical: 'top' }}
                />

                {/* Location */}
                <SectionLabel>Location / Address *</SectionLabel>
                <TextInput
                    value={form.location} onChangeText={update('location')}
                    placeholder="e.g. Whitefield, Bangalore"
                    style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 14, color: '#111827', backgroundColor: '#fff' }}
                />

                {/* Price & Area */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                        <SectionLabel>Price (₹) *</SectionLabel>
                        <TextInput
                            value={form.price} onChangeText={update('price')}
                            placeholder="e.g. 8500000"
                            keyboardType="numeric"
                            style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 14, color: '#111827', backgroundColor: '#fff' }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <SectionLabel>Area (sqft)</SectionLabel>
                        <TextInput
                            value={form.area_sqft} onChangeText={update('area_sqft')}
                            placeholder="e.g. 1200"
                            keyboardType="numeric"
                            style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, fontSize: 14, color: '#111827', backgroundColor: '#fff' }}
                        />
                    </View>
                </View>

                {/* Listing Type */}
                <SectionLabel>Listing Type *</SectionLabel>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {STATUS_OPTIONS.map((s) => (
                        <OptionChip key={s} label={s} selected={status === s} onPress={() => setStatus(s)} />
                    ))}
                </View>

                {/* Property Type */}
                <SectionLabel>Property Type *</SectionLabel>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {PROPERTY_TYPES.map((t) => (
                        <OptionChip key={t} label={t} selected={propertyType === t} onPress={() => setPropertyType(t)} />
                    ))}
                </View>

                {/* BHK Config */}
                <SectionLabel>BHK Configuration</SectionLabel>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {BHK_OPTIONS.map((b) => (
                        <OptionChip key={b} label={b} selected={bhk === b} onPress={() => setBhk(b)} />
                    ))}
                </View>

                {/* Image Placeholder */}
                <SectionLabel>Property Images</SectionLabel>
                <TouchableOpacity
                    style={{ borderWidth: 2, borderColor: '#e5e7eb', borderStyle: 'dashed', borderRadius: 14, padding: 30, alignItems: 'center', backgroundColor: '#fff', marginBottom: 4 }}
                >
                    <Ionicons name="camera-outline" size={32} color="#9ca3af" />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#9ca3af', marginTop: 8 }}>Add Photos</Text>
                    <Text style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>(Image picker — coming soon)</Text>
                </TouchableOpacity>

                {/* Submit */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={{ backgroundColor: '#003b6f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 20, opacity: submitting ? 0.7 : 1 }}
                >
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
                        {submitting ? 'Submitting…' : '🏠  Submit Listing'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
