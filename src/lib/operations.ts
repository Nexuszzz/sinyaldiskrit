import { SignalValue, Operation, ExplanationStep, DecompositionResult } from '../types/signal';
import { parseExpression } from './parser';
import { evaluateAST, getValueAt } from './evaluator';

/**
 * Apply even/odd decomposition to input samples
 */
export function applyDecomposition(
    inputSamples: SignalValue[],
    nMin: number,
    nMax: number
): DecompositionResult {
    const even: SignalValue[] = [];
    const odd: SignalValue[] = [];
    const calculations: DecompositionResult['calculations'] = [];

    for (let n = nMin; n <= nMax; n++) {
        const xn = getValueAt(inputSamples, n);
        const xMinusN = getValueAt(inputSamples, -n);

        const evenValue = (xn + xMinusN) / 2;
        const oddValue = (xn - xMinusN) / 2;

        even.push({ n, value: evenValue });
        odd.push({ n, value: oddValue });
        calculations.push({
            n,
            xn,
            xMinusN,
            evenValue,
            oddValue,
        });
    }

    return { even, odd, calculations };
}

/**
 * Apply arithmetic operation between two signals
 */
export function applyArithmeticOperation(
    signal1: SignalValue[],
    signal2: SignalValue[],
    op: 'add' | 'subtract' | 'multiply' | 'convolve',
    nMin: number,
    nMax: number
): { output: SignalValue[], calculations: ArithmeticCalculation[] } {
    const output: SignalValue[] = [];
    const calculations: ArithmeticCalculation[] = [];

    if (op === 'convolve') {
        // Discrete convolution: y(n) = sum over k of x1(k) * x2(n-k)
        // Find actual ranges of both signals
        const x1NonZero = signal1.filter(s => s.value !== 0);
        const x2NonZero = signal2.filter(s => s.value !== 0);
        
        if (x1NonZero.length === 0 || x2NonZero.length === 0) {
            for (let n = nMin; n <= nMax; n++) {
                output.push({ n, value: 0 });
                calculations.push({ n, operation: '0', x1Value: 0, x2Value: 0, result: 0, convolutionTerms: [] });
            }
            return { output, calculations };
        }
        
        const x1Min = Math.min(...x1NonZero.map(s => s.n));
        const x1Max = Math.max(...x1NonZero.map(s => s.n));
        const x2Min = Math.min(...x2NonZero.map(s => s.n));
        const x2Max = Math.max(...x2NonZero.map(s => s.n));
        
        // Convolution output range
        const convMin = x1Min + x2Min;
        const convMax = x1Max + x2Max;
        
        for (let n = Math.min(nMin, convMin); n <= Math.max(nMax, convMax); n++) {
            let sum = 0;
            const terms: { k: number; x1k: number; x2nk: number; product: number }[] = [];
            
            for (let k = x1Min; k <= x1Max; k++) {
                const x1k = getValueAt(signal1, k);
                const x2nk = getValueAt(signal2, n - k);
                const product = x1k * x2nk;
                
                if (x1k !== 0 && x2nk !== 0) {
                    terms.push({ k, x1k, x2nk, product });
                }
                sum += product;
            }
            
            output.push({ n, value: sum });
            calculations.push({
                n,
                operation: `Σ x₁(k)×x₂(${n}-k)`,
                x1Value: 0,
                x2Value: 0,
                result: sum,
                convolutionTerms: terms,
            });
        }
    } else {
        // Point-wise operations: add, subtract, multiply
        for (let n = nMin; n <= nMax; n++) {
            const x1 = getValueAt(signal1, n);
            const x2 = getValueAt(signal2, n);
            let result = 0;
            let opStr = '';

            switch (op) {
                case 'add':
                    result = x1 + x2;
                    opStr = `${x1} + ${x2}`;
                    break;
                case 'subtract':
                    result = x1 - x2;
                    opStr = `${x1} - ${x2}`;
                    break;
                case 'multiply':
                    result = x1 * x2;
                    opStr = `${x1} × ${x2}`;
                    break;
            }

            output.push({ n, value: result });
            calculations.push({
                n,
                operation: opStr,
                x1Value: x1,
                x2Value: x2,
                result,
            });
        }
    }

    return { output, calculations };
}

