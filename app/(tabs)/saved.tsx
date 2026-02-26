import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder — can be expanded later with saved/wishlist functionality
export default function SavedScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 36, marginBottom: 12 }}>🤍</Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#003b6f' }}>Saved</Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>
                    Your shortlisted properties
                </Text>
            </View>
        </SafeAreaView>
    );
}
