import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase credentials not found. Some features may not work.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Helper para verificar conexão
export const checkConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('health_check').select('count').limit(1);
        return !error;
    } catch {
        return false;
    }
};

// Types para Database (será expandido conforme necessário)
export type Database = {
    public: {
        Tables: {
            targets: {
                Row: {
                    id: string;
                    name: string;
                    trigger_text: string;
                    color: string;
                    confidence_threshold: number;
                    shortcut: string;
                    status: 'active' | 'inactive';
                    created_at: string;
                    user_id: string;
                };
                Insert: Omit<Database['public']['Tables']['targets']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['targets']['Insert']>;
            };
            patterns: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    target_ids: string[];
                    is_active: boolean;
                    created_at: string;
                    user_id: string;
                };
                Insert: Omit<Database['public']['Tables']['patterns']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['patterns']['Insert']>;
            };
            settings: {
                Row: {
                    id: string;
                    user_id: string;
                    bridge_url: string;
                    max_files_per_batch: number;
                    auto_reconnect: boolean;
                    sound_enabled: boolean;
                    theme: 'dark' | 'system';
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['settings']['Insert']>;
            };
        };
    };
};