export interface ArithmeticCalculation {
    n: number;
    operation: string;
    x1Value: number;
    x2Value: number;
    result: number;
    convolutionTerms?: { k: number; x1k: number; x2nk: number; product: number }[];
}

/**
 * Apply signal operation to input samples
 */
export function applyOperation(
    inputSamples: SignalValue[],
    operation: Operation,
    nMin: number,
    nMax: number
): SignalValue[] {
    const outputSamples: SignalValue[] = [];

    for (let n = nMin; n <= nMax; n++) {
        let value = 0;

        switch (operation.type) {
            case 'none':
                value = getValueAt(inputSamples, n);
                break;

            case 'shift':
                // y(n) = x(n - k)
                value = getValueAt(inputSamples, n - (operation.parameters.k || 0));
                break;

            case 'fold':
                // y(n) = x(-n)
                value = getValueAt(inputSamples, -n);
                break;

            case 'scale':
                // y(n) = x(μn)
                const mu = operation.parameters.mu || 1;
                const scaledIndex = mu * n;
                // Only valid if scaledIndex is an integer
                if (Number.isInteger(scaledIndex)) {
                    value = getValueAt(inputSamples, scaledIndex);
                } else {
                    value = 0;
                }
                break;

            case 'compose':
                // y(n) = x(f(n)) where f is custom expression
                if (operation.parameters.expression) {
                    try {
                        const ast = parseExpression(operation.parameters.expression);
                        const transformedN = evaluateAST(ast, n);
                        value = getValueAt(inputSamples, Math.round(transformedN));
                    } catch (error) {
                        console.error('Error in composition:', error);
                        value = 0;
                    }
                }
                break;
        }

        outputSamples.push({ n, value });
    }

    return outputSamples;
}

/**
 * Generate step-by-step explanation for the operation
 */
