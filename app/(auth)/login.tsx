import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AuthWrapper from '@/components/auth/AuthWrapper';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
        if (!password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                if (error.message.includes('Invalid login')) {
                    setErrors({ password: 'Incorrect email or password' });
                } else {
                    router.push({ pathname: '/(auth)/auth-error', params: { message: error.message } });
                }
            }
            // On success the auth guard in _layout.tsx will redirect to (tabs)
        } catch (e) {
            router.push('/(auth)/auth-error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Welcome back 👋"
            subtitle="Sign in to discover your dream property"
        >
            <AuthInput
                label="Email address"
                placeholder="you@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
            />

            <AuthInput
                label="Password"
                placeholder="Enter your password"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={errors.password}
            />

            <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                style={{ alignSelf: 'flex-end', marginBottom: 24, marginTop: -4 }}
            >
                <Text style={{ fontSize: 13, color: '#2563eb', fontWeight: '600' }}>
                    Forgot password?
                </Text>
            </TouchableOpacity>

            <AuthButton label="Sign In" loading={loading} onPress={handleLogin} />

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                    <Text style={{ fontSize: 14, color: '#003b6f', fontWeight: '700' }}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </AuthWrapper>
    );
}
