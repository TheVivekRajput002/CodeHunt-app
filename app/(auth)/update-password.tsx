import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import AuthWrapper from '@/components/auth/AuthWrapper';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';

export default function UpdatePasswordScreen() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

    const validate = () => {
        const errs: typeof errors = {};
        if (!password) errs.password = 'New password is required';
        else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (!confirmPassword) errs.confirmPassword = 'Please confirm your new password';
        else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleUpdate = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) {
                setErrors({ password: error.message });
            } else {
                setSuccess(true);
            }
        } catch (e) {
            setErrors({ password: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthWrapper title="Password updated! 🎉" subtitle="Your password has been changed successfully">
                <View
                    style={{
                        backgroundColor: '#f0fdf4',
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: '#bbf7d0',
                        marginBottom: 28,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
                    <Text style={{ fontSize: 14, color: '#15803d', flex: 1 }}>
                        You can now sign in with your new password.
                    </Text>
                </View>
                <AuthButton
                    label="Sign In"
                    onPress={() => router.replace('/(auth)/login')}
                />
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper
            title="Set new password"
            subtitle="Choose a strong password for your account"
        >
            <AuthInput
                label="New password"
                placeholder="Min. 8 characters"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={errors.password}
            />

            <AuthInput
                label="Confirm new password"
                placeholder="Re-enter your new password"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
            />

            {/* Password strength hint */}
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    💡 Use at least 8 characters with a mix of letters, numbers, and symbols
                </Text>
            </View>

            <AuthButton label="Update Password" loading={loading} onPress={handleUpdate} />
        </AuthWrapper>
    );
}
