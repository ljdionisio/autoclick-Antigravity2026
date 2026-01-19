import { supabase } from './supabase';
import { TargetButton, Pattern, AppSettings, LogEntry } from '../types';

// ====================================================
// TARGETS - CRUD Operations
// ====================================================

export const targetsService = {
    async getAll(): Promise<TargetButton[]> {
        const { data, error } = await supabase
            .from('targets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(t => ({
            id: t.id,
            name: t.name,
            triggerText: t.trigger_text,
            color: t.color,
            confidenceThreshold: t.confidence_threshold,
            shortcut: t.shortcut || '',
            status: t.status as 'active' | 'inactive'
        }));
    },

    async create(target: Omit<TargetButton, 'id'>): Promise<TargetButton> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('targets')
            .insert({
                user_id: user.id,
                name: target.name,
                trigger_text: target.triggerText,
                color: target.color,
                confidence_threshold: target.confidenceThreshold,
                shortcut: target.shortcut,
                status: target.status
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            triggerText: data.trigger_text,
            color: data.color,
            confidenceThreshold: data.confidence_threshold,
            shortcut: data.shortcut || '',
            status: data.status as 'active' | 'inactive'
        };
    },

    async update(id: string, updates: Partial<TargetButton>): Promise<void> {
        const { error } = await supabase
            .from('targets')
            .update({
                name: updates.name,
                trigger_text: updates.triggerText,
                color: updates.color,
                confidence_threshold: updates.confidenceThreshold,
                shortcut: updates.shortcut,
                status: updates.status
            })
            .eq('id', id);

        if (error) throw error;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('targets')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async toggleStatus(id: string, currentStatus: 'active' | 'inactive'): Promise<void> {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await this.update(id, { status: newStatus });
    }
};

// ====================================================
// PATTERNS - CRUD Operations
// ====================================================

export const patternsService = {
    async getAll(): Promise<Pattern[]> {
        const { data, error } = await supabase
            .from('patterns')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            targets: p.target_ids || [],
            createdAt: new Date(p.created_at).toISOString().split('T')[0],
            isActive: p.is_active
        }));
    },

    async create(pattern: Omit<Pattern, 'id' | 'createdAt'>): Promise<Pattern> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('patterns')
            .insert({
                user_id: user.id,
                name: pattern.name,
                description: pattern.description,
                target_ids: pattern.targets,
                is_active: pattern.isActive
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            description: data.description || '',
            targets: data.target_ids || [],
            createdAt: new Date(data.created_at).toISOString().split('T')[0],
            isActive: data.is_active
        };
    },

    async update(id: string, updates: Partial<Pattern>): Promise<void> {
        const { error } = await supabase
            .from('patterns')
            .update({
                name: updates.name,
                description: updates.description,
                target_ids: updates.targets,
                is_active: updates.isActive
            })
            .eq('id', id);

        if (error) throw error;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('patterns')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// ====================================================
// SETTINGS - User Settings
// ====================================================

export const settingsService = {
    async get(): Promise<AppSettings | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!data) return null;

        return {
            bridgeUrl: data.bridge_url,
            maxFilesPerBatch: data.max_files_per_batch,
            autoReconnect: data.auto_reconnect,
            soundEnabled: data.sound_enabled,
            theme: data.theme as 'dark' | 'system'
        };
    },

    async upsert(settings: AppSettings): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('settings')
            .upsert({
                user_id: user.id,
                bridge_url: settings.bridgeUrl,
                max_files_per_batch: settings.maxFilesPerBatch,
                auto_reconnect: settings.autoReconnect,
                sound_enabled: settings.soundEnabled,
                theme: settings.theme
            }, { onConflict: 'user_id' });

        if (error) throw error;
    }
};

// ====================================================
// LOGS - System Logs
// ====================================================

export const logsService = {
    async add(type: LogEntry['type'], message: string, metadata?: Record<string, unknown>): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Silent fail if not authenticated

        await supabase.from('logs').insert({
            user_id: user.id,
            type,
            message,
            metadata: metadata || {}
        });
    },

    async getRecent(limit = 50): Promise<LogEntry[]> {
        const { data, error } = await supabase
            .from('logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (data || []).map(l => ({
            id: l.id,
            timestamp: new Date(l.created_at).toLocaleTimeString('pt-BR', {
                hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
            }),
            type: l.type as LogEntry['type'],
            message: l.message
        }));
    }
};
