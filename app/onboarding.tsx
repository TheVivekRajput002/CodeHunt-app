import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PropertyType } from '@/types';

// ─── Config ───────────────────────────────────────────────────────────────────
const GOALS = [
    { id: 'Buy', label: 'Buy a Home', icon: 'home', desc: 'Find your dream home to own' },
    { id: 'Rent', label: 'Rent a Property', icon: 'key', desc: 'Flexible living with premium options' },
    { id: 'Invest', label: 'Investment', icon: 'trending-up', desc: 'Grow wealth through real estate' },
];

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

const TOTAL_STEPS = 4;

function ProgressBar({ step }: { step: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 24, marginBottom: 28 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <View
                    key={i}
                    style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: i < step ? '#003b6f' : '#e5e7eb',
                    }}
                />
            ))}
        </View>
    );
}

// ─── Step 1: Goal ─────────────────────────────────────────────────────────────
function StepGoal({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 }}>What's your goal?</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Tell us what you're looking for so we can personalize your experience.</Text>
            {GOALS.map((g) => (
                <TouchableOpacity
                    key={g.id}
                    onPress={() => onChange(g.id)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                        backgroundColor: value === g.id ? '#003b6f' : '#fff',
                        borderRadius: 16,
                        padding: 18,
                        marginBottom: 12,
                        borderWidth: 2,
                        borderColor: value === g.id ? '#003b6f' : '#e5e7eb',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                >
                    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: value === g.id ? 'rgba(255,255,255,0.15)' : '#f0f7ff', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={g.icon as any} size={22} color={value === g.id ? '#fff' : '#003b6f'} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: value === g.id ? '#fff' : '#111827' }}>{g.label}</Text>
                        <Text style={{ fontSize: 12, color: value === g.id ? 'rgba(255,255,255,0.75)' : '#6b7280', marginTop: 2 }}>{g.desc}</Text>
                    </View>
                    {value === g.id && <Ionicons name="checkmark-circle" size={22} color="#fff" />}
                </TouchableOpacity>
            ))}
        </View>
    );
}

// ─── Step 2: Budget ───────────────────────────────────────────────────────────
function StepBudget({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 }}>What's your budget?</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>This helps us show you the most relevant properties.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {BUDGET_RANGES.map((b) => (
                    <TouchableOpacity
                        key={b.label}
                        onPress={() => onChange(b.label)}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderRadius: 12,
                            backgroundColor: value === b.label ? '#003b6f' : '#fff',
                            borderWidth: 2,
                            borderColor: value === b.label ? '#003b6f' : '#e5e7eb',
                            minWidth: '45%',
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: '700', color: value === b.label ? '#fff' : '#374151' }}>{b.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

// ─── Step 3: Cities ───────────────────────────────────────────────────────────
function StepCities({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
    const toggle = (city: string) =>
        onChange(value.includes(city) ? value.filter((c) => c !== city) : [...value, city]);

    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 }}>Preferred cities</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Pick one or more cities you're interested in. You can update this any time.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {CITIES.map((city) => {
                    const selected = value.includes(city);
                    return (
                        <TouchableOpacity
                            key={city}
                            onPress={() => toggle(city)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                backgroundColor: selected ? '#003b6f' : '#fff',
                                borderWidth: 1.5,
                                borderColor: selected ? '#003b6f' : '#e5e7eb',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            {selected && <Ionicons name="checkmark" size={13} color="#fff" />}
                            <Text style={{ fontSize: 13, fontWeight: '600', color: selected ? '#fff' : '#374151' }}>{city}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// ─── Step 4: Property Types ───────────────────────────────────────────────────
function StepPropertyTypes({ value, onChange }: { value: PropertyType[]; onChange: (v: PropertyType[]) => void }) {
    const toggle = (t: PropertyType) =>
        onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);

    const TYPE_ICONS: Record<string, string> = {
        Apartment: 'business', Villa: 'home', Plot: 'grid', Commercial: 'storefront',
        Studio: 'cube', Penthouse: 'star', Rowhouse: 'home',
    };

    return (
        <View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 }}>Property types</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>Which types of properties interest you? Select all that apply.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {PROPERTY_TYPES.map((t) => {
                    const selected = value.includes(t);
                    return (
                        <TouchableOpacity
                            key={t}
                            onPress={() => toggle(t)}
                            style={{
                                width: '47%',
                                backgroundColor: selected ? '#003b6f' : '#fff',
                                borderRadius: 14,
                                padding: 14,
                                borderWidth: 2,
                                borderColor: selected ? '#003b6f' : '#e5e7eb',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <Ionicons name={TYPE_ICONS[t] as any} size={22} color={selected ? '#fff' : '#003b6f'} />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: selected ? '#fff' : '#374151' }}>{t}</Text>
                            {selected && (
                                <View style={{ position: 'absolute', top: 8, right: 8 }}>
                                    <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.8)" />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [goal, setGoal] = useState<string | null>(null);
    const [budget, setBudget] = useState<string | null>(null);
    const [cities, setCities] = useState<string[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [saving, setSaving] = useState(false);

    const canNext = () => {
        if (step === 1) return !!goal;
        if (step === 2) return !!budget;
        if (step === 3) return cities.length > 0;
        if (step === 4) return propertyTypes.length > 0;
        return true;
    };

    const handleNext = async () => {
        if (step < TOTAL_STEPS) {
            setStep((s) => s + 1);
        } else {
            setSaving(true);
            // TODO: save to Supabase user_preferences
            setTimeout(() => {
                setSaving(false);
                router.replace('/(tabs)');
            }, 1200);
        }
    };

    const handleSkip = () => {
        if (step < TOTAL_STEPS) setStep((s) => s + 1);
        else router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" />

            {/* Top row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#003b6f', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>CH</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#003b6f' }}>CodeHunt</Text>
                </View>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#9ca3af' }}>Skip →</Text>
                </TouchableOpacity>
            </View>

            {/* Progress bar */}
            <ProgressBar step={step} />

            {/* Step label */}
            <View style={{ paddingHorizontal: 24, marginBottom: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#003b6f', letterSpacing: 1 }}>
                    STEP {step} OF {TOTAL_STEPS}
                </Text>
            </View>

            {/* Content */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
                {step === 1 && <StepGoal value={goal} onChange={setGoal} />}
                {step === 2 && <StepBudget value={budget} onChange={setBudget} />}
                {step === 3 && <StepCities value={cities} onChange={setCities} />}
                {step === 4 && <StepPropertyTypes value={propertyTypes} onChange={setPropertyTypes} />}
            </ScrollView>

            {/* CTA */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}>
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!canNext() || saving}
                    style={{
                        backgroundColor: canNext() ? '#003b6f' : '#e5e7eb',
                        borderRadius: 16,
                        paddingVertical: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '800', color: canNext() ? '#fff' : '#9ca3af' }}>
                        {saving ? 'Saving…' : step === TOTAL_STEPS ? '🎉  Finish Setup' : 'Continue'}
                    </Text>
                </TouchableOpacity>
                {step > 1 && (
                    <TouchableOpacity onPress={() => setStep((s) => s - 1)} style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>← Go back</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}
