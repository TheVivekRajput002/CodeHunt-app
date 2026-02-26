import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface AuthButtonProps extends TouchableOpacityProps {
    label: string;
    loading?: boolean;
    variant?: 'primary' | 'outline';
}

export default function AuthButton({
    label,
    loading,
    variant = 'primary',
    style,
    ...props
}: AuthButtonProps) {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={[
                {
                    height: 52,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isPrimary ? '#003b6f' : 'transparent',
                    borderWidth: isPrimary ? 0 : 1.5,
                    borderColor: isPrimary ? 'transparent' : '#003b6f',
                },
                style,
            ]}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? '#fff' : '#003b6f'} />
            ) : (
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: isPrimary ? '#fff' : '#003b6f',
                        letterSpacing: 0.3,
                    }}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}
