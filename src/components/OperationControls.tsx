import { Operation, OperationType, ArithmeticOperationType } from '../types/signal';

interface OperationControlsProps {
    operation: Operation;
    onChange: (operation: Operation) => void;
    nMin: number;
    nMax: number;
    onRangeChange: (nMin: number, nMax: number) => void;
}

export function OperationControls({
    operation,
    onChange,
    nMin,
    nMax,
    onRangeChange,
}: OperationControlsProps) {
    const handleTypeChange = (type: OperationType) => {
        onChange({ type, parameters: {} });
    };

    const handleParameterChange = (key: string, value: number | string) => {
        onChange({
            ...operation,
            parameters: { ...operation.parameters, [key]: value },
        });
    };

    const handleArithmeticOpChange = (arithmeticOp: ArithmeticOperationType) => {
        onChange({
            ...operation,
            type: 'arithmetic',
            parameters: { ...operation.parameters, arithmeticOp },
        });
    };

    return (
        <div className="space-y-4">
            {/* Operation Type Selector */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">
                    Operation Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {([
                        { value: 'none', label: 'None' },
                        { value: 'shift', label: 'Time Shift' },
                        { value: 'fold', label: 'Folding' },
                        { value: 'scale', label: 'Scaling' },
                        { value: 'compose', label: 'Composition' },
                        { value: 'decompose', label: 'Even/Odd' },
                        { value: 'arithmetic', label: '➕ Arithmetic' },
                    ] as const).map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => handleTypeChange(value)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${operation.type === value
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Arithmetic Operation Sub-selector */}
            {operation.type === 'arithmetic' && (
                <div className="space-y-4 p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-xl border-2 border-green-600/50">
                    <label className="text-base font-bold text-green-400 flex items-center gap-2">
                        <span className="text-xl">🔢</span>
                        Pilih Operasi Aritmatika:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {([
                            { value: 'add', label: '➕ Penjumlahan', desc: 'y(n) = x₁(n) + x₂(n)' },
                            { value: 'subtract', label: '➖ Pengurangan', desc: 'y(n) = x₁(n) − x₂(n)' },
                            { value: 'multiply', label: '✖️ Perkalian', desc: 'y(n) = x₁(n) × x₂(n)' },
                            { value: 'convolve', label: '⊛ Konvolusi', desc: 'y(n) = Σ x₁(k)×x₂(n−k)' },
                        ] as const).map(({ value, label, desc }) => (
                            <button
                                key={value}
                                onClick={() => handleArithmeticOpChange(value)}
                                className={`px-4 py-3 rounded-lg text-sm transition-all text-left border ${
                                    operation.parameters.arithmeticOp === value
                                        ? 'bg-green-600 text-white border-green-400 shadow-lg shadow-green-500/30'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-600'
                                }`}
                            >
                                <div className="font-semibold">{label}</div>
                                <div className="text-xs opacity-80 font-mono mt-1">{desc}</div>
                            </button>
                        ))}
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                        <p className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-yellow-500">💡</span>
                            <span>
                                <strong>Instruksi:</strong> Setelah memilih operasi, scroll ke bawah untuk input <span className="text-green-400 font-semibold">Signal Kedua x₂(n)</span>. 
                                Gunakan preset atau input manual.
                            </span>
                        </p>
                    </div>
                </div>
            )}

            {/* Operation Parameters */}
            {operation.type === 'shift' && (
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">
                        Shift Amount (k)
                    </label>
                    <input
                        type="number"
                        value={operation.parameters.k || 0}
                        onChange={(e) => handleParameterChange('k', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500"
                        placeholder="0"
                    />
                    <p className="text-xs text-slate-400">
                        Positive: shift right (delay), Negative: shift left (advance)
                    </p>
                </div>
            )}

            {operation.type === 'scale' && (
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">
                        Scaling Factor (μ)
                    </label>
                    <input
                        type="number"
                        value={operation.parameters.mu || 1}
                        onChange={(e) => handleParameterChange('mu', parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500"
                        placeholder="1"
                    />
                    <p className="text-xs text-slate-400">
                        Greater than 1: compression, Between 0-1: expansion
                    </p>
                </div>
            )}

            {operation.type === 'compose' && (
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">
                        Index Transformation f(n)
                    </label>
                    <input
                        type="text"
                        value={operation.parameters.expression || ''}
                        onChange={(e) => handleParameterChange('expression', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-blue-500"
                        placeholder="e.g., -n-2 or -2*n+4"
                    />
                    <p className="text-xs text-slate-400">
                        Examples: <code className="text-blue-400">-n-2</code>, <code className="text-blue-400">-2*n+4</code>, <code className="text-blue-400">2*n</code>
                    </p>
                </div>
            )}

            {/* Range Controls */}
            <div className="space-y-2 pt-4 border-t border-slate-700">
                <label className="text-sm font-semibold text-slate-300">
                    Sample Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">n min</label>
                        <input
                            type="number"
                            value={nMin}
                            onChange={(e) => onRangeChange(parseInt(e.target.value) || -10, nMax)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">n max</label>
                        <input
                            type="number"
                            value={nMax}
                            onChange={(e) => onRangeChange(nMin, parseInt(e.target.value) || 10)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
