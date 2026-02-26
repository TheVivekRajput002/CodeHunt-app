import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropertySearchBar from '@/components/home/PropertySearchBar';
import NewlyLaunchedSection from '@/components/home/NewlyLaunchedSection';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ── Header ── */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 4,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {/* Logo mark */}
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#003b6f',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '800' }}>CH</Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#003b6f' }}>
                CodeHunt
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
              Find your dream property 🏠
            </Text>
          </View>

          {/* India badge */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16 }}>🇮🇳</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>India</Text>
          </View>
        </View>

        {/* ── Property Search Bar ── */}
        <PropertySearchBar />

        {/* ── Stats Row ── */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 16,
            marginTop: 16,
            gap: 10,
          }}
        >
          {[
            { value: '10L+', label: 'Properties' },
            { value: '500+', label: 'Cities' },
            { value: '₹0', label: 'Brokerage' },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 12,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#003b6f' }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Newly Launched Projects ── */}
        <NewlyLaunchedSection />

        {/* ── More Coming Soon banner ── */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 8,
            backgroundColor: '#003b6f',
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
              Zero Brokerage 🎉
            </Text>
            <Text style={{ fontSize: 12, color: '#93c5fd', marginTop: 4 }}>
              Post your property for free
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#2563eb',
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Post Now</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
