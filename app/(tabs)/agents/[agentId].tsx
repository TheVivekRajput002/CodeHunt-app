import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Agent, ChatMessage, AIGeneration } from '@/types';

// ─── Agent definitions ────────────────────────────────────────────────────────
const AGENTS: Record<string, Agent> = {
    'property-valuator': { id: 'property-valuator', name: 'Property Valuator', description: 'AI-powered market valuations', icon: 'trending-up', color: '#2563eb', badge: 'Most Popular' },
    'market-analyst': { id: 'market-analyst', name: 'Market Analyst', description: 'Micro-market trend analysis', icon: 'bar-chart', color: '#7c3aed', badge: 'New' },
    'risk-scorer': { id: 'risk-scorer', name: 'Risk Scorer', description: 'Fraud detection & risk scoring', icon: 'shield-checkmark', color: '#059669', badge: 'Beta' },
    'demand-forecaster': { id: 'demand-forecaster', name: 'Demand Forecaster', description: 'Future demand forecasting', icon: 'analytics', color: '#d97706', badge: 'Pro' },
};

// ─── Mock AI responses ────────────────────────────────────────────────────────
const MOCK_RESPONSES: Record<string, string[]> = {
    'property-valuator': [
        '📊 Based on 1,240 comparable transactions in Whitefield, Bangalore, I estimate this 3 BHK apartment at **₹82–88 Lakhs** (current market range). The confidence score is **87%**.\n\n**Key factors:**\n• Location premium: +12% (Whitefield tech corridor)\n• Floor premium: +3% (upper floors)\n• Year of construction: -2% (2018 build)\n\nWould you like a detailed breakdown by comparable sales?',
        '🏘️ The property at Sarjapur Road is priced at **₹72 Lakhs** which is approximately **4.8% below** the average for similar 2 BHK apartments in that micro-market.\n\nThis could indicate a motivated seller or represent a real opportunity. Recommend due diligence on legal clearances.',
        '📈 The current price per square foot (PSF) for apartments in Hebbal is **₹6,800–7,400**. For a 1,420 sqft flat, fair value would be **₹96 L – ₹1.05 Cr**.',
    ],
    'market-analyst': [
        '📈 **Whitefield, Bangalore — Market Snapshot Q1 2026:**\n\n• YoY appreciation: **+9.2%**\n• Average PSF: ₹7,200\n• Rental yield: **3.4%**\n• Demand index: 84/100 (High)\n\nDriven by Meta, Infosys, and Wipro campus expansions. Expect 8–12% appreciation in next 12 months.',
        '🔍 **Tier-2 Micro-markets to Watch:**\n1. Aerospace Park — poised for 15% growth (SEZ effect)\n2. Devanahalli — ORR extension impact\n3. Yelahanka — data center cluster growth\n\nAll three show demand-to-supply ratios above 1.5x.',
    ],
    'risk-scorer': [
        '🛡️ **Risk Assessment for Prestige Lakeside Habitat:**\n\n✅ RERA Registered: PRM/KA/RERA/1251/309/PR/171117/001478\n✅ No litigation records found\n✅ Builder track record: Excellent (15+ delivered projects)\n⚠️ Title deed: Recommend independent legal verification\n\n**Overall Risk Score: LOW** (12/100)\n\nThis property is safe to proceed with. Recommend a title search for final confirmation.',
        '⚠️ **Offer Risk Analysis:**\nYour offer of ₹82L on a ₹85L asking price is a **3.5% discount request**. Historically, sellers in Whitefield accept 2–5% discounts in a stable market. **Probability of acceptance: 68%**.',
    ],
    'demand-forecaster': [
        '📊 **Demand Forecast — 2 BHK Apartments, Bangalore (2026–2027):**\n\n• Q2 2026: +6% demand surge (returns from WFH, IT hiring cycle)\n• Q3 2026: Stable demand, slight inventory correction\n• Q4 2026: Festive season spike (+14% transactions expected)\n• 2027: Rental yields projected at 4.1% (up from 3.4%)\n\n**Verdict: Strong Buy window open until Q3 2026.**',
    ],
};

function getRandomResponse(agentId: string): string {
    const responses = MOCK_RESPONSES[agentId] ?? ["I'm analyzing your query... Please ask me about property valuations, market trends, risk assessments, or demand forecasts."];
    return responses[Math.floor(Math.random() * responses.length)];
}

// ─── Suggested prompts per agent ─────────────────────────────────────────────
const SUGGESTIONS: Record<string, string[]> = {
    'property-valuator': ['Value a 3 BHK in Whitefield', 'What is the fair PSF in Hebbal?', 'Compare prices in Sarjapur vs Whitefield'],
    'market-analyst': ['Bangalore market outlook 2026', 'Top micro-markets to invest in', 'Rental yield trends in Gurgaon'],
    'risk-scorer': ['Assess risk for Prestige Lakeside', 'Is ₹82L offer likely to be accepted?', 'Check RERA status for a project'],
    'demand-forecaster': ['2 BHK demand forecast Bangalore', 'Best time to buy in 2026?', 'Rental demand growth prediction'],
};

