import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import AnimatedList from '../components/AnimatedList';
import MotionButton from '../components/MotionButton';
import Modal from '../components/Modal';
import { TargetButton } from '../types';

const INITIAL_TARGETS: TargetButton[] = [
    { id: '1', name: 'Aceitar Alteração', triggerText: 'Accept', color: '#2563EB', confidenceThreshold: 0.92, shortcut: '⌘+Enter', status: 'active' },
    { id: '2', name: 'Rejeitar Alteração', triggerText: 'Reject', color: '#DC2626', confidenceThreshold: 0.95, shortcut: '⌘+Backspace', status: 'inactive' },
    { id: '3', name: 'Commit Preparado', triggerText: 'Commit', color: '#10B981', confidenceThreshold: 0.98, shortcut: '⌘+K', status: 'active' },
    { id: '4', name: 'Salvar Arquivo', triggerText: 'Save', color: '#F59E0B', confidenceThreshold: 0.90, shortcut: '⌘+S', status: 'active' },
    { id: '5', name: 'Push Changes', triggerText: 'Push', color: '#8B5CF6', confidenceThreshold: 0.96, shortcut: '⌘+Shift+P', status: 'inactive' },
];

const TargetLibrary: React.FC = () => {
    const [targets, setTargets] = useState<TargetButton[]>(INITIAL_TARGETS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTarget, setEditingTarget] = useState<TargetButton | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        triggerText: '',
        color: '#2563EB',
        confidenceThreshold: 0.92,
        shortcut: ''
    });

    const filteredTargets = targets.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.triggerText.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAddModal = () => {
        setEditingTarget(null);
        setFormData({ name: '', triggerText: '', color: '#2563EB', confidenceThreshold: 0.92, shortcut: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (target: TargetButton) => {
        setEditingTarget(target);
        setFormData({
            name: target.name,
            triggerText: target.triggerText,
            color: target.color,
            confidenceThreshold: target.confidenceThreshold,
            shortcut: target.shortcut
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (editingTarget) {
            setTargets(prev => prev.map(t =>
                t.id === editingTarget.id
                    ? { ...t, ...formData }
                    : t
            ));
        } else {
            const newTarget: TargetButton = {
                id: Date.now().toString(),
                ...formData,
                status: 'active'
            };
            setTargets(prev => [...prev, newTarget]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        setTargets(prev => prev.filter(t => t.id !== id));
    };

    const toggleStatus = (id: string) => {
        setTargets(prev => prev.map(t =>
            t.id === id
                ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' }
                : t
        ));
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-white">Biblioteca de Alvos</h1>
                        <p className="text-sm text-slate-400 mt-1">Gerencie as assinaturas de alvos para detecção automática</p>
                    </div>
                    <MotionButton onClick={openAddModal} icon={<Plus className="w-4 h-4" />}>
                        Novo Alvo
                    </MotionButton>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar alvos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-white">{targets.length}</div>
                        <div className="text-xs text-slate-400 mt-1">Total de Alvos</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-emerald-400">{targets.filter(t => t.status === 'active').length}</div>
                        <div className="text-xs text-slate-400 mt-1">Ativos</div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-slate-500">{targets.filter(t => t.status === 'inactive').length}</div>
                        <div className="text-xs text-slate-400 mt-1">Inativos</div>
                    </div>
                </div>

                {/* Target List */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {filteredTargets.length} Alvos Encontrados
                        </span>
                    </div>

                    <AnimatedList className="divide-y divide-slate-800" staggerDelay={0.05}>
                        {filteredTargets.map(target => (
                            <div key={target.id} className="p-4 hover:bg-slate-800/30 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: target.color }}
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-white">{target.name}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${target.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                                                    }`}>
                                                    {target.status === 'active' ? 'ATIVO' : 'INATIVO'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                                <span className="font-mono">OCR: "{target.triggerText}"</span>
                                                <span>Confiança: {(target.confidenceThreshold * 100).toFixed(0)}%</span>
                                                <span className="text-slate-600">{target.shortcut}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleStatus(target.id)}
                                            className={`p-2 rounded-md transition-colors ${target.status === 'active'
                                                    ? 'hover:bg-amber-500/10 text-amber-400'
                                                    : 'hover:bg-emerald-500/10 text-emerald-400'
                                                }`}
                                            title={target.status === 'active' ? 'Desativar' : 'Ativar'}
                                        >
                                            {target.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => openEditModal(target)}
                                            className="p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(target.id)}
                                            className="p-2 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </AnimatedList>

                    {filteredTargets.length === 0 && (
                        <div className="p-8 text-center">
                            <div className="text-slate-600 text-sm">Nenhum alvo encontrado</div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title={editingTarget ? 'Editar Alvo' : 'Novo Alvo'}
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nome do Alvo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Ex: Aceitar Alteração"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Texto de Gatilho (OCR)</label>
                                <input
                                    type="text"
                                    value={formData.triggerText}
                                    onChange={(e) => setFormData({ ...formData, triggerText: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Ex: Accept"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Cor</label>
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full h-10 bg-slate-800 border border-slate-700 rounded-md cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Confiança Mínima</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={formData.confidenceThreshold}
                                        onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Atalho</label>
                                <input
                                    type="text"
                                    value={formData.shortcut}
                                    onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Ex: ⌘+Enter"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <MotionButton variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                                    Cancelar
                                </MotionButton>
                                <MotionButton onClick={handleSave} className="flex-1">
                                    {editingTarget ? 'Salvar' : 'Criar'}
                                </MotionButton>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TargetLibrary;
