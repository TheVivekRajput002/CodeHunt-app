import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import AuthWrapper from '@/components/auth/AuthWrapper';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleReset = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Enter a valid email address');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { error: supaErr } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'codehunt://update-password',
            });
            if (supaErr) {
                setError(supaErr.message);
            } else {
                setSent(true);
            }
        } catch (e) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <AuthWrapper
                title="Reset link sent! ✉️"
                subtitle={`We've sent a password reset link to\n${email}`}
            >
                <View
                    style={{
                        backgroundColor: '#f0fdf4',
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: '#bbf7d0',
                        marginBottom: 28,
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: 10,
                    }}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#16a34a" style={{ marginTop: 1 }} />
                    <Text style={{ fontSize: 14, color: '#15803d', lineHeight: 22, flex: 1 }}>
                        Check your inbox and click the link to reset your password. The link expires in 1 hour.
                    </Text>
                </View>

                <AuthButton
                    label="Back to Sign In"
                    onPress={() => router.replace('/(auth)/login')}
                />
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper
            title="Forgot password?"
            subtitle="Enter your email and we'll send you a reset link"
        >
            {/* Back button */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: -16 }}
            >
                <Ionicons name="arrow-back" size={18} color="#003b6f" />
                <Text style={{ fontSize: 14, color: '#003b6f', fontWeight: '600', marginLeft: 4 }}>
                    Back
                </Text>
            </TouchableOpacity>

            <AuthInput
                label="Email address"
                placeholder="you@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                error={error}
            />

            <View style={{ marginTop: 8 }}>
                <AuthButton label="Send Reset Link" loading={loading} onPress={handleReset} />
            </View>
        </AuthWrapper>
    );
}
