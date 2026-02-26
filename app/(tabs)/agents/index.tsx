import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Agent } from '@/types';

const AGENTS: Agent[] = [
    {
        id: 'property-valuator',
        name: 'Property Valuator',
        description: 'Get AI-powered market valuations for any property based on 10M+ data points, location trends, and comparable sales.',
        icon: 'trending-up',
        color: '#2563eb',
        badge: 'Most Popular',
    },
    {
        id: 'market-analyst',
        name: 'Market Analyst',
        description: 'Deep-dive into micro-market trends, demand forecasts, and price movements for any city or locality.',
        icon: 'bar-chart',
        color: '#7c3aed',
        badge: 'New',
    },
    {
        id: 'risk-scorer',
        name: 'Risk Scorer',
        description: 'Detect fraud, assess offer risks, and evaluate legal compliance before committing to any deal.',
        icon: 'shield-checkmark',
        color: '#059669',
        badge: 'Beta',
    },
    {
        id: 'demand-forecaster',
        name: 'Demand Forecaster',
        description: 'Predict future demand for specific property types and areas using rental yield and growth models.',
        icon: 'analytics',
        color: '#d97706',
        badge: 'Pro',
    },
];

const BADGE_COLORS: Record<string, string> = {
    'Most Popular': '#2563eb',
    'New': '#7c3aed',
    'Beta': '#059669',
    'Pro': '#d97706',
};

function AgentCard({ agent }: { agent: Agent }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push(`/(tabs)/agents/${agent.id}` as any)}
            activeOpacity={0.8}
            style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: 18,
                marginBottom: 14,
                shadowColor: agent.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
                borderWidth: 1,
                borderColor: agent.color + '20',
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                {/* Icon circle */}
                <View
                    style={{
                        width: 54,
                        height: 54,
                        borderRadius: 16,
                        backgroundColor: agent.color + '15',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Ionicons name={agent.icon as any} size={26} color={agent.color} />
                </View>

                <View style={{ flex: 1 }}>
                    {/* Name + badge */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827' }}>{agent.name}</Text>
                        <View style={{ backgroundColor: BADGE_COLORS[agent.badge] + '20', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                            <Text style={{ fontSize: 10, fontWeight: '700', color: BADGE_COLORS[agent.badge] }}>{agent.badge.toUpperCase()}</Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 19, marginBottom: 14 }}>{agent.description}</Text>

                    <TouchableOpacity
                        onPress={() => router.push(`/(tabs)/agents/${agent.id}` as any)}
                        style={{
                            backgroundColor: agent.color,
                            borderRadius: 10,
                            paddingVertical: 10,
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name="sparkles" size={14} color="#fff" />
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Launch Agent</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function AgentsListScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#003b6f', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="sparkles" size={18} color="#fff" />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#003b6f' }}>AI Agents</Text>
                </View>
                <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 19 }}>
                    Powered by advanced AI to give you real-time property intelligence, valuations, and risk assessments.
                </Text>
            </View>

            <FlatList
                data={AGENTS}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
                renderItem={({ item }) => <AgentCard agent={item} />}
            />
        </SafeAreaView>
    );
}
