import { ASTNode, SignalValue } from '../types/signal';

/**
 * Evaluate AST for a specific value of n
 */
export function evaluateAST(ast: ASTNode, n: number): number {
    switch (ast.type) {
        case 'number':
            return ast.value;

        case 'variable':
            if (ast.name === 'n') {
                return n;
            }
            throw new Error(`Unknown variable: ${ast.name}`);

        case 'unary':
            if (ast.operator === '-') {
                return -evaluateAST(ast.operand, n);
            }
            throw new Error(`Unknown unary operator: ${ast.operator}`);

        case 'binary': {
            const left = evaluateAST(ast.left, n);
            const right = evaluateAST(ast.right, n);

            switch (ast.operator) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/':
                    if (right === 0) throw new Error('Division by zero');
                    return left / right;
                case '^': return Math.pow(left, right);
                default:
                    throw new Error(`Unknown binary operator: ${ast.operator}`);
            }
        }

        case 'function':
            return evaluateFunction(ast.name, ast.arg, n);

        case 'piecewise': {
            for (const { condition, value } of ast.cases) {
                if (evaluateAST(condition, n)) {
                    return evaluateAST(value, n);
                }
            }
            return 0; // Default value if no condition matches
        }

        default:
            throw new Error(`Unknown AST node type`);
    }
}

/**
 * Evaluate basic signal functions
 */
function evaluateFunction(name: string, arg: ASTNode, n: number): number {
    const argValue = evaluateAST(arg, n);

    switch (name) {
        case 'd': // Delta/impulse function
            return argValue === 0 ? 1 : 0;

        case 'u': // Unit step function
            return argValue >= 0 ? 1 : 0;

        case 'r': // Ramp function
            return argValue >= 0 ? argValue : 0;

        default:
            throw new Error(`Unknown function: ${name}`);
    }
}

/**
 * Generate signal samples over a range
 */
export function generateSamples(
    ast: ASTNode,
    nMin: number,
    nMax: number
): SignalValue[] {
    const samples: SignalValue[] = [];

    for (let n = nMin; n <= nMax; n++) {
        try {
            const value = evaluateAST(ast, n);
            samples.push({ n, value });
        } catch (error) {
            console.error(`Error evaluating at n=${n}:`, error);
            samples.push({ n, value: 0 });
        }
    }

    return samples;
}

/**
 * Get signal value at a specific index from samples
 */
export function getValueAt(samples: SignalValue[], n: number): number {
    const sample = samples.find(s => s.n === n);
    return sample ? sample.value : 0;
}
