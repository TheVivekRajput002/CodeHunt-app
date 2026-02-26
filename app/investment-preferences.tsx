import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { PropertyType } from '@/types';

const GOALS = ['Buy', 'Rent', 'Invest'];
const CITIES = ['Bangalore', 'Mumbai', 'Hyderabad', 'Chennai', 'Pune', 'Delhi NCR', 'Gurgaon', 'Ahmedabad', 'Kolkata', 'Kochi'];
const PROPERTY_TYPES: PropertyType[] = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Studio', 'Penthouse', 'Rowhouse'];
const BUDGET_RANGES = [
    { label: 'Under ₹30L', min: 0, max: 3000000 },
    { label: '₹30L – ₹60L', min: 3000000, max: 6000000 },
    { label: '₹60L – ₹1Cr', min: 6000000, max: 10000000 },
    { label: '₹1Cr – ₹2Cr', min: 10000000, max: 20000000 },
    { label: '₹2Cr – ₹5Cr', min: 20000000, max: 50000000 },
    { label: 'Above ₹5Cr', min: 50000000, max: 999999999 },
];

function SectionTitle({ children }: { children: string }) {
    return <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 12, marginTop: 6 }}>{children}</Text>;
}

function Chip({ label, selected, color = '#003b6f', onPress }: { label: string; selected: boolean; color?: string; onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 20,
                backgroundColor: selected ? color : '#f9fafb',
                borderWidth: 1.5,
                borderColor: selected ? color : '#e5e7eb',
                marginRight: 8,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
            }}
        >
            {selected && <Ionicons name="checkmark" size={12} color="#fff" />}
            <Text style={{ fontSize: 13, fontWeight: '600', color: selected ? '#fff' : '#374151' }}>{label}</Text>
        </TouchableOpacity>
    );
}

export default function InvestmentPreferencesScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [goal, setGoal] = useState<string | null>(null);
    const [budget, setBudget] = useState<string | null>(null);
    const [cities, setCities] = useState<string[]>([]);
    const [types, setTypes] = useState<PropertyType[]>([]);
    const [saving, setSaving] = useState(false);

    const toggleCity = (c: string) => setCities((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
    const toggleType = (t: PropertyType) => setTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
    const selectedBudget = BUDGET_RANGES.find((b) => b.label === budget);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: session?.user?.id,
                    goal: goal as any,
                    budget_min: selectedBudget?.min ?? null,
                    budget_max: selectedBudget?.max ?? null,
                    cities,
                    property_types: types,
                    updated_at: new Date().toISOString(),
                });
            if (error) throw error;
            Alert.alert('Preferences Saved!', 'Your investment preferences have been updated.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (e: any) {
            Alert.alert('Error', e.message ?? 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14, gap: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={20} color="#111827" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Investment Preferences</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>Personalize your property feed</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

                {/* Goal */}
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
                    <SectionTitle>Investment Goal</SectionTitle>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {GOALS.map((g) => (
                            <Chip key={g} label={g} selected={goal === g} onPress={() => setGoal(g)} />
                        ))}
                    </View>
                </View>

                {/* Budget */}
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
                    <SectionTitle>Budget Range</SectionTitle>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {BUDGET_RANGES.map((b) => (
                            <Chip key={b.label} label={b.label} selected={budget === b.label} onPress={() => setBudget(b.label)} />
                        ))}
                    </View>
                </View>

                {/* Cities */}
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
                    <SectionTitle>Preferred Cities</SectionTitle>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {CITIES.map((c) => (
                            <Chip key={c} label={c} selected={cities.includes(c)} onPress={() => toggleCity(c)} color="#7c3aed" />
                        ))}
                    </View>
                </View>

                {/* Property Types */}
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
                    <SectionTitle>Property Types</SectionTitle>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {PROPERTY_TYPES.map((t) => (
                            <Chip key={t} label={t} selected={types.includes(t)} onPress={() => toggleType(t)} color="#059669" />
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    style={{ backgroundColor: '#003b6f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: saving ? 0.7 : 1 }}
                >
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{saving ? 'Saving…' : 'Save Preferences'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
