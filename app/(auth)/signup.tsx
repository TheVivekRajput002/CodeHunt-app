import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AuthWrapper from '@/components/auth/AuthWrapper';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function SignUpScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validate = () => {
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
        else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                router.push({ pathname: '/(auth)/auth-error', params: { message: error.message } });
            } else {
                // Redirect to onboarding to collect preferences
                router.replace('/onboarding' as any);
            }
        } catch (e) {
            router.push('/(auth)/auth-error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthWrapper
            title="Create account"
            subtitle="Join CodeHunt to find your perfect property"
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
                placeholder="Min. 8 characters"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={errors.password}
            />

            <AuthInput
                label="Confirm password"
                placeholder="Re-enter your password"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
            />

            <View style={{ marginTop: 8 }}>
                <AuthButton label="Create Account" loading={loading} onPress={handleSignUp} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                    <Text style={{ fontSize: 14, color: '#003b6f', fontWeight: '700' }}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </AuthWrapper>
    );
}
