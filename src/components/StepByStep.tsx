import React, { useState } from 'react';
import { ExplanationStep, DecompositionResult } from '../types/signal';

interface StepByStepProps {
    explanation: ExplanationStep;
    decompositionResult?: DecompositionResult | null;
}

export function StepByStep({ explanation, decompositionResult }: StepByStepProps) {
    const [showAll, setShowAll] = useState(true);
    
    // Special rendering for decomposition
    if (decompositionResult) {
        const calculations = showAll 
            ? decompositionResult.calculations 
            : decompositionResult.calculations.filter(c => c.xn !== 0 || c.xMinusN !== 0);
        
        return (
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800">
                    <h3 className="text-base font-bold text-white">
                        📐 {explanation.title}
                    </h3>
                    <div className="mt-1 font-mono text-sm text-blue-400">
                        {explanation.formula}
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Description */}
                    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                        {explanation.description}
                    </div>

                    {/* Decomposition Calculations */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-orange-400 uppercase tracking-wide flex items-center gap-2">
                                <span>📝</span>
                                <span>Perhitungan Dekomposisi:</span>
                            </div>
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                            >
                                {showAll ? 'Hanya Non-Zero' : 'Tampilkan Semua'}
                            </button>
                        </div>
                        
                        {/* Calculation Cards */}
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-80 overflow-y-auto">
                            <div className="space-y-3">
                                {calculations.map((calc, idx) => {
                                    const hasValue = calc.xn !== 0 || calc.xMinusN !== 0;
                                    return (
                                        <div
                                            key={idx}
                                            className={`font-mono text-xs p-3 rounded border-l-4 ${
                                                hasValue 
                                                    ? 'bg-slate-800 border-l-green-500' 
                                                    : 'bg-slate-800/50 border-l-slate-600'
                                            }`}
                                        >
                                            <div className="text-slate-400 mb-1">n = {calc.n}:</div>
                                            <div className="grid grid-cols-1 gap-1 ml-2">
                                                <div>
                                                    <span className="text-blue-400">x({calc.n})</span>
                                                    <span className="text-slate-500"> = </span>
                                                    <span className="text-blue-300">{calc.xn}</span>
                                                    <span className="text-slate-500 mx-2">|</span>
                                                    <span className="text-orange-400">x({-calc.n})</span>
                                                    <span className="text-slate-500"> = </span>
                                                    <span className="text-orange-300">{calc.xMinusN}</span>
                                                </div>
                                                <div>
                                                    <span className="text-green-400">xₑ({calc.n})</span>
                                                    <span className="text-slate-500"> = [{calc.xn}+{calc.xMinusN}]/2 = </span>
                                                    <span className="text-green-300 font-bold">
                                                        {Number.isInteger(calc.evenValue) ? calc.evenValue : calc.evenValue.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-purple-400">xₒ({calc.n})</span>
                                                    <span className="text-slate-500"> = [{calc.xn}-{calc.xMinusN}]/2 = </span>
                                                    <span className="text-purple-300 font-bold">
                                                        {Number.isInteger(calc.oddValue) ? calc.oddValue : calc.oddValue.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Verification */}
                    <div className="text-xs text-slate-500 border-t border-slate-700 pt-3 flex items-center gap-2">
                        <span>✅</span>
                        <span>Verifikasi: xₑ(n) + xₒ(n) = x(n) untuk semua n ✓</span>
                    </div>
                </div>
            </div>
        );
    }
    
    // Regular mode for other operations
    // Filter to show only non-zero results or all
    const calculations = showAll 
        ? explanation.fullCalculations 
        : explanation.fullCalculations.filter(c => c.yValue !== 0);

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800">
                <h3 className="text-base font-bold text-white">
                    📐 {explanation.title}
                </h3>
                {explanation.formula && (
                    <div className="mt-1 font-mono text-lg text-blue-400 font-semibold">
                        {explanation.formula}
                    </div>
                )}
            </div>

            <div className="p-4 space-y-4">
                {/* Description */}
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                    {explanation.description}
                </div>

                {/* Full Calculations Section */}
                {explanation.fullCalculations && explanation.fullCalculations.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-bold text-orange-400 uppercase tracking-wide flex items-center gap-2">
                                <span>📝</span>
                                <span>Cara Perhitungan Lengkap:</span>
                            </div>
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                            >
                                {showAll ? 'Sembunyikan Nol' : 'Tampilkan Semua'}
                            </button>
                        </div>
                        
                        {/* Calculation Cards */}
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 max-h-80 overflow-y-auto">
                            <div className="space-y-2">
                                {calculations.map((calc, idx) => (
                                    <div
                                        key={idx}
                                        className={`font-mono text-sm p-2 rounded border-l-4 ${
                                            calc.yValue !== 0 
                                                ? 'bg-slate-800 border-l-green-500 text-green-300' 
                                                : 'bg-slate-800/50 border-l-slate-600 text-slate-400'
                                        }`}
                                    >
                                        <span className="text-blue-400">y({calc.n})</span>
                                        <span className="text-slate-500"> = </span>
                                        <span className="text-purple-400">x({calc.transformedIndex})</span>
                                        <span className="text-slate-500"> = </span>
                                        <span className="text-yellow-400">x({calc.m})</span>
                                        <span className="text-slate-500"> = </span>
                                        <span className={calc.yValue !== 0 ? 'text-green-400 font-bold' : 'text-slate-500'}>
                                            {calc.yValue}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary of non-zero values */}
                        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg p-3">
                            <div className="text-xs font-semibold text-blue-300 mb-2">
                                📊 Ringkasan Nilai Non-Zero:
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {explanation.fullCalculations
                                    .filter(c => c.yValue !== 0)
                                    .map((calc, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-blue-900/50 rounded text-xs font-mono text-blue-200"
                                        >
                                            y({calc.n})={calc.yValue}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mathematical Notation Reminder */}
                <div className="text-xs text-slate-500 border-t border-slate-700 pt-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>Sinyal waktu-diskrit hanya terdefinisi pada nilai integer n.</span>
                </div>
            </div>
        </div>
    );
}