// ─── Chat Bubble ─────────────────────────────────────────────────────────────
function ChatBubble({ msg, agentColor }: { msg: ChatMessage; agentColor: string }) {
    const isUser = msg.role === 'user';
    return (
        <View style={{ flexDirection: 'row', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12, paddingHorizontal: 16 }}>
            {!isUser && (
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: agentColor + '20', alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 2 }}>
                    <Ionicons name="sparkles" size={15} color={agentColor} />
                </View>
            )}
            <View
                style={{
                    maxWidth: '78%',
                    backgroundColor: isUser ? agentColor : '#fff',
                    borderRadius: 18,
                    borderTopLeftRadius: isUser ? 18 : 4,
                    borderTopRightRadius: isUser ? 4 : 18,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 6,
                    elevation: 2,
                }}
            >
                <Text style={{ fontSize: 14, color: isUser ? '#fff' : '#111827', lineHeight: 20 }}>{msg.content}</Text>
                <Text style={{ fontSize: 10, color: isUser ? 'rgba(255,255,255,0.6)' : '#9ca3af', marginTop: 4, textAlign: 'right' }}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
}

// ─── Generations History ──────────────────────────────────────────────────────
function GenerationsHistory({ history, agentColor }: { history: AIGeneration[]; agentColor: string }) {
    if (history.length === 0) return null;
    return (
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#6b7280', marginBottom: 10 }}>
                Previous Conversations
            </Text>
            {history.map((gen) => (
                <View key={gen.id} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: agentColor }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151' }} numberOfLines={1}>Q: {gen.prompt}</Text>
                    <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }} numberOfLines={2}>{gen.response}</Text>
                </View>
            ))}
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AgentChatScreen() {
    const { agentId } = useLocalSearchParams<{ agentId: string }>();
    const router = useRouter();
    const agent = AGENTS[agentId ?? 'property-valuator'] ?? AGENTS['property-valuator'];

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '0',
            role: 'assistant',
            content: `Hi! I'm the **${agent.name}**. ${agent.description}.\n\nAsk me anything about properties, markets, or valuations and I'll give you AI-powered insights! 🏠`,
            timestamp: new Date().toISOString(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [history] = useState<AIGeneration[]>([]);
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || loading) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setTimeout(() => {
            const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: getRandomResponse(agent.id), timestamp: new Date().toISOString() };
            setMessages((prev) => [...prev, aiMsg]);
            setLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }, 1800);
    }, [loading, agent.id]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>

                {/* ── Top bar ── */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        backgroundColor: '#fff',
                        borderBottomWidth: 1,
                        borderBottomColor: '#f3f4f6',
                        gap: 12,
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="arrow-back" size={18} color="#111827" />
                    </TouchableOpacity>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: agent.color + '15', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={agent.icon as any} size={20} color={agent.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827' }}>{agent.name}</Text>
                        <Text style={{ fontSize: 11, color: '#6b7280' }}>{agent.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#16a34a' }} />
                        <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '600' }}>Online</Text>
                    </View>
                </View>

                {/* ── Message list ── */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(msg) => msg.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    renderItem={({ item }) => <ChatBubble msg={item} agentColor={agent.color} />}
                    ListHeaderComponent={history.length > 0 ? <GenerationsHistory history={history} agentColor={agent.color} /> : null}
                    ListFooterComponent={
                        loading ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 8 }}>
                                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: agent.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name="sparkles" size={15} color={agent.color} />
                                </View>
                                <View style={{ backgroundColor: '#fff', borderRadius: 18, borderTopLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                                    <ActivityIndicator size="small" color={agent.color} />
                                </View>
                            </View>
                        ) : null
                    }
                />

                {/* ── Suggestion chips (show only at start) ── */}
                {messages.length <= 1 && (
                    <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
                        <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>Suggested prompts</Text>
                        <FlatList
                            horizontal
                            data={SUGGESTIONS[agent.id] ?? []}
                            keyExtractor={(s) => s}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => sendMessage(item)}
                                    style={{ backgroundColor: agent.color + '12', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: agent.color + '30', marginRight: 8 }}
                                >
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: agent.color }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {/* ── Input bar ── */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        backgroundColor: '#fff',
                        borderTopWidth: 1,
                        borderTopColor: '#f3f4f6',
                        gap: 10,
                    }}
                >
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder={`Ask ${agent.name}…`}
                        placeholderTextColor="#9ca3af"
                        multiline
                        style={{ flex: 1, fontSize: 14, color: '#111827', backgroundColor: '#f9fafb', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 100, borderWidth: 1.5, borderColor: '#e5e7eb' }}
                        returnKeyType="send"
                        onSubmitEditing={() => sendMessage(input)}
                    />
                    <TouchableOpacity
                        onPress={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: input.trim() && !loading ? agent.color : '#e5e7eb',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="send" size={18} color={input.trim() && !loading ? '#fff' : '#9ca3af'} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
