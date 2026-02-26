import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ─── Replace these with your Supabase project values ─────────────────────────
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Platform-aware storage adapter:
 * - Web: uses localStorage (SecureStore is native-only and crashes on web)
 * - iOS / Android: uses expo-secure-store for encrypted storage
 */
const storage = Platform.OS === 'web'
    ? {
        getItem: (key: string) => {
            try { return Promise.resolve(localStorage.getItem(key)); }
            catch { return Promise.resolve(null); }
        },
        setItem: (key: string, value: string) => {
            try { localStorage.setItem(key, value); } catch { }
            return Promise.resolve();
        },
        removeItem: (key: string) => {
            try { localStorage.removeItem(key); } catch { }
            return Promise.resolve();
        },
    }
    : {
        getItem: (key: string) => SecureStore.getItemAsync(key),
        setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
        removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
