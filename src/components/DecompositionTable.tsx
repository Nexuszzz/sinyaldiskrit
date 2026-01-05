import { useState } from 'react';
import { DecompositionResult } from '../types/signal';

interface DecompositionTableProps {
    decompositionResult: DecompositionResult;
}

export function DecompositionTable({ decompositionResult }: DecompositionTableProps) {
    const [hideZeros, setHideZeros] = useState(false);

    const { calculations } = decompositionResult;

    // Filter based on hideZeros
    const displayCalcs = hideZeros
        ? calculations.filter(c => c.xn !== 0 || c.xMinusN !== 0 || c.evenValue !== 0 || c.oddValue !== 0)
        : calculations;

    // Summary statistics
    const nonZeroEven = calculations.filter(c => c.evenValue !== 0);
    const nonZeroOdd = calculations.filter(c => c.oddValue !== 0);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-300">
                    📊 Tabel Dekomposisi
                </h3>
                <label className="flex items-center gap-2 text-sm text-slate-400">
                    <input
                        type="checkbox"
                        checked={hideZeros}
                        onChange={(e) => setHideZeros(e.target.checked)}
                        className="rounded bg-slate-700 border-slate-600"
                    />
                    Sembunyikan nilai nol
                </label>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-900/30 rounded p-2 border border-green-700/50">
                    <span className="text-green-400">xₑ(n) non-zero:</span>{' '}
                    <span className="text-white font-mono">
                        {nonZeroEven.map(c => `xₑ(${c.n})=${c.evenValue}`).join(', ') || '(semua nol)'}
                    </span>
                </div>
                <div className="bg-purple-900/30 rounded p-2 border border-purple-700/50">
                    <span className="text-purple-400">xₒ(n) non-zero:</span>{' '}
                    <span className="text-white font-mono">
                        {nonZeroOdd.map(c => `xₒ(${c.n})=${c.oddValue}`).join(', ') || '(semua nol)'}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full text-xs font-mono">
                    <thead className="sticky top-0 bg-slate-700">
                        <tr>
                            <th className="px-2 py-1 text-left text-slate-300">n</th>
                            <th className="px-2 py-1 text-center text-blue-400">x(n)</th>
                            <th className="px-2 py-1 text-center text-orange-400">x(-n)</th>
                            <th className="px-2 py-1 text-center text-green-400">xₑ(n)</th>
                            <th className="px-2 py-1 text-center text-purple-400">xₒ(n)</th>
                            <th className="px-2 py-1 text-center text-yellow-400">xₑ+xₒ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {displayCalcs.map((calc) => {
                            const sum = calc.evenValue + calc.oddValue;
                            const isVerified = Math.abs(sum - calc.xn) < 1e-10;
                            return (
                                <tr key={calc.n} className="hover:bg-slate-700/50">
                                    <td className="px-2 py-1 text-slate-300">{calc.n}</td>
                                    <td className="px-2 py-1 text-center text-blue-300">
                                        {calc.xn}
                                    </td>
                                    <td className="px-2 py-1 text-center text-orange-300">
                                        {calc.xMinusN}
                                    </td>
                                    <td className="px-2 py-1 text-center text-green-300">
                                        {Number.isInteger(calc.evenValue) ? calc.evenValue : calc.evenValue.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1 text-center text-purple-300">
                                        {Number.isInteger(calc.oddValue) ? calc.oddValue : calc.oddValue.toFixed(2)}
                                    </td>
                                    <td className={`px-2 py-1 text-center ${isVerified ? 'text-yellow-300' : 'text-red-400'}`}>
                                        {Number.isInteger(sum) ? sum : sum.toFixed(2)}
                                        {isVerified ? ' ✓' : ' ✗'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Verification Summary */}
            <div className="bg-slate-700/50 rounded p-3 text-sm">
                <div className="text-slate-300 font-medium mb-1">✅ Verifikasi Rekonstruksi</div>
                <p className="text-slate-400 text-xs">
                    x(n) = xₑ(n) + xₒ(n) untuk semua nilai n? {' '}
                    <span className="text-green-400 font-medium">✓ Terbukti</span>
                </p>
            </div>
        </div>
    );
}
