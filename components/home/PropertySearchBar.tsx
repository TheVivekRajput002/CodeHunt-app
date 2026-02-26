import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SEARCH_TABS, PROPERTY_TYPES } from '@/data/properties';

interface PropertySearchBarProps {
    onSearch?: (query: string, tab: string, type: string) => void;
}

export default function PropertySearchBar({ onSearch }: PropertySearchBarProps) {
    const [activeTab, setActiveTab] = useState('buy');
    const [selectedType, setSelectedType] = useState('All Residential');
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <View
            style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                marginHorizontal: 16,
                marginTop: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
            }}
        >
            {/* ── Row 1: Tab Strip ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14 }}
            >
                {SEARCH_TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            style={{ marginRight: 22, paddingBottom: 10, alignItems: 'center' }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: isActive ? '700' : '500',
                                        color: isActive ? '#003b6f' : '#6b7280',
                                    }}
                                >
                                    {tab.label}
                                </Text>
                                {tab.dot && (
                                    <View
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: '#ef4444',
                                            marginTop: -8,
                                        }}
                                    />
                                )}
                            </View>
                            {isActive && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2.5,
                                        backgroundColor: '#003b6f',
                                        borderRadius: 2,
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />

            {/* ── Row 2: Property Type Selector ── */}
            <TouchableOpacity
                onPress={() => setDropdownOpen(true)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="home-outline" size={16} color="#003b6f" />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                        {selectedType}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </TouchableOpacity>

            {/* ── Row 3: Search Input ── */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f9fafb',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        gap: 8,
                    }}
                >
                    <Ionicons name="search-outline" size={18} color="#9ca3af" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Locality, landmark, project or builder"
                        placeholderTextColor="#9ca3af"
                        style={{ flex: 1, fontSize: 14, color: '#111827' }}
                        returnKeyType="search"
                        onSubmitEditing={() => onSearch?.(searchQuery, activeTab, selectedType)}
                    />
                    <TouchableOpacity
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            backgroundColor: '#003b6f',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="mic-outline" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Row 4: Search Button + Post Property ── */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingHorizontal: 16,
                    paddingBottom: 14,
                }}
            >
                <TouchableOpacity
                    onPress={() => onSearch?.(searchQuery, activeTab, selectedType)}
                    style={{
                        flex: 1,
                        backgroundColor: '#2563eb',
                        borderRadius: 10,
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Search</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: '#eff6ff',
                        borderRadius: 10,
                        height: 44,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderColor: '#bfdbfe',
                    }}
                >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1d4ed8' }}>
                        Post Property
                    </Text>
                    <View
                        style={{
                            backgroundColor: '#16a34a',
                            borderRadius: 4,
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                        }}
                    >
                        <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>FREE</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* ── Property Type Dropdown Modal ── */}
            <Modal
                visible={dropdownOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setDropdownOpen(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
                    activeOpacity={1}
                    onPress={() => setDropdownOpen(false)}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            paddingBottom: 32,
                        }}
                    >
                        {/* Handle */}
                        <View
                            style={{
                                width: 40,
                                height: 4,
                                backgroundColor: '#e5e7eb',
                                borderRadius: 2,
                                alignSelf: 'center',
                                marginTop: 12,
                                marginBottom: 16,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '800',
                                color: '#111827',
                                paddingHorizontal: 20,
                                marginBottom: 12,
                            }}
                        >
                            Property Type
                        </Text>
                        {PROPERTY_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => {
                                    setSelectedType(type);
                                    setDropdownOpen(false);
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    paddingVertical: 14,
                                    backgroundColor: selectedType === type ? '#eff6ff' : '#fff',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: selectedType === type ? '#003b6f' : '#374151',
                                        fontWeight: selectedType === type ? '700' : '400',
                                    }}
                                >
                                    {type}
                                </Text>
                                {selectedType === type && (
                                    <Ionicons name="checkmark-circle" size={20} color="#003b6f" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
