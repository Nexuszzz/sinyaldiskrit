import { SignalValue } from '../types/signal';
import { getValueAt } from './evaluator';

/**
 * Even/odd signal decomposition
 */
export interface Decomposition {
    even: SignalValue[];
    odd: SignalValue[];
}

export function decomposeEvenOdd(
    samples: SignalValue[],
    nMin: number,
    nMax: number
): Decomposition {
    const even: SignalValue[] = [];
    const odd: SignalValue[] = [];

    for (let n = nMin; n <= nMax; n++) {
        const xn = getValueAt(samples, n);
        const xMinusN = getValueAt(samples, -n);

        const evenValue = (xn + xMinusN) / 2;
        const oddValue = (xn - xMinusN) / 2;

        even.push({ n, value: evenValue });
        odd.push({ n, value: oddValue });
    }

    return { even, odd };
}

/**
 * Calculate signal energy (sum of squared magnitudes)
 */
export function calculateEnergy(samples: SignalValue[]): number {
    return samples.reduce((sum, { value }) => sum + value * value, 0);
}

/**
 * Calculate signal average power
 */
export function calculatePower(samples: SignalValue[]): number {
    if (samples.length === 0) return 0;

    const energy = calculateEnergy(samples);
    return energy / samples.length;
}

/**
 * Verify even/odd decomposition: x = x_even + x_odd
 */
export function verifyDecomposition(
    original: SignalValue[],
    even: SignalValue[],
    odd: SignalValue[]
): boolean {
    if (original.length !== even.length || original.length !== odd.length) {
        return false;
    }

    const tolerance = 1e-10;

    for (let i = 0; i < original.length; i++) {
        const reconstructed = even[i].value + odd[i].value;
        const diff = Math.abs(original[i].value - reconstructed);

        if (diff > tolerance) {
            return false;
        }
    }

    return true;
}
