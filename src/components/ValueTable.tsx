import React from 'react';
import { SignalValue } from '../types/signal';

interface ValueTableProps {
    inputSamples: SignalValue[];
    outputSamples: SignalValue[];
    maxRows?: number;
}

export function ValueTable({ inputSamples, outputSamples, maxRows = 20 }: ValueTableProps) {
    const combinedSamples = inputSamples.map((input, idx) => ({
        n: input.n,
        xn: input.value,
        yn: outputSamples[idx]?.value || 0,
    }));

    const displaySamples = combinedSamples.slice(0, maxRows);
    const hasMore = combinedSamples.length > maxRows;

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700">
                <h3 className="text-sm font-semibold text-slate-200">Sample Values</h3>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-900 sticky top-0">
                        <tr>
                            <th className="px-4 py-2 text-left text-slate-300 font-semibold">n</th>
                            <th className="px-4 py-2 text-right text-blue-400 font-semibold">x(n)</th>
                            <th className="px-4 py-2 text-right text-orange-400 font-semibold">y(n)</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono">
                        {displaySamples.map(({ n, xn, yn }) => (
                            <tr
                                key={n}
                                className={`border-t border-slate-700 hover:bg-slate-700/50 transition-colors
                  ${n === 0 ? 'bg-slate-700/30' : ''}`}
                            >
                                <td className="px-4 py-2 text-slate-300">{n}</td>
                                <td className="px-4 py-2 text-right text-blue-300">
                                    {xn.toFixed(3)}
                                </td>
                                <td className="px-4 py-2 text-right text-orange-300">
                                    {yn.toFixed(3)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasMore && (
                <div className="px-4 py-2 bg-slate-900 text-xs text-slate-400 text-center border-t border-slate-700">
                    Showing {maxRows} of {combinedSamples.length} samples
                </div>
            )}
        </div>
    );
}
