import { useState } from 'react';
import { ArithmeticCalculation } from '../lib/operations';

interface ArithmeticTableProps {
    calculations: ArithmeticCalculation[];
    operationType: 'add' | 'subtract' | 'multiply' | 'convolve';
}

export function ArithmeticTable({ calculations, operationType }: ArithmeticTableProps) {
    const [hideZeros, setHideZeros] = useState(true);
    const [expandedN, setExpandedN] = useState<number | null>(null);

    const displayCalcs = hideZeros
        ? calculations.filter(c => c.result !== 0 || (c.convolutionTerms && c.convolutionTerms.length > 0))
        : calculations;

    const nonZeroResults = calculations.filter(c => c.result !== 0);

    const opSymbols: Record<string, string> = {
        add: '+',
        subtract: '−',
        multiply: '×',
        convolve: '∗',
    };

    const opNames: Record<string, string> = {
        add: 'Penjumlahan',
        subtract: 'Pengurangan',
        multiply: 'Perkalian',
        convolve: 'Konvolusi',
    };

    const formatNumber = (num: number): string => {
        if (Number.isInteger(num)) return num.toString();
        if (Math.abs(num) < 0.001) return num.toExponential(2);
        return num.toFixed(3).replace(/\.?0+$/, '');
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Tabel {opNames[operationType]}
                </h3>
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                    <input
                        type="checkbox"
                        checked={hideZeros}
                        onChange={(e) => setHideZeros(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                    />
                    Sembunyikan nol
                </label>
            </div>

            {/* Summary Box */}
            <div className="bg-gradient-to-r from-orange-900/40 to-yellow-900/30 rounded-lg p-4 border border-orange-600/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-400">Hasil y(n) Non-Zero:</span>
                    <span className="px-2 py-1 bg-orange-600/30 rounded text-xs text-orange-300">
                        {nonZeroResults.length} nilai
                    </span>
                </div>
                <div className="font-mono text-sm text-white bg-slate-900/50 rounded p-2 max-h-20 overflow-y-auto">
                    {nonZeroResults.length > 0 
                        ? nonZeroResults.map(c => `y(${c.n})=${formatNumber(c.result)}`).join(', ')
                        : <span className="text-slate-500 italic">Semua hasil = 0</span>
                    }
                </div>
            </div>

            {/* Table Content */}
            {operationType === 'convolve' ? (
                // Convolution detailed view
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {displayCalcs.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            Tidak ada hasil untuk ditampilkan
                        </div>
                    ) : (
                        displayCalcs.map((calc) => (
                            <div
                                key={calc.n}
                                className={`rounded-lg border-l-4 overflow-hidden transition-all ${
                                    calc.result !== 0
                                        ? 'bg-slate-900 border-l-orange-500'
                                        : 'bg-slate-900/30 border-l-slate-600'
                                }`}
                            >
                                {/* Collapsible header */}
                                <button
                                    onClick={() => setExpandedN(expandedN === calc.n ? null : calc.n)}
                                    className="w-full p-3 flex justify-between items-center hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-blue-400 font-mono font-bold">n = {calc.n}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            calc.convolutionTerms && calc.convolutionTerms.length > 0
                                                ? 'bg-green-800/50 text-green-300'
                                                : 'bg-slate-700 text-slate-400'
                                        }`}>
                                            {calc.convolutionTerms?.length || 0} terms
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono font-bold ${
                                            calc.result !== 0 ? 'text-orange-400' : 'text-slate-500'
                                        }`}>
                                            y({calc.n}) = {formatNumber(calc.result)}
                                        </span>
                                        <span className="text-slate-500">
                                            {expandedN === calc.n ? '▼' : '▶'}
                                        </span>
                                    </div>
                                </button>
                                
                                {/* Expanded details */}
                                {expandedN === calc.n && (
                                    <div className="px-3 pb-3 border-t border-slate-700">
                                        <div className="mt-2 text-xs font-mono text-slate-400 mb-2">
                                            y({calc.n}) = Σₖ x₁(k) × x₂({calc.n}-k)
                                        </div>
                                        {calc.convolutionTerms && calc.convolutionTerms.length > 0 ? (
                                            <div className="bg-slate-800/50 rounded p-2 space-y-1">
                                                {calc.convolutionTerms.map((term, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                                        <span className="text-slate-500 w-12">k={term.k}:</span>
                                                        <span className="text-blue-300">x₁({term.k})={formatNumber(term.x1k)}</span>
                                                        <span className="text-slate-500">×</span>
                                                        <span className="text-green-300">x₂({calc.n - term.k})={formatNumber(term.x2nk)}</span>
                                                        <span className="text-slate-500">=</span>
                                                        <span className="text-yellow-300 font-medium">{formatNumber(term.product)}</span>
                                                    </div>
                                                ))}
                                                <div className="pt-2 mt-2 border-t border-slate-700 text-sm">
                                                    <span className="text-slate-400">Total = </span>
                                                    <span className="text-orange-400 font-bold">
                                                        {formatNumber(calc.convolutionTerms.reduce((sum, t) => sum + t.product, 0))}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-slate-500 italic">
                                                Tidak ada term non-zero untuk n = {calc.n}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            ) : (
                // Point-wise operations table
                <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm font-mono">
                        <thead className="sticky top-0 bg-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-slate-300 font-semibold">n</th>
                                <th className="px-4 py-3 text-center text-blue-400 font-semibold">x₁(n)</th>
                                <th className="px-4 py-3 text-center text-slate-400 font-semibold">{opSymbols[operationType]}</th>
                                <th className="px-4 py-3 text-center text-green-400 font-semibold">x₂(n)</th>
                                <th className="px-4 py-3 text-center text-slate-400 font-semibold">=</th>
                                <th className="px-4 py-3 text-center text-orange-400 font-semibold">y(n)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {displayCalcs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        Tidak ada hasil untuk ditampilkan
                                    </td>
                                </tr>
                            ) : (
                                displayCalcs.map((calc) => (
                                    <tr 
                                        key={calc.n} 
                                        className={`hover:bg-slate-700/50 transition-colors ${
                                            calc.result !== 0 ? '' : 'opacity-50'
                                        }`}
                                    >
                                        <td className="px-4 py-2 text-slate-300">{calc.n}</td>
                                        <td className="px-4 py-2 text-center text-blue-300">
                                            {formatNumber(calc.x1Value)}
                                        </td>
                                        <td className="px-4 py-2 text-center text-slate-500 text-lg">
                                            {opSymbols[operationType]}
                                        </td>
                                        <td className="px-4 py-2 text-center text-green-300">
                                            {formatNumber(calc.x2Value)}
                                        </td>
                                        <td className="px-4 py-2 text-center text-slate-500">=</td>
                                        <td className={`px-4 py-2 text-center font-bold ${
                                            calc.result !== 0 ? 'text-orange-400' : 'text-slate-500'
                                        }`}>
                                            {formatNumber(calc.result)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Formula Reference */}
            <div className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                <span className="text-slate-400 text-sm">📐 Formula:</span>
                <code className="font-mono text-blue-400 text-sm bg-slate-900/50 px-2 py-1 rounded">
                    {operationType === 'add' && 'y(n) = x₁(n) + x₂(n)'}
                    {operationType === 'subtract' && 'y(n) = x₁(n) − x₂(n)'}
                    {operationType === 'multiply' && 'y(n) = x₁(n) × x₂(n)'}
                    {operationType === 'convolve' && 'y(n) = Σₖ x₁(k) × x₂(n−k)'}
                </code>
            </div>
        </div>
    );
}
