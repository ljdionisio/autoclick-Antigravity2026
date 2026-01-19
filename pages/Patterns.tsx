import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Copy, Download, Upload, Trash2, CheckCircle, Clock, FileCode } from 'lucide-react';
import AnimatedList from '../components/AnimatedList';
import MotionButton from '../components/MotionButton';
import Modal from '../components/Modal';
import { Pattern } from '../types';

const INITIAL_PATTERNS: Pattern[] = [
    {
        id: '1',
        name: 'Git Commit Rápido',
        description: 'Detecta e clica automaticamente em botões Accept e Commit para fluxo Git acelerado.',
        targets: ['1', '3'],
        createdAt: '2025-01-15',
        isActive: true
    },
    {
        id: '2',
        name: 'Code Review Accept All',
        description: 'Aceita todas as sugestões de code review em sequência.',
        targets: ['1'],
        createdAt: '2025-01-10',
        isActive: true
    },
    {
        id: '3',
        name: 'Reject Unsafe Changes',
        description: 'Rejeita automaticamente alterações marcadas como inseguras.',
        targets: ['2'],
        createdAt: '2025-01-08',
        isActive: false
    },
];

const Patterns: React.FC = () => {
    const [patterns, setPatterns] = useState<Pattern[]>(INITIAL_PATTERNS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const filteredPatterns = patterns.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = () => {
        const newPattern: Pattern = {
            id: Date.now().toString(),
            name: formData.name,
            description: formData.description,
            targets: [],
            createdAt: new Date().toISOString().split('T')[0],
            isActive: true
        };
        setPatterns(prev => [...prev, newPattern]);
        setIsModalOpen(false);
        setFormData({ name: '', description: '' });
    };

    const handleDelete = (id: string) => {
        setPatterns(prev => prev.filter(p => p.id !== id));
    };

    const toggleActive = (id: string) => {
        setPatterns(prev => prev.map(p =>
            p.id === id ? { ...p, isActive: !p.isActive } : p
        ));
    };

    const duplicatePattern = (pattern: Pattern) => {
        const newPattern: Pattern = {
            ...pattern,
            id: Date.now().toString(),
            name: `${pattern.name} (Cópia)`,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setPatterns(prev => [...prev, newPattern]);
    };

    const exportPatterns = () => {
        const data = JSON.stringify(patterns, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'antigravity-patterns.json';
        a.click();
        URL.revokeObjectURL(url);
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
                        <h1 className="text-xl font-bold text-white">Padrões de Automação</h1>
                        <p className="text-sm text-slate-400 mt-1">Templates pré-configurados para cenários comuns de automação</p>
                    </div>
                    <div className="flex gap-2">
                        <MotionButton variant="secondary" onClick={exportPatterns} icon={<Download className="w-4 h-4" />}>
                            Exportar
                        </MotionButton>
                        <MotionButton onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                            Novo Padrão
                        </MotionButton>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar padrões..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Pattern Cards */}
                <AnimatedList className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.08}>
                    {filteredPatterns.map(pattern => (
                        <motion.div
                            key={pattern.id}
                            layout
                            className={`bg-slate-900/50 border rounded-lg overflow-hidden transition-all ${pattern.isActive ? 'border-slate-700 hover:border-blue-500/50' : 'border-slate-800 opacity-60'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FileCode className={`w-5 h-5 ${pattern.isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                                        <h3 className="font-semibold text-white">{pattern.name}</h3>
                                    </div>
                                    <button
                                        onClick={() => toggleActive(pattern.id)}
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${pattern.isActive
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                                            }`}
                                    >
                                        {pattern.isActive ? 'ATIVO' : 'INATIVO'}
                                    </button>
                                </div>

                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{pattern.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{pattern.createdAt}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => duplicatePattern(pattern)}
                                            className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
                                            title="Duplicar"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pattern.id)}
                                            className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatedList>

                {filteredPatterns.length === 0 && (
                    <div className="text-center py-12">
                        <FileCode className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500">Nenhum padrão encontrado</p>
                    </div>
                )}
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Novo Padrão"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nome do Padrão</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Ex: Auto-Accept Reviews"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                                    placeholder="Descreva o que este padrão faz..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <MotionButton variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                                    Cancelar
                                </MotionButton>
                                <MotionButton onClick={handleCreate} className="flex-1">
                                    Criar Padrão
                                </MotionButton>
                            </div>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Patterns;
