import React, { useState, useEffect } from 'react';
import { validateExpression } from '../lib/parser';

interface SignalInputProps {
    value: string;
    onChange: (value: string) => void;
    onValidation: (valid: boolean) => void;
}

export function SignalInput({ value, onChange, onValidation }: SignalInputProps) {
    const [showHelp, setShowHelp] = useState(false);
    const [validationError, setValidationError] = useState<string>('');

    useEffect(() => {
        const result = validateExpression(value);
        setValidationError(result.error || '');
        onValidation(result.valid);
    }, [value, onValidation]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300">
                    Signal Expression x(n)
                </label>
                <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                    <span>?</span>
                    <span>Help</span>
                </button>
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g., u(n+2) - u(n-1)"
                className={`w-full px-4 py-3 bg-slate-900 border rounded-lg font-mono text-sm
          ${validationError ? 'border-red-500' : 'border-slate-700'}
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          text-white placeholder-slate-500`}
            />

            {validationError && (
                <div className="text-xs text-red-400 flex items-start gap-2">
                    <span>⚠</span>
                    <span>{validationError}</span>
                </div>
            )}

            {showHelp && (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-xs space-y-2">
                    <div className="font-semibold text-slate-200">Supported Functions:</div>
                    <ul className="space-y-1 text-slate-400">
                        <li><code className="text-blue-400">d(n)</code> - Impulse δ(n): 1 if n=0, else 0</li>
                        <li><code className="text-blue-400">u(n)</code> - Unit step: 1 if n≥0, else 0</li>
                        <li><code className="text-blue-400">r(n)</code> - Ramp: n if n≥0, else 0</li>
                        <li><code className="text-blue-400">a^n</code> - Exponential (e.g., 0.5^n, 2^n)</li>
                    </ul>
                    <div className="font-semibold text-slate-200 pt-2">Examples:</div>
                    <ul className="space-y-1 text-slate-400 font-mono">
                        <li>u(n-2)</li>
                        <li>d(n+3)</li>
                        <li>r(n) - r(n-5)</li>
                        <li>2*u(n-1) - 3*d(n)</li>
                        <li>0.8^n * u(n)</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
