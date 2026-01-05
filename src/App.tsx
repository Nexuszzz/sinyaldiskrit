import { useState } from 'react';
import { SignalInput } from './components/SignalInput';
import { CustomSignalInput } from './components/CustomSignalInput';
import { SecondSignalInput } from './components/SecondSignalInput';
import { OperationControls } from './components/OperationControls';
import { SignalPlot } from './components/SignalPlot';
import { ValueTable } from './components/ValueTable';
import { StepByStep } from './components/StepByStep';
import { ExampleSelector } from './components/ExampleSelector';
import { DecompositionTable } from './components/DecompositionTable';
import { ArithmeticTable } from './components/ArithmeticTable';
import { Operation, SignalValue, ExplanationStep, ExampleProblem, DecompositionResult } from './types/signal';
import { parseExpression } from './lib/parser';
import { generateSamples } from './lib/evaluator';
import { applyOperation, generateExplanation, applyDecomposition, applyArithmeticOperation, ArithmeticCalculation } from './lib/operations';

type InputMode = 'expression' | 'custom';

function App() {
    const [inputMode, setInputMode] = useState<InputMode>('expression');
    const [signalExpression, setSignalExpression] = useState('u(n+2) - u(n-1)');
    const [isValidExpression, setIsValidExpression] = useState(true);
    const [customSamples, setCustomSamples] = useState<SignalValue[]>([]);
    const [secondSignal, setSecondSignal] = useState<SignalValue[]>([]);
    const [operation, setOperation] = useState<Operation>({ type: 'none', parameters: {} });
    const [nMin, setNMin] = useState(-10);
    const [nMax, setNMax] = useState(10);
    const [inputSamples, setInputSamples] = useState<SignalValue[]>([]);
    const [outputSamples, setOutputSamples] = useState<SignalValue[]>([]);
    const [explanation, setExplanation] = useState<ExplanationStep>({
        title: 'Belum Ada Operasi',
        description: 'Klik "Simulate" untuk menghasilkan signal dan menerapkan operasi.',
        formula: '',
        examples: [],
        fullCalculations: [],
    });
    const [hasSimulated, setHasSimulated] = useState(false);
    const [decompositionResult, setDecompositionResult] = useState<DecompositionResult | null>(null);
    const [arithmeticResult, setArithmeticResult] = useState<ArithmeticCalculation[] | null>(null);

    // Check if ready to simulate based on input mode and operation type
    const canSimulate = () => {
        const hasSignal1 = inputMode === 'expression' ? isValidExpression : customSamples.length > 0;
        if (operation.type === 'arithmetic') {
            return hasSignal1 && secondSignal.length > 0 && operation.parameters.arithmeticOp;
        }
        return hasSignal1;
    };

    const handleSimulate = () => {
        if (!canSimulate()) {
            if (operation.type === 'arithmetic') {
                if (!operation.parameters.arithmeticOp) {
                    alert('Pilih jenis operasi aritmatika terlebih dahulu!');
                } else if (secondSignal.length === 0) {
                    alert('Tambahkan signal kedua untuk operasi aritmatika!');
                } else {
                    alert('Pastikan signal pertama sudah valid!');
                }
            } else if (inputMode === 'expression') {
                alert('Please fix the expression errors before simulating.');
            } else {
                alert('Tambahkan minimal satu sampel signal terlebih dahulu!');
            }
            return;
        }

        try {
            let samples: SignalValue[];
            
            if (inputMode === 'expression') {
                // Parse and generate input signal from expression
                const ast = parseExpression(signalExpression);
                
                // For transformations, we need a wider range for input samples
                let inputNMin = nMin;
                let inputNMax = nMax;
                
                if (operation.type === 'decompose') {
                    const maxAbs = Math.max(Math.abs(nMin), Math.abs(nMax));
                    inputNMin = -maxAbs;
                    inputNMax = maxAbs;
                } else if (operation.type === 'compose' && operation.parameters.expression) {
                    const extend = Math.max(Math.abs(nMin), Math.abs(nMax)) + 10;
                    inputNMin = Math.min(nMin, -extend);
                    inputNMax = Math.max(nMax, extend);
                } else if (operation.type === 'fold') {
                    const maxAbs = Math.max(Math.abs(nMin), Math.abs(nMax));
                    inputNMin = -maxAbs;
                    inputNMax = maxAbs;
                } else if (operation.type === 'scale' && operation.parameters.mu) {
                    const mu = Math.abs(operation.parameters.mu);
                    inputNMin = Math.floor(nMin * mu) - 5;
                    inputNMax = Math.ceil(nMax * mu) + 5;
                } else if (operation.type === 'shift' && operation.parameters.k) {
                    const k = operation.parameters.k;
                    inputNMin = nMin - Math.abs(k) - 5;
                    inputNMax = nMax + Math.abs(k) + 5;
                }
                
                samples = generateSamples(ast, inputNMin, inputNMax);
            } else {
                // Use custom samples - extend range if needed for operations
                samples = [...customSamples];
                
                // For operations that need wider range, fill with zeros
                let inputNMin = nMin;
                let inputNMax = nMax;
                
                if (operation.type === 'decompose') {
                    const maxAbs = Math.max(Math.abs(nMin), Math.abs(nMax));
                    inputNMin = -maxAbs;
                    inputNMax = maxAbs;
                } else if (operation.type === 'compose' && operation.parameters.expression) {
                    const extend = Math.max(Math.abs(nMin), Math.abs(nMax)) + 10;
                    inputNMin = Math.min(nMin, -extend);
                    inputNMax = Math.max(nMax, extend);
                } else if (operation.type === 'fold') {
                    const maxAbs = Math.max(Math.abs(nMin), Math.abs(nMax));
                    inputNMin = -maxAbs;
                    inputNMax = maxAbs;
                } else if (operation.type === 'scale' && operation.parameters.mu) {
                    const mu = Math.abs(operation.parameters.mu);
                    inputNMin = Math.floor(nMin * mu) - 5;
                    inputNMax = Math.ceil(nMax * mu) + 5;
                } else if (operation.type === 'shift' && operation.parameters.k) {
                    const k = operation.parameters.k;
                    inputNMin = nMin - Math.abs(k) - 5;
                    inputNMax = nMax + Math.abs(k) + 5;
                }
                
                // Fill missing n values with 0
                const extendedSamples: SignalValue[] = [];
                for (let n = inputNMin; n <= inputNMax; n++) {
                    const existing = samples.find(s => s.n === n);
                    extendedSamples.push({ n, value: existing?.value || 0 });
                }
                samples = extendedSamples;
            }
            
            // For display: show the original signal with appropriate range
            const nonZeroSamples = samples.filter(s => s.value !== 0);
            let displayMin = nMin;
            let displayMax = nMax;
            if (nonZeroSamples.length > 0) {
                displayMin = Math.min(nonZeroSamples[0].n - 1, nMin);
                displayMax = Math.max(nonZeroSamples[nonZeroSamples.length - 1].n + 1, nMax);
            }
            setInputSamples(samples.filter(s => s.n >= displayMin && s.n <= displayMax));

            // Handle arithmetic operations
            if (operation.type === 'arithmetic' && operation.parameters.arithmeticOp) {
                // Extend second signal with zeros
                const extendedSecond: SignalValue[] = [];
                for (let n = displayMin; n <= displayMax; n++) {
                    const existing = secondSignal.find(s => s.n === n);
                    extendedSecond.push({ n, value: existing?.value || 0 });
                }
                
                const { output, calculations } = applyArithmeticOperation(
                    samples,
                    extendedSecond,
                    operation.parameters.arithmeticOp,
                    nMin,
                    nMax
                );
                
                setOutputSamples(output);
                setArithmeticResult(calculations);
                setDecompositionResult(null);
                
                // Generate explanation for arithmetic
                const opNames: Record<string, string> = {
                    add: 'Penjumlahan',
                    subtract: 'Pengurangan',
                    multiply: 'Perkalian (Point-wise)',
                    convolve: 'Konvolusi Diskrit',
                };
                const opFormulas: Record<string, string> = {
                    add: 'y(n) = x₁(n) + x₂(n)',
                    subtract: 'y(n) = x₁(n) - x₂(n)',
                    multiply: 'y(n) = x₁(n) × x₂(n)',
                    convolve: 'y(n) = Σₖ x₁(k) × x₂(n-k)',
                };
                
                setExplanation({
                    title: `Operasi Aritmatika: ${opNames[operation.parameters.arithmeticOp]}`,
                    description: operation.parameters.arithmeticOp === 'convolve' 
                        ? `Konvolusi diskrit antara dua signal.

📐 Rumus: y(n) = x₁(n) * x₂(n) = Σₖ x₁(k) × x₂(n-k)

📌 Sifat Konvolusi:
• Komutatif: x₁ * x₂ = x₂ * x₁
• Asosiatif: (x₁ * x₂) * x₃ = x₁ * (x₂ * x₃)
• Distributif: x₁ * (x₂ + x₃) = x₁*x₂ + x₁*x₃

💡 Konvolusi menghasilkan signal dengan panjang N₁ + N₂ - 1`
                        : `Operasi ${opNames[operation.parameters.arithmeticOp]} dilakukan titik-per-titik pada setiap nilai n.

📐 Rumus: ${opFormulas[operation.parameters.arithmeticOp]}

📌 Catatan:
• Operasi dilakukan untuk setiap nilai n yang sama
• Jika signal tidak memiliki nilai pada n tertentu, diasumsikan 0`,
                    formula: opFormulas[operation.parameters.arithmeticOp],
                    examples: [],
                    fullCalculations: [],
                });
            }
            // Handle decomposition separately
            else if (operation.type === 'decompose') {
                const decomp = applyDecomposition(samples, nMin, nMax);
                setDecompositionResult(decomp);
                setOutputSamples([]);
                setArithmeticResult(null);
                
                setExplanation({
                    title: 'Dekomposisi Genap/Ganjil (Even/Odd)',
                    description: `Signal x(n) didekomposisi menjadi bagian genap xₑ(n) dan ganjil xₒ(n).

📐 Rumus:
• xₑ(n) = [x(n) + x(-n)] / 2  (komponen genap)
• xₒ(n) = [x(n) - x(-n)] / 2  (komponen ganjil)

📌 Sifat:
• xₑ(n) = xₑ(-n) (simetri terhadap n=0)
• xₒ(n) = -xₒ(-n) (antisimetri terhadap n=0)
• x(n) = xₑ(n) + xₒ(n) (verifikasi rekonstruksi)`,
                    formula: 'xₑ(n) = [x(n) + x(-n)]/2, xₒ(n) = [x(n) - x(-n)]/2',
                    examples: [],
                    fullCalculations: [],
                });
            } else {
                setDecompositionResult(null);
                setArithmeticResult(null);
                
                const output = applyOperation(samples, operation, nMin, nMax);
                setOutputSamples(output);

                const exp = generateExplanation(operation, samples, output);
                setExplanation(exp);
            }

            setHasSimulated(true);
        } catch (error) {
            alert(`Error: ${(error as Error).message}`);
        }
    };

    const handleExampleSelect = (example: ExampleProblem) => {
        setInputMode('expression');
        setSignalExpression(example.signal);
        setOperation(example.operation);
        setNMin(example.nMin);
        setNMax(example.nMax);
        setHasSimulated(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                        Discrete-Time Signal Simulator
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Visualize and analyze discrete-time signals with step-by-step explanations
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Input & Controls */}
                    <div className="space-y-6">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6">
                            {/* Input Mode Tabs */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-300">
                                    Input Signal Mode
                                </label>
                                <div className="flex rounded-lg overflow-hidden border border-slate-600">
                                    <button
                                        onClick={() => setInputMode('expression')}
                                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                            inputMode === 'expression'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                    >
                                        📝 Persamaan
                                    </button>
                                    <button
                                        onClick={() => setInputMode('custom')}
                                        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                            inputMode === 'custom'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                    >
                                        ✏️ Custom
                                    </button>
                                </div>
                            </div>

                            {/* Conditional Input based on mode */}
                            {inputMode === 'expression' ? (
                                <>
                                    <SignalInput
                                        value={signalExpression}
                                        onChange={setSignalExpression}
                                        onValidation={setIsValidExpression}
                                    />
                                    <ExampleSelector onSelect={handleExampleSelect} />
                                </>
                            ) : (
                                <CustomSignalInput
                                    samples={customSamples}
                                    onChange={setCustomSamples}
                                />
                            )}

                            <div className="border-t border-slate-700 pt-6">
                                <OperationControls
                                    operation={operation}
                                    onChange={setOperation}
                                    nMin={nMin}
                                    nMax={nMax}
                                    onRangeChange={(min, max) => {
                                        setNMin(min);
                                        setNMax(max);
                                    }}
                                />
                            </div>

                            {/* Second Signal Input for Arithmetic Operations */}
                            {operation.type === 'arithmetic' && (
                                <SecondSignalInput
                                    samples={secondSignal}
                                    onChange={setSecondSignal}
                                />
                            )}

                            <button
                                onClick={handleSimulate}
                                disabled={!canSimulate()}
                                className={`w-full py-3 rounded-lg font-semibold text-lg shadow-lg transition-all
                  ${canSimulate()
                                        ? 'bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-500 hover:to-orange-500 shadow-blue-500/30'
                                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                🚀 Simulate
                            </button>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-xs text-slate-400 space-y-2">
                            <div className="font-semibold text-slate-300">Quick Tips:</div>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Use <code className="text-blue-400">d(n)</code> for impulse (δ)</li>
                                <li>Use <code className="text-blue-400">u(n)</code> for unit step</li>
                                <li>Use <code className="text-blue-400">r(n)</code> for ramp</li>
                                <li>Mode <code className="text-green-400">Custom</code>: input nilai signal manual</li>
                                <li><code className="text-orange-400">Arithmetic</code>: operasi 2 signal</li>
                            </ul>
                        </div>
                    </div>

                    {/* Center Panel - Plot */}
                    <div className="lg:col-span-2 space-y-6">
                        {hasSimulated ? (
                            <>
                                <SignalPlot
                                    inputSamples={inputSamples}
                                    outputSamples={outputSamples}
                                    showBoth={operation.type !== 'none' && operation.type !== 'decompose'}
                                    decompositionResult={decompositionResult}
                                    secondSignal={operation.type === 'arithmetic' ? secondSignal : undefined}
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {operation.type === 'decompose' && decompositionResult ? (
                                        <DecompositionTable decompositionResult={decompositionResult} />
                                    ) : operation.type === 'arithmetic' && arithmeticResult ? (
                                        <ArithmeticTable 
                                            calculations={arithmeticResult} 
                                            operationType={operation.parameters.arithmeticOp!} 
                                        />
                                    ) : (
                                        <ValueTable
                                            inputSamples={inputSamples}
                                            outputSamples={outputSamples}
                                        />
                                    )}

                                    <StepByStep 
                                        explanation={explanation} 
                                        decompositionResult={operation.type === 'decompose' ? decompositionResult : null}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
                                <div className="text-6xl mb-4">📊</div>
                                <h2 className="text-xl font-semibold text-slate-300 mb-2">
                                    Ready to Simulate
                                </h2>
                                <p className="text-slate-400">
                                    Configure your signal and operation, then click "Simulate" to see the results.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-slate-800 text-center text-xs text-slate-500">
                <p>Discrete-Time Signal Simulator | Built with React + TypeScript + Plotly.js</p>
            </footer>
        </div>
    );
}

export default App;
