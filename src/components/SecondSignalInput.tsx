import { useState } from 'react';
import { SignalValue } from '../types/signal';

interface SecondSignalInputProps {
    samples: SignalValue[];
    onChange: (samples: SignalValue[]) => void;
    label?: string;
}

export function SecondSignalInput({ samples, onChange, label = 'x₂(n)' }: SecondSignalInputProps) {
    const [newN, setNewN] = useState<string>('');
    const [newValue, setNewValue] = useState<string>('');
    const [rangeStart, setRangeStart] = useState<string>('-5');
    const [rangeEnd, setRangeEnd] = useState<string>('5');
    const [rangeValue, setRangeValue] = useState<string>('1');
    const [showRangeInput, setShowRangeInput] = useState(false);

    const sortedSamples = [...samples].sort((a, b) => a.n - b.n);
    const nonZeroSamples = sortedSamples.filter(s => s.value !== 0);

    const handleAddSample = () => {
        const n = parseInt(newN);
        const value = parseFloat(newValue);

        if (isNaN(n) || isNaN(value)) {
            alert('n dan nilai harus berupa angka!');
            return;
        }

        const existingIndex = samples.findIndex(s => s.n === n);
        if (existingIndex !== -1) {
            const newSamples = [...samples];
            newSamples[existingIndex] = { n, value };
            onChange(newSamples);
        } else {
            onChange([...samples, { n, value }]);
        }

        setNewN('');
        setNewValue('');
    };

    const handleRemoveSample = (n: number) => {
        onChange(samples.filter(s => s.n !== n));
    };

    const handleUpdateSample = (n: number, newValue: number) => {
        onChange(samples.map(s => s.n === n ? { ...s, value: newValue } : s));
    };

    const handleQuickPreset = (preset: 'impulse' | 'step' | 'ramp' | 'clear') => {
        if (preset === 'clear') {
            onChange([]);
            return;
        }
        
        const newSamples: SignalValue[] = [];
        for (let n = -5; n <= 5; n++) {
            let value = 0;
            if (preset === 'impulse') {
                value = n === 0 ? 1 : 0;
            } else if (preset === 'step') {
                value = n >= 0 ? 1 : 0;
            } else if (preset === 'ramp') {
                value = n >= 0 ? n : 0;
            }
            newSamples.push({ n, value });
        }
        onChange(newSamples);
    };

    const handleGenerateRange = () => {
        const start = parseInt(rangeStart);
        const end = parseInt(rangeEnd);
        const value = parseFloat(rangeValue);

        if (isNaN(start) || isNaN(end) || isNaN(value)) {
            alert('Semua nilai harus berupa angka!');
            return;
        }

        if (start > end) {
            alert('Start harus lebih kecil dari End!');
            return;
        }

        const newSamples: SignalValue[] = [];
        for (let n = start; n <= end; n++) {
            newSamples.push({ n, value });
        }
        onChange(newSamples);
        setShowRangeInput(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddSample();
        }
    };

    return (
        <div className="bg-green-900/30 border-2 border-green-600/50 rounded-xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-green-400 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Signal Kedua {label}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-800/50 rounded text-xs text-green-300">
                        {samples.length} sampel
                    </span>
                    <span className="px-2 py-1 bg-orange-800/50 rounded text-xs text-orange-300">
                        {nonZeroSamples.length} non-zero
                    </span>
                </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Preset Cepat
                </label>
                <div className="grid grid-cols-4 gap-2">
                    <button
                        onClick={() => handleQuickPreset('impulse')}
                        className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                    >
                        δ(n)
                    </button>
                    <button
                        onClick={() => handleQuickPreset('step')}
                        className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                    >
                        u(n)
                    </button>
                    <button
                        onClick={() => handleQuickPreset('ramp')}
                        className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
                    >
                        r(n)
                    </button>
                    <button
                        onClick={() => handleQuickPreset('clear')}
                        className="px-3 py-2 text-sm bg-red-700/80 hover:bg-red-600 rounded-lg text-white transition-colors"
                    >
                        🗑️ Clear
                    </button>
                </div>
            </div>

            {/* Add Single Sample */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Tambah Sampel Manual
                </label>
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Indeks n</label>
                        <input
                            type="number"
                            value={newN}
                            onChange={(e) => setNewN(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="0"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-base focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 mb-1 block">Nilai {label}</label>
                        <input
                            type="number"
                            step="any"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="1"
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-base focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                    </div>
                    <button
                        onClick={handleAddSample}
                        className="px-5 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white text-lg font-bold transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Range Generator Toggle */}
            <div className="space-y-2">
                <button
                    onClick={() => setShowRangeInput(!showRangeInput)}
                    className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                >
                    {showRangeInput ? '▼' : '▶'} Generator Range Nilai
                </button>
                
                {showRangeInput && (
                    <div className="p-3 bg-slate-800/50 rounded-lg space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Start</label>
                                <input
                                    type="number"
                                    value={rangeStart}
                                    onChange={(e) => setRangeStart(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">End</label>
                                <input
                                    type="number"
                                    value={rangeEnd}
                                    onChange={(e) => setRangeEnd(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Value</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={rangeValue}
                                    onChange={(e) => setRangeValue(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleGenerateRange}
                            className="w-full py-2 bg-green-700 hover:bg-green-600 rounded text-white text-sm transition-colors"
                        >
                            Generate Signal
                        </button>
                    </div>
                )}
            </div>

            {/* Sample List - Bigger and clearer */}
            {nonZeroSamples.length > 0 && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Nilai Non-Zero ({nonZeroSamples.length})
                    </label>
                    <div className="max-h-48 overflow-y-auto bg-slate-900/70 rounded-lg border border-slate-700">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-slate-800">
                                <tr>
                                    <th className="px-3 py-2 text-left text-green-400">n</th>
                                    <th className="px-3 py-2 text-center text-green-400">{label}</th>
                                    <th className="px-3 py-2 text-right text-slate-400">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {nonZeroSamples.map((sample) => (
                                    <tr key={sample.n} className="hover:bg-slate-800/50">
                                        <td className="px-3 py-2 text-slate-300 font-mono">{sample.n}</td>
                                        <td className="px-3 py-2 text-center">
                                            <input
                                                type="number"
                                                step="any"
                                                value={sample.value}
                                                onChange={(e) => handleUpdateSample(sample.n, parseFloat(e.target.value) || 0)}
                                                className="w-20 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-center text-sm"
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <button
                                                onClick={() => handleRemoveSample(sample.n)}
                                                className="px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Summary preview */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="text-xs text-slate-400 mb-1">Preview Signal:</div>
                <div className="font-mono text-sm text-green-300 break-all">
                    {nonZeroSamples.length > 0 
                        ? nonZeroSamples.map(s => `${label.replace('(n)', '')}(${s.n})=${s.value}`).join(', ')
                        : <span className="text-slate-500 italic">Belum ada sampel non-zero</span>
                    }
                </div>
            </div>
        </div>
    );
}
