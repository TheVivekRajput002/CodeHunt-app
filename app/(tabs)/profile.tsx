import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const PREFERENCES = ['Buy', 'Rent', '2 BHK', '3 BHK', 'Bangalore', 'Mumbai', 'Apartment', 'Villa'];

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <View
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: '#eff6ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 1 }}>{label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>{value}</Text>
            </View>
        </View>
    );
}

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View
            style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: 18,
                marginBottom: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
            }}
        >
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 14 }}>
                {title}
            </Text>
            {children}
        </View>
    );
}

export default function ProfileScreen() {
    const { session } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const email = session?.user?.email ?? '';
    const userId = session?.user?.id ?? '';

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
                console.error('Error fetching profile:', error);
            } else if (data) {
                setProfileData(data);
            }
        } catch (error) {
            console.error('Exception fetching profile:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const emailPrefix = email.split('@')[0] ?? '';
    const initials = emailPrefix.slice(0, 2).toUpperCase();

    // Prefer full_name from db, otherwise fallback to email name
    const rawDisplayName = profileData?.full_name || emailPrefix.replace(/[._-]/g, ' ');
    const displayName = rawDisplayName
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    const phone = profileData?.phone || 'Not added';
    const userType = profileData?.user_type ? profileData.user_type.charAt(0).toUpperCase() + profileData.user_type.slice(1) : 'Buyer';
    const budget = profileData?.investment_budget ? `₹${profileData.investment_budget.toLocaleString()}` : 'Not set';
    const riskTolerance = profileData?.risk_tolerance ? profileData.risk_tolerance.charAt(0).toUpperCase() + profileData.risk_tolerance.slice(1) : 'Not set';

    const isEmailVerified = session?.user?.email_confirmed_at != null;
    const provider = session?.user?.app_metadata?.provider ?? 'email';
    const joinedDate = session?.user?.created_at
        ? new Date(session.user.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '—';

    const handleLogout = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    setLoggingOut(true);
                    await supabase.auth.signOut();
                    setLoggingOut(false);
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

                {/* ── Gradient Banner ── */}
                <View
                    style={{
                        height: 140,
                        backgroundColor: '#003b6f',
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                >
                    {/* Decorative circles */}
                    <View
                        style={{
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            width: 140,
                            height: 140,
                            borderRadius: 70,
                            backgroundColor: 'rgba(255,255,255,0.07)',
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -20,
                            left: 40,
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                        }}
                    />
                </View>

                {/* ── Avatar + Name ── */}
                <View style={{ alignItems: 'center', marginTop: -44, marginBottom: 20 }}>
                    <View
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: 44,
                            backgroundColor: '#2563eb',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 4,
                            borderColor: '#f9fafb',
                            shadowColor: '#003b6f',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                            elevation: 6,
                        }}
                    >
                        <Text style={{ fontSize: 30, fontWeight: '800', color: '#fff' }}>{initials}</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginTop: 10 }}>
                        {displayName}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{email}</Text>

                    {/* Edit + Logout buttons */}
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                        <TouchableOpacity
                            onPress={() => router.push('/edit-profile' as any)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                borderWidth: 1.5,
                                borderColor: '#003b6f',
                                borderRadius: 10,
                                paddingHorizontal: 18,
                                paddingVertical: 9,
                            }}
                        >
                            <Feather name="edit-2" size={14} color="#003b6f" />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#003b6f' }}>
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleLogout}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                borderWidth: 1.5,
                                borderColor: '#dc2626',
                                borderRadius: 10,
                                paddingHorizontal: 18,
                                paddingVertical: 9,
                            }}
                        >
                            <Ionicons name="log-out-outline" size={16} color="#dc2626" />
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#dc2626' }}>
                                {loggingOut ? 'Signing out…' : 'Sign Out'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    {/* ── Account Details Card ── */}
                    <Card title="Account Details">
                        <InfoRow
                            icon={<Ionicons name="mail-outline" size={16} color="#2563eb" />}
                            label="Email"
                            value={email || '—'}
                        />
                        <InfoRow
                            icon={<Ionicons name="call-outline" size={16} color="#2563eb" />}
                            label="Phone"
                            value={phone}
                        />
                        <InfoRow
                            icon={<Ionicons name="person-outline" size={16} color="#2563eb" />}
                            label="User Type"
                            value={userType}
                        />
                        <InfoRow
                            icon={<Ionicons name="location-outline" size={16} color="#2563eb" />}
                            label="Location"
                            value="India"
                        />
                        <InfoRow
                            icon={<Ionicons name="calendar-outline" size={16} color="#2563eb" />}
                            label="Joined"
                            value={joinedDate}
                        />
                    </Card>

                    {/* ── Security Card ── */}
                    <Card title="Security">
                        {/* Email verified */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                            <View
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 10,
                                    backgroundColor: isEmailVerified ? '#f0fdf4' : '#fef2f2',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name={isEmailVerified ? 'checkmark-circle' : 'close-circle'}
                                    size={18}
                                    color={isEmailVerified ? '#16a34a' : '#dc2626'}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 1 }}>
                                    Email Verified
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '700',
                                        color: isEmailVerified ? '#16a34a' : '#dc2626',
                                    }}
                                >
                                    {isEmailVerified ? 'Verified ✓' : 'Not Verified'}
                                </Text>
                            </View>
                        </View>

                        {/* User ID */}
                        <InfoRow
                            icon={<Ionicons name="finger-print-outline" size={16} color="#2563eb" />}
                            label="User ID"
                            value={userId ? `${userId.slice(0, 8)}…${userId.slice(-4)}` : '—'}
                        />

                        {/* Provider */}
                        <InfoRow
                            icon={<Ionicons name="shield-checkmark-outline" size={16} color="#2563eb" />}
                            label="Sign-in Method"
                            value={provider.charAt(0).toUpperCase() + provider.slice(1)}
                        />

                        {/* Change password button */}
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/update-password')}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                backgroundColor: '#eff6ff',
                                borderRadius: 10,
                                paddingVertical: 12,
                                marginTop: 4,
                                borderWidth: 1,
                                borderColor: '#bfdbfe',
                            }}
                        >
                            <Ionicons name="lock-closed-outline" size={15} color="#2563eb" />
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#2563eb' }}>
                                Change Password
                            </Text>
                        </TouchableOpacity>
                    </Card>

                    {/* ── Investment Preferences Card ── */}
                    <Card title="Investment Preferences">
                        <TouchableOpacity
                            onPress={() => router.push('/investment-preferences' as any)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#f0f9ff',
                                borderRadius: 12,
                                padding: 14,
                                borderWidth: 1,
                                borderColor: '#bae6fd',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Ionicons name="options-outline" size={20} color="#0369a1" />
                                <View>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>Edit Preferences</Text>
                                    <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>Budget, cities, property types</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                        </TouchableOpacity>

                        <View style={{ marginTop: 16 }}>
                            <InfoRow
                                icon={<Ionicons name="cash-outline" size={16} color="#2563eb" />}
                                label="Investment Budget"
                                value={budget}
                            />
                            <InfoRow
                                icon={<Ionicons name="trending-up-outline" size={16} color="#2563eb" />}
                                label="Risk Tolerance"
                                value={riskTolerance}
                            />
                        </View>
                    </Card>

                    {/* ── Preferences Card ── */}
                    <Card title="My Preferences">
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {PREFERENCES.map((pref) => (
                                <View
                                    key={pref}
                                    style={{
                                        backgroundColor: '#eff6ff',
                                        borderRadius: 20,
                                        paddingHorizontal: 14,
                                        paddingVertical: 7,
                                        borderWidth: 1,
                                        borderColor: '#bfdbfe',
                                    }}
                                >
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#003b6f' }}>
                                        {pref}
                                    </Text>
                                </View>
                            ))}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 20,
                                    paddingHorizontal: 14,
                                    paddingVertical: 7,
                                    borderWidth: 1.5,
                                    borderColor: '#e5e7eb',
                                    borderStyle: 'dashed',
                                }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#9ca3af' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
