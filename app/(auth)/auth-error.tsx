import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthErrorScreen() {
    const router = useRouter();
    const { message } = useLocalSearchParams<{ message?: string }>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                {/* Error icon */}
                <View
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: 48,
                        backgroundColor: '#fef2f2',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 28,
                        shadowColor: '#dc2626',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 4,
                    }}
                >
                    <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
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
                    Something went wrong
                </Text>

                <Text
                    style={{
                        fontSize: 15,
                        color: '#6b7280',
                        textAlign: 'center',
                        lineHeight: 24,
                        marginBottom: 16,
                    }}
                >
                    {message || 'An unexpected error occurred. Please try again.'}
                </Text>

                {/* Error detail card */}
                {message ? (
                    <View
                        style={{
                            backgroundColor: '#fef2f2',
                            borderRadius: 12,
                            padding: 16,
                            width: '100%',
                            borderWidth: 1,
                            borderColor: '#fecaca',
                            marginBottom: 32,
                        }}
                    >
                        <Text style={{ fontSize: 13, color: '#991b1b', fontFamily: 'monospace' }}>
                            {message}
                        </Text>
                    </View>
                ) : (
                    <View style={{ marginBottom: 32 }} />
                )}

                <TouchableOpacity
                    onPress={() => router.replace('/(auth)/login')}
                    style={{
                        backgroundColor: '#003b6f',
                        borderRadius: 12,
                        height: 52,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                        Back to Sign In
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>← Go back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
