import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckEmailScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                {/* Animated mail icon */}
                <View
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        backgroundColor: '#eff6ff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 28,
                        shadowColor: '#2563eb',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 4,
                    }}
                >
                    <Ionicons name="mail-outline" size={48} color="#2563eb" />
                </View>

                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: '800',
                        color: '#111827',
                        textAlign: 'center',
                        marginBottom: 12,
                    }}
                >
                    Check your email 📬
                </Text>

                <Text
                    style={{
                        fontSize: 15,
                        color: '#6b7280',
                        textAlign: 'center',
                        lineHeight: 24,
                        marginBottom: 36,
                    }}
                >
                    We've sent you a confirmation link.{'\n'}
                    Open your email and click the link to activate your CodeHunt account.
                </Text>

                {/* Tips card */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 20,
                        width: '100%',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        marginBottom: 32,
                    }}
                >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 }}>
                        💡 Didn't receive it?
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 20 }}>
                        • Check your spam or junk folder{'\n'}
                        • Make sure the email address is correct{'\n'}
                        • Wait a few minutes and try again
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.replace('/(auth)/login')}
                    style={{
                        backgroundColor: '#003b6f',
                        borderRadius: 12,
                        height: 52,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                        Back to Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
