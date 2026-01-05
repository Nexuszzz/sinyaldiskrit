import React from 'react';
import { ExampleProblem } from '../types/signal';
import { exampleProblems } from '../examples/problems';

interface ExampleSelectorProps {
    onSelect: (example: ExampleProblem) => void;
}

export function ExampleSelector({ onSelect }: ExampleSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelect = (example: ExampleProblem) => {
        onSelect(example);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 
          rounded-lg text-sm text-slate-300 flex items-center justify-between transition-all"
            >
                <span>📚 Load Example Problem</span>
                <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 
          rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    {exampleProblems.map((example) => (
                        <button
                            key={example.id}
                            onClick={() => handleSelect(example)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors
                border-b border-slate-700 last:border-b-0"
                        >
                            <div className="font-semibold text-sm text-slate-200">
                                {example.name}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                {example.description}
                            </div>
                            <div className="text-xs font-mono text-blue-400 mt-1">
                                {example.signal}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
