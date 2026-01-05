// Signal value at a specific index
export interface SignalValue {
    n: number;
    value: number;
}

// AST Node types for expression parsing
export type ASTNode =
    | { type: 'number'; value: number }
    | { type: 'variable'; name: string }
    | { type: 'unary'; operator: '-'; operand: ASTNode }
    | { type: 'binary'; operator: '+' | '-' | '*' | '/' | '^'; left: ASTNode; right: ASTNode }
    | { type: 'function'; name: string; arg: ASTNode }
    | { type: 'piecewise'; cases: Array<{ condition: ASTNode; value: ASTNode }> };

// Signal definition
export interface Signal {
    expression: string;
    ast: ASTNode | null;
    samples: SignalValue[];
    range: { nMin: number; nMax: number };
}

// Signal operation types
export type OperationType = 'none' | 'shift' | 'fold' | 'scale' | 'compose' | 'decompose' | 'arithmetic';

// Arithmetic operation types for two signals
export type ArithmeticOperationType = 'add' | 'subtract' | 'multiply' | 'convolve';

export interface Operation {
    type: OperationType;
    parameters: {
        k?: number;        // Shift amount
        mu?: number;       // Scaling factor
        expression?: string; // Custom composition expression
        arithmeticOp?: ArithmeticOperationType; // For two-signal operations
        secondSignal?: SignalValue[]; // Second signal for arithmetic operations
    };
}

// Decomposition result for even/odd
export interface DecompositionResult {
    even: SignalValue[];
    odd: SignalValue[];
    calculations: Array<{
        n: number;
        xn: number;
        xMinusN: number;
        evenValue: number;
        oddValue: number;
    }>;
}

// Step-by-step explanation
export interface CalculationStep {
    n: number;
    transformedIndex: string;  // e.g., "-n-2" with n substituted
    m: number;                 // The actual index value
    xValue: number;           // x(m) value
    yValue: number;           // y(n) = x(m) result
}

export interface ExplanationStep {
    title: string;
    description: string;
    formula: string;           // e.g., "y(n) = x(-n-2)"
    examples: Array<{ n: number; calculation: string; result: number }>;
    fullCalculations: CalculationStep[];  // Complete calculations for all n
}

// Example problem
export interface ExampleProblem {
    id: string;
    name: string;
    description: string;
    signal: string;
    operation: Operation;
    nMin: number;
    nMax: number;
}
