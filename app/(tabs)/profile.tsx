import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder — will be fully implemented in Phase 5
export default function ProfileScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#003b6f' }}>Profile 👤</Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
                    Profile screen — Phase 5
                </Text>
            </View>
        </SafeAreaView>
    );
}
