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
                <div className="space-y-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <label className="text-sm font-semibold text-green-400">
                        Pilih Operasi Aritmatika:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {([
                            { value: 'add', label: '➕ Penjumlahan', desc: 'x₁(n) + x₂(n)' },
                            { value: 'subtract', label: '➖ Pengurangan', desc: 'x₁(n) - x₂(n)' },
                            { value: 'multiply', label: '✖️ Perkalian', desc: 'x₁(n) × x₂(n)' },
                            { value: 'convolve', label: '⊛ Konvolusi', desc: 'x₁(n) * x₂(n)' },
                        ] as const).map(({ value, label, desc }) => (
                            <button
                                key={value}
                                onClick={() => handleArithmeticOpChange(value)}
                                className={`px-3 py-2 rounded-lg text-xs transition-all text-left ${
                                    operation.parameters.arithmeticOp === value
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                <div className="font-medium">{label}</div>
                                <div className="text-[10px] opacity-70 font-mono">{desc}</div>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        💡 Signal kedua akan diinput setelah memilih operasi. Gunakan mode "Custom" untuk menambahkan signal kedua.
                    </p>
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
