import { useState } from 'react';
import { ArithmeticCalculation } from '../lib/operations';

interface ArithmeticTableProps {
    calculations: ArithmeticCalculation[];
    operationType: 'add' | 'subtract' | 'multiply' | 'convolve';
}

export function ArithmeticTable({ calculations, operationType }: ArithmeticTableProps) {
    const [hideZeros, setHideZeros] = useState(false);

    const displayCalcs = hideZeros
        ? calculations.filter(c => c.result !== 0)
        : calculations;

    const nonZeroResults = calculations.filter(c => c.result !== 0);

    const opSymbols: Record<string, string> = {
        add: '+',
        subtract: '-',
        multiply: '×',
        convolve: '*',
    };

    const opNames: Record<string, string> = {
        add: 'Penjumlahan',
        subtract: 'Pengurangan',
        multiply: 'Perkalian',
        convolve: 'Konvolusi',
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-300">
                    📊 Tabel {opNames[operationType]}
                </h3>
                <label className="flex items-center gap-2 text-sm text-slate-400">
                    <input
                        type="checkbox"
                        checked={hideZeros}
                        onChange={(e) => setHideZeros(e.target.checked)}
                        className="rounded bg-slate-700 border-slate-600"
                    />
                    Sembunyikan nol
                </label>
            </div>

            {/* Summary */}
            <div className="bg-orange-900/30 rounded p-2 border border-orange-700/50 text-xs">
                <span className="text-orange-400">y(n) non-zero:</span>{' '}
                <span className="text-white font-mono">
                    {nonZeroResults.map(c => `y(${c.n})=${Number.isInteger(c.result) ? c.result : c.result.toFixed(2)}`).join(', ') || '(semua nol)'}
                </span>
            </div>

            {/* Table */}
            {operationType === 'convolve' ? (
                // Convolution table with detailed terms
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                        {displayCalcs.map((calc) => (
                            <div
                                key={calc.n}
                                className={`p-3 rounded border-l-4 ${
                                    calc.result !== 0
                                        ? 'bg-slate-900 border-l-orange-500'
                                        : 'bg-slate-900/50 border-l-slate-600'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-blue-400 font-mono font-bold">n = {calc.n}</span>
                                    <span className="text-orange-400 font-mono">
                                        y({calc.n}) = {Number.isInteger(calc.result) ? calc.result : calc.result.toFixed(3)}
                                    </span>
                                </div>
                                {calc.convolutionTerms && calc.convolutionTerms.length > 0 ? (
                                    <div className="text-xs font-mono text-slate-400">
                                        <div className="mb-1">y({calc.n}) = Σₖ x₁(k) × x₂({calc.n}-k)</div>
                                        <div className="pl-2 space-y-0.5">
                                            {calc.convolutionTerms.map((term, idx) => (
                                                <div key={idx} className="text-slate-300">
                                                    k={term.k}: x₁({term.k})×x₂({calc.n - term.k}) = {term.x1k}×{term.x2nk} = {term.product}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-1 text-green-400">
                                            Total = {calc.convolutionTerms.reduce((sum, t) => sum + t.product, 0)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500">Tidak ada term non-zero</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Point-wise operations table
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-xs font-mono">
                        <thead className="sticky top-0 bg-slate-700">
                            <tr>
                                <th className="px-2 py-1 text-left text-slate-300">n</th>
                                <th className="px-2 py-1 text-center text-blue-400">x₁(n)</th>
                                <th className="px-2 py-1 text-center text-slate-500">{opSymbols[operationType]}</th>
                                <th className="px-2 py-1 text-center text-green-400">x₂(n)</th>
                                <th className="px-2 py-1 text-center text-slate-500">=</th>
                                <th className="px-2 py-1 text-center text-orange-400">y(n)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {displayCalcs.map((calc) => (
                                <tr key={calc.n} className="hover:bg-slate-700/50">
                                    <td className="px-2 py-1 text-slate-300">{calc.n}</td>
                                    <td className="px-2 py-1 text-center text-blue-300">
                                        {Number.isInteger(calc.x1Value) ? calc.x1Value : calc.x1Value.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1 text-center text-slate-500">{opSymbols[operationType]}</td>
                                    <td className="px-2 py-1 text-center text-green-300">
                                        {Number.isInteger(calc.x2Value) ? calc.x2Value : calc.x2Value.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1 text-center text-slate-500">=</td>
                                    <td className="px-2 py-1 text-center text-orange-300 font-bold">
                                        {Number.isInteger(calc.result) ? calc.result : calc.result.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Formula reminder */}
            <div className="bg-slate-700/50 rounded p-2 text-xs text-slate-400">
                <span className="font-medium">Formula: </span>
                <span className="font-mono text-blue-400">
                    {operationType === 'add' && 'y(n) = x₁(n) + x₂(n)'}
                    {operationType === 'subtract' && 'y(n) = x₁(n) - x₂(n)'}
                    {operationType === 'multiply' && 'y(n) = x₁(n) × x₂(n)'}
                    {operationType === 'convolve' && 'y(n) = Σₖ x₁(k) × x₂(n-k)'}
                </span>
            </div>
        </div>
    );
}
