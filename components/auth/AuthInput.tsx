import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
    label: string;
    error?: string;
    isPassword?: boolean;
}

export default function AuthInput({ label, error, isPassword, ...props }: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={{ marginBottom: 16 }}>
            <Text
                style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}
            >
                {label}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1.5,
                    borderColor: error ? '#dc2626' : '#e5e7eb',
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    height: 52,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 2,
                    elevation: 1,
                }}
            >
                <TextInput
                    style={{ flex: 1, fontSize: 15, color: '#111827', height: '100%' }}
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={isPassword && !showPassword}
                    autoCapitalize="none"
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#6b7280"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error ? (
                <Text style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</Text>
            ) : null}
        </View>
    );
}
