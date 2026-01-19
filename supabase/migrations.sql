-- ====================================================
-- ANTIGRAVITY V5.0 - SUPABASE MIGRATIONS
-- Execute este script no SQL Editor do Supabase Dashboard
-- ====================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================
-- TABELA: targets
-- Armazena as assinaturas de alvos para detecção
-- ====================================================
CREATE TABLE IF NOT EXISTS public.targets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trigger_text TEXT NOT NULL,
    color TEXT DEFAULT '#2563EB',
    confidence_threshold DECIMAL(3,2) DEFAULT 0.92 CHECK (confidence_threshold >= 0 AND confidence_threshold <= 1),
    shortcut TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- TABELA: patterns
-- Templates de automação pré-configurados
-- ====================================================
CREATE TABLE IF NOT EXISTS public.patterns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target_ids UUID[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- TABELA: settings
-- Configurações do usuário
-- ====================================================
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    bridge_url TEXT DEFAULT 'ws://localhost:8765',
    max_files_per_batch INTEGER DEFAULT 5 CHECK (max_files_per_batch >= 1 AND max_files_per_batch <= 50),
    auto_reconnect BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'system')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- TABELA: logs
-- Registro de ações do sistema
-- ====================================================
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'bridge')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- ROW LEVEL SECURITY (RLS) - OBRIGATÓRIO
-- Cada usuário só acessa seus próprios dados
-- ====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Políticas para TARGETS
CREATE POLICY "Users can view own targets" ON public.targets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own targets" ON public.targets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own targets" ON public.targets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own targets" ON public.targets
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para PATTERNS
CREATE POLICY "Users can view own patterns" ON public.patterns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns" ON public.patterns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patterns" ON public.patterns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patterns" ON public.patterns
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para SETTINGS
CREATE POLICY "Users can view own settings" ON public.settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para LOGS
CREATE POLICY "Users can view own logs" ON public.logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON public.logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ====================================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- ====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_targets_updated_at
    BEFORE UPDATE ON public.targets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patterns_updated_at
    BEFORE UPDATE ON public.patterns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================
-- ÍNDICES para performance
-- ====================================================
CREATE INDEX IF NOT EXISTS idx_targets_user_id ON public.targets(user_id);
CREATE INDEX IF NOT EXISTS idx_targets_status ON public.targets(status);
CREATE INDEX IF NOT EXISTS idx_patterns_user_id ON public.patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_settings_user_id ON public.settings(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);

-- ====================================================
-- FINALIZADO! ✅
-- Agora configure a autenticação no Supabase Dashboard
-- ====================================================
