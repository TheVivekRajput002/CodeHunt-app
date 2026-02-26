import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthWrapperProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthWrapper({ children, title, subtitle }: AuthWrapperProps) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo / Brand */}
                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <View
                            style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                backgroundColor: '#003b6f',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                                shadowColor: '#003b6f',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>CH</Text>
                        </View>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 6 }}>
                            {title}
                        </Text>
                        {subtitle ? (
                            <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22 }}>
                                {subtitle}
                            </Text>
                        ) : null}
                    </View>

                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
