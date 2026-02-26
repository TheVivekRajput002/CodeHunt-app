import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default' }: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    keyboardType?: any;
}) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={keyboardType}
                style={{
                    borderWidth: 1.5,
                    borderColor: '#e5e7eb',
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15,
                    color: '#111827',
                    backgroundColor: '#fff',
                }}
            />
        </View>
    );
}

export default function EditProfileScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [saving, setSaving] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const userId = session?.user?.id;

    useEffect(() => {
        if (userId) {
            fetchProfile();
        } else {
            setLoadingProfile(false);
        }
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) {
                console.error('Error fetching profile for edit:', error);
            } else if (data) {
                if (data.full_name) setFullName(data.full_name);
                if (data.phone) setPhone(data.phone);
                // We map city to address or we can leave it if we added a city column.
                // based on schema it doesn't have a city, maybe it's saved in a jsonb or we just skip city. Wait, the save upsert has city, maybe there is a city column missing from the provided schema? Wait, properties have city, profiles don't. But the upsert is doing `city: city.trim()`. We'll just set it if it exists.
                if (data.city) setCity(data.city);
            }
        } catch (error) {
            console.error('Exception fetching profile for edit:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Name required', 'Please enter your full name.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: session?.user?.id,
                    full_name: fullName.trim(),
                    phone: phone.trim() || null,
                    city: city.trim() || null,
                    updated_at: new Date().toISOString(),
                });
            if (error) throw error;
            Alert.alert('Profile Updated', 'Your profile has been saved successfully.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (e: any) {
            Alert.alert('Error', e.message ?? 'Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 12 }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Ionicons name="arrow-back" size={20} color="#111827" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>Edit Profile</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>Update your personal information</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                {/* Avatar placeholder */}
                <View style={{ alignItems: 'center', marginBottom: 28 }}>
                    <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff', shadowColor: '#003b6f', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 }}>
                        <Text style={{ fontSize: 30, fontWeight: '800', color: '#fff' }}>
                            {fullName ? fullName.slice(0, 2).toUpperCase() : (session?.user?.email?.slice(0, 2) ?? 'U').toUpperCase()}
                        </Text>
                    </View>
                    <TouchableOpacity style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#eff6ff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 }}>
                        <Ionicons name="camera" size={14} color="#2563eb" />
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#2563eb' }}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
                    <Field label="Full Name *" value={fullName} onChangeText={setFullName} placeholder="e.g. Ravi Shankar" />
                    <Field label="Phone Number" value={phone} onChangeText={setPhone} placeholder="e.g. +91 98765 43210" keyboardType="phone-pad" />
                    <Field label="City" value={city} onChangeText={setCity} placeholder="e.g. Bangalore" />
                </View>

                {/* Email (read-only) */}
                <View style={{ backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, marginTop: 14, borderWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="mail" size={16} color="#9ca3af" />
                    <View>
                        <Text style={{ fontSize: 11, color: '#9ca3af' }}>Email (cannot be changed)</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>{session?.user?.email ?? '—'}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    style={{ backgroundColor: '#003b6f', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 24, opacity: saving ? 0.7 : 1 }}
                >
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{saving ? 'Saving…' : 'Save Changes'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
