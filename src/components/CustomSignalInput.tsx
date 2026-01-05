import { useState } from 'react';
import { SignalValue } from '../types/signal';

interface CustomSignalInputProps {
    samples: SignalValue[];
    onChange: (samples: SignalValue[]) => void;
}

export function CustomSignalInput({ samples, onChange }: CustomSignalInputProps) {
    const [newN, setNewN] = useState<string>('');
    const [newValue, setNewValue] = useState<string>('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    // Sort samples by n for display
    const sortedSamples = [...samples].sort((a, b) => a.n - b.n);

    const handleAddSample = () => {
        const n = parseInt(newN);
        const value = parseFloat(newValue);

        if (isNaN(n)) {
            alert('Indeks n harus berupa bilangan bulat!');
            return;
        }
        if (isNaN(value)) {
            alert('Nilai harus berupa bilangan!');
            return;
        }

        // Check if n already exists
        const existingIndex = samples.findIndex(s => s.n === n);
        if (existingIndex !== -1) {
            // Update existing value
            const newSamples = [...samples];
            newSamples[existingIndex] = { n, value };
            onChange(newSamples);
        } else {
            // Add new sample
            onChange([...samples, { n, value }]);
        }

        setNewN('');
        setNewValue('');
    };

    const handleRemoveSample = (n: number) => {
        onChange(samples.filter(s => s.n !== n));
    };

    const handleStartEdit = (sample: SignalValue, index: number) => {
        setEditingIndex(index);
        setEditValue(sample.value.toString());
    };

    const handleSaveEdit = (n: number) => {
        const value = parseFloat(editValue);
        if (isNaN(value)) {
            alert('Nilai harus berupa bilangan!');
            return;
        }

        const newSamples = samples.map(s => 
            s.n === n ? { n, value } : s
        );
        onChange(newSamples);
        setEditingIndex(null);
        setEditValue('');
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditValue('');
    };

    const handleClearAll = () => {
        if (confirm('Hapus semua sampel?')) {
            onChange([]);
        }
    };

    // Quick add preset signals
    const addPreset = (type: 'impulse' | 'step' | 'ramp', start: number, end: number) => {
        const newSamples: SignalValue[] = [];
        for (let n = start; n <= end; n++) {
            let value = 0;
            switch (type) {
                case 'impulse':
                    value = n === 0 ? 1 : 0;
                    break;
                case 'step':
                    value = n >= 0 ? 1 : 0;
                    break;
                case 'ramp':
                    value = n >= 0 ? n : 0;
                    break;
            }
            newSamples.push({ n, value });
        }
        onChange(newSamples);
    };

    // Generate from range with custom function
    const generateRange = () => {
        const start = parseInt(prompt('n minimum (contoh: -5):', '-5') || '-5');
        const end = parseInt(prompt('n maximum (contoh: 5):', '5') || '5');
        
        if (isNaN(start) || isNaN(end) || start > end) {
            alert('Range tidak valid!');
            return;
        }

        const newSamples: SignalValue[] = [];
        for (let n = start; n <= end; n++) {
            // Keep existing values if they exist
            const existing = samples.find(s => s.n === n);
            newSamples.push({ n, value: existing?.value || 0 });
        }
        onChange(newSamples);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-300">
                    📊 Custom Signal Builder
                </h3>
                <span className="text-xs text-slate-500">
                    {samples.length} sampel
                </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
                <label className="text-xs text-slate-400">Preset Cepat:</label>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => addPreset('impulse', -3, 3)}
                        className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                    >
                        δ(n)
                    </button>
                    <button
                        onClick={() => addPreset('step', -3, 5)}
                        className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                    >
                        u(n)
                    </button>
                    <button
                        onClick={() => addPreset('ramp', -2, 5)}
                        className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                    >
                        r(n)
                    </button>
                    <button
                        onClick={generateRange}
                        className="px-2 py-1 text-xs bg-blue-700 hover:bg-blue-600 rounded text-slate-300 transition-colors"
                    >
                        📏 Buat Range
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="px-2 py-1 text-xs bg-red-700 hover:bg-red-600 rounded text-slate-300 transition-colors"
                    >
                        🗑️ Hapus Semua
                    </button>
                </div>
            </div>

            {/* Add New Sample */}
            <div className="bg-slate-900 rounded-lg p-3 space-y-2">
                <label className="text-xs text-slate-400">Tambah Sampel Baru:</label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500">n (indeks)</label>
                        <input
                            type="number"
                            value={newN}
                            onChange={(e) => setNewN(e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500">x(n) (nilai)</label>
                        <input
                            type="number"
                            step="any"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder="1"
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleAddSample}
                            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-sm font-medium transition-colors"
                        >
                            + Tambah
                        </button>
                    </div>
                </div>
            </div>

            {/* Sample List */}
            {sortedSamples.length > 0 ? (
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-slate-800 border-b border-slate-700">
                        <span className="text-xs font-medium text-slate-400">
                            Daftar Sampel x(n):
                        </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800 sticky top-0">
                                <tr>
                                    <th className="px-3 py-1 text-left text-slate-400 font-medium">n</th>
                                    <th className="px-3 py-1 text-left text-slate-400 font-medium">x(n)</th>
                                    <th className="px-3 py-1 text-right text-slate-400 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {sortedSamples.map((sample, idx) => (
                                    <tr key={sample.n} className="hover:bg-slate-800/50">
                                        <td className="px-3 py-1 text-blue-400 font-mono">{sample.n}</td>
                                        <td className="px-3 py-1">
                                            {editingIndex === idx ? (
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveEdit(sample.n);
                                                        if (e.key === 'Escape') handleCancelEdit();
                                                    }}
                                                    className="w-20 px-1 py-0.5 bg-slate-700 border border-blue-500 rounded text-white text-sm focus:outline-none"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="text-orange-400 font-mono">
                                                    {Number.isInteger(sample.value) ? sample.value : sample.value.toFixed(3)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-1 text-right">
                                            {editingIndex === idx ? (
                                                <div className="flex gap-1 justify-end">
                                                    <button
                                                        onClick={() => handleSaveEdit(sample.n)}
                                                        className="px-2 py-0.5 text-xs bg-green-600 hover:bg-green-500 rounded text-white"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="px-2 py-0.5 text-xs bg-slate-600 hover:bg-slate-500 rounded text-white"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-1 justify-end">
                                                    <button
                                                        onClick={() => handleStartEdit(sample, idx)}
                                                        className="px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-500 rounded text-white"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveSample(sample.n)}
                                                        className="px-2 py-0.5 text-xs bg-red-600 hover:bg-red-500 rounded text-white"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-900 rounded-lg p-4 text-center text-slate-500 text-sm">
                    Belum ada sampel. Tambahkan sampel di atas atau gunakan preset.
                </div>
            )}

            {/* Signal Summary */}
            {sortedSamples.length > 0 && (
                <div className="bg-slate-900/50 rounded p-2 text-xs text-slate-400">
                    <span className="font-medium text-slate-300">Notasi: </span>
                    <span className="font-mono">
                        x(n) = {'{'}
                        {sortedSamples
                            .filter(s => s.value !== 0)
                            .map(s => `${s.value} untuk n=${s.n}`)
                            .join(', ') || '0'}
                        {'}'}
                    </span>
                </div>
            )}
        </div>
    );
}