export function generateExplanation(
    operation: Operation,
    inputSamples: SignalValue[],
    outputSamples: SignalValue[]
): ExplanationStep {
    const examples: Array<{ n: number; calculation: string; result: number }> = [];
    const fullCalculations: Array<{ n: number; transformedIndex: string; m: number; xValue: number; yValue: number }> = [];

    let title = '';
    let description = '';
    let formula = '';

    switch (operation.type) {
        case 'none':
            title = 'Signal Asli (Tanpa Operasi)';
            description = 'Output signal y(n) = x(n) (identitas)';
            formula = 'y(n) = x(n)';
            
            for (const sample of outputSamples) {
                const n = sample.n;
                fullCalculations.push({
                    n,
                    transformedIndex: `${n}`,
                    m: n,
                    xValue: sample.value,
                    yValue: sample.value,
                });
            }
            break;

        case 'shift': {
            const k = operation.parameters.k || 0;
            formula = `y(n) = x(n-${k})`;
            
            if (k > 0) {
                title = `Pergeseran Waktu (Kanan ${k} unit)`;
                description = `Output y(n) = x(n-${k}). Signal ditunda sebanyak ${k} sampel.`;
            } else if (k < 0) {
                title = `Pergeseran Waktu (Kiri ${Math.abs(k)} unit)`;
                description = `Output y(n) = x(n+${Math.abs(k)}). Signal dimajukan sebanyak ${Math.abs(k)} sampel.`;
                formula = `y(n) = x(n+${Math.abs(k)})`;
            } else {
                title = 'Pergeseran Waktu (Tanpa Pergeseran)';
                description = 'Output y(n) = x(n)';
            }

            for (const sample of outputSamples) {
                const n = sample.n;
                const m = n - k;
                const xValue = getValueAt(inputSamples, m);
                fullCalculations.push({
                    n,
                    transformedIndex: `${n}-${k}`,
                    m,
                    xValue,
                    yValue: sample.value,
                });
            }
            break;
        }

        case 'fold':
            title = 'Pencerminan Waktu (Folding)';
            description = 'Output y(n) = x(-n). Signal dicerminkan terhadap n=0.';
            formula = 'y(n) = x(-n)';

            for (const sample of outputSamples) {
                const n = sample.n;
                const m = -n;
                const xValue = getValueAt(inputSamples, m);
                fullCalculations.push({
                    n,
                    transformedIndex: `-${n}`,
                    m,
                    xValue,
                    yValue: sample.value,
                });
            }
            break;

        case 'scale': {
            const mu = operation.parameters.mu || 1;
            formula = `y(n) = x(${mu}n)`;
            
            if (mu > 1) {
                title = `Penskalaan Waktu (Kompresi ${mu}×)`;
                description = `Output y(n) = x(${mu}n). Signal dikompresi sebanyak faktor ${mu}.`;
            } else if (mu < 1 && mu > 0) {
                title = `Penskalaan Waktu (Ekspansi ${1/mu}×)`;
                description = `Output y(n) = x(${mu}n). Signal diekspansi.`;
            } else {
                title = 'Penskalaan Waktu (Tanpa Skala)';
                description = 'Output y(n) = x(n)';
            }

            for (const sample of outputSamples) {
                const n = sample.n;
                const m = mu * n;
                const xValue = Number.isInteger(m) ? getValueAt(inputSamples, m) : 0;
                fullCalculations.push({
                    n,
                    transformedIndex: `${mu}×${n}`,
                    m,
                    xValue,
                    yValue: sample.value,
                });
            }
            break;
        }

        case 'compose': {
            const expr = operation.parameters.expression || 'n';
            title = `Transformasi Komposisi`;
            formula = `y(n) = x(${expr})`;
            
            // Analyze the transformation for description
            let transformDesc = '📐 Langkah transformasi:\n';
            if (expr.includes('-2*n') || expr.includes('-2n')) {
                transformDesc += '• Kompresi waktu 2× (karena koefisien 2)\n';
                transformDesc += '• Refleksi/pencerminan (karena tanda negatif)\n';
            } else if (expr.includes('-n')) {
                transformDesc += '• Refleksi (flip) terhadap n=0\n';
            }
            if (expr.includes('2*n') && !expr.includes('-2*n')) {
                transformDesc += '• Kompresi waktu 2×\n';
            }
            
            const shiftMatch = expr.match(/([+-]\d+)$/);
            if (shiftMatch) {
                const shift = parseInt(shiftMatch[1]);
                if (shift > 0) {
                    transformDesc += `• Geser (pada domain m, bukan n)\n`;
                } else if (shift < 0) {
                    transformDesc += `• Geser (pada domain m, bukan n)\n`;
                }
            }
            
            description = `Output y(n) = x(${expr})\n\n📌 Kaidah Perhitungan:\nUntuk setiap nilai n pada output, hitung m = ${expr}, lalu ambil nilai x(m).\n\n${transformDesc}`;

            for (const sample of outputSamples) {
                const n = sample.n;
                try {
                    const ast = parseExpression(expr);
                    const m = Math.round(evaluateAST(ast, n));
                    const xValue = getValueAt(inputSamples, m);
                    
                    // Format the transformed index expression
                    let transformedIndex = expr.replace(/n/g, `(${n})`);
                    // Simplify display: -(-5) -> +5, etc
                    transformedIndex = transformedIndex.replace(/\(-(-?\d+)\)/g, (_, num) => `(${num})`);
                    
                    fullCalculations.push({
                        n,
                        transformedIndex,
                        m,
                        xValue,
                        yValue: sample.value,
                    });
                } catch {
                    fullCalculations.push({
                        n,
                        transformedIndex: 'error',
                        m: 0,
                        xValue: 0,
                        yValue: 0,
                    });
                }
            }
            break;
        }
    }

    // Generate example calculations (first few non-zero if possible)
    const nonZeroCalcs = fullCalculations.filter(c => c.yValue !== 0);
    const exampleCalcs = nonZeroCalcs.length >= 3 ? nonZeroCalcs.slice(0, 3) : fullCalculations.slice(0, 3);
    
    for (const calc of exampleCalcs) {
        examples.push({
            n: calc.n,
            calculation: `y(${calc.n}) = x(${calc.m}) = ${calc.yValue}`,
            result: calc.yValue,
        });
    }

    return { title, description, formula, examples, fullCalculations };
}
