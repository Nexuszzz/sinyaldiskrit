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

    const sortedSamples = [...samples].sort((a, b) => a.n - b.n);

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

    const handleQuickPreset = (preset: 'impulse' | 'step' | 'clear') => {
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
            }
            newSamples.push({ n, value });
        }
        onChange(newSamples);
    };

    return (
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-green-400">
                    📊 Signal Kedua {label}
                </h4>
                <span className="text-xs text-slate-500">{samples.length} sampel</span>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => handleQuickPreset('impulse')}
                    className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                >
                    δ(n)
                </button>
                <button
                    onClick={() => handleQuickPreset('step')}
                    className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                >
                    u(n)
                </button>
                <button
                    onClick={() => handleQuickPreset('clear')}
                    className="px-2 py-1 text-xs bg-red-700 hover:bg-red-600 rounded text-slate-300"
                >
                    Clear
                </button>
            </div>

            {/* Add Sample */}
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <label className="text-xs text-slate-500">n</label>
                    <input
                        type="number"
                        value={newN}
                        onChange={(e) => setNewN(e.target.value)}
                        placeholder="0"
                        className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-xs text-slate-500">{label}</label>
                    <input
                        type="number"
                        step="any"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="1"
                        className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                    />
                </div>
                <button
                    onClick={handleAddSample}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-sm"
                >
                    +
                </button>
            </div>

            {/* Sample List */}
            {sortedSamples.length > 0 && (
                <div className="max-h-32 overflow-y-auto bg-slate-900/50 rounded">
                    <div className="flex flex-wrap gap-1 p-2">
                        {sortedSamples.filter(s => s.value !== 0).map((sample) => (
                            <div
                                key={sample.n}
                                className="flex items-center gap-1 px-2 py-1 bg-green-800/50 rounded text-xs"
                            >
                                <span className="text-green-300 font-mono">
                                    {label.replace('(n)', '')}({sample.n})={sample.value}
                                </span>
                                <button
                                    onClick={() => handleRemoveSample(sample.n)}
                                    className="text-red-400 hover:text-red-300 ml-1"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        {sortedSamples.filter(s => s.value !== 0).length === 0 && (
                            <span className="text-slate-500 text-xs">Semua nilai = 0</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
