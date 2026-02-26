import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder — can be expanded later with Explore/search functionality
export default function ExploreScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 36, marginBottom: 12 }}>🔍</Text>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#003b6f' }}>Explore</Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>
                    Browse properties by category
                </Text>
            </View>
        </SafeAreaView>
    );
}
