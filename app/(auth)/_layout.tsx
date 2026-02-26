import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function AuthLayout() {
    const { session, initialized } = useAuth();
    const router = useRouter();

    // If user is already logged in, redirect to home
    useEffect(() => {
        if (initialized && session) {
            router.replace('/(tabs)');
        }
    }, [session, initialized]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="check-email" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="update-password" />
            <Stack.Screen name="auth-error" />
        </Stack>
    );
}
