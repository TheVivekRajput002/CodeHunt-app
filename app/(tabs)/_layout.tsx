import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { View } from 'react-native';

function TabBarBadge() {
  return (
    <View
      style={{
        position: 'absolute',
        top: -2,
        right: -4,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#ef4444',
      }}
    />
  );
}

export default function TabLayout() {
  const { session, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !session) {
      router.replace('/(auth)/login');
    }
  }, [session, initialized]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 62,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#003b6f',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: 'Properties',
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <Ionicons name="business" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="agents"
        options={{
          title: 'AI Agents',
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: 'relative' }}>
              <Ionicons name="sparkles" size={size} color={color} />
              <TabBarBadge />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      {/* Hide old tabs */}
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="saved" options={{ href: null }} />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
