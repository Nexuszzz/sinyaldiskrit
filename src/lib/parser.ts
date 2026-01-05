import { ASTNode } from '../types/signal';

/**
 * Parse a signal expression into an Abstract Syntax Tree (AST)
 * Supports: d(n), u(n), r(n), exponentials, arithmetic operations
 * Does NOT use eval() for security
 */
export function parseExpression(expression: string): ASTNode {
    const tokens = tokenize(expression);
    const { ast } = parseExpr(tokens, 0);
    return ast;
}

interface Token {
    type: 'number' | 'variable' | 'operator' | 'function' | 'lparen' | 'rparen' | 'comma' | 'semicolon';
    value: string;
}

function tokenize(expr: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    // Remove whitespace
    expr = expr.replace(/\s+/g, '');

    while (i < expr.length) {
        // Numbers (including decimals)
        if (/\d/.test(expr[i]) || (expr[i] === '.' && /\d/.test(expr[i + 1]))) {
            let num = '';
            while (i < expr.length && /[\d.]/.test(expr[i])) {
                num += expr[i++];
            }
            tokens.push({ type: 'number', value: num });
            continue;
        }

        // Variable 'n'
        if (expr[i] === 'n') {
            tokens.push({ type: 'variable', value: 'n' });
            i++;
            continue;
        }

        // Functions: d, u, r, pw (piecewise)
        if (/[a-z]/.test(expr[i])) {
            let name = '';
            while (i < expr.length && /[a-z]/.test(expr[i])) {
                name += expr[i++];
            }
            if (name !== 'n') {
                tokens.push({ type: 'function', value: name });
            } else {
                tokens.push({ type: 'variable', value: 'n' });
            }
            continue;
        }

        // Operators
        if ('+-*/^'.includes(expr[i])) {
            tokens.push({ type: 'operator', value: expr[i] });
            i++;
            continue;
        }

        // Parentheses
        if (expr[i] === '(') {
            tokens.push({ type: 'lparen', value: '(' });
            i++;
            continue;
        }
        if (expr[i] === ')') {
            tokens.push({ type: 'rparen', value: ')' });
            i++;
            continue;
        }

        // Comma and semicolon for piecewise
        if (expr[i] === ',') {
            tokens.push({ type: 'comma', value: ',' });
            i++;
            continue;
        }
        if (expr[i] === ';') {
            tokens.push({ type: 'semicolon', value: ';' });
            i++;
            continue;
        }

        throw new Error(`Unexpected character: ${expr[i]}`);
    }

    return tokens;
}

// Recursive descent parser
function parseExpr(tokens: Token[], pos: number): { ast: ASTNode; pos: number } {
    return parseAddSub(tokens, pos);
}

function parseAddSub(tokens: Token[], pos: number): { ast: ASTNode; pos: number } {
    let { ast: left, pos: newPos } = parseMulDiv(tokens, pos);

    while (newPos < tokens.length && tokens[newPos].type === 'operator' &&
        (tokens[newPos].value === '+' || tokens[newPos].value === '-')) {
        const operator = tokens[newPos].value as '+' | '-';
        newPos++;
        const { ast: right, pos: nextPos } = parseMulDiv(tokens, newPos);
        left = { type: 'binary', operator, left, right };
        newPos = nextPos;
    }

    return { ast: left, pos: newPos };
}

function parseMulDiv(tokens: Token[], pos: number): { ast: ASTNode; pos: number } {
    let { ast: left, pos: newPos } = parsePower(tokens, pos);

    while (newPos < tokens.length && tokens[newPos].type === 'operator' &&
        (tokens[newPos].value === '*' || tokens[newPos].value === '/')) {
        const operator = tokens[newPos].value as '*' | '/';
        newPos++;
        const { ast: right, pos: nextPos } = parsePower(tokens, newPos);
        left = { type: 'binary', operator, left, right };
        newPos = nextPos;
    }

    return { ast: left, pos: newPos };
}

function parsePower(tokens: Token[], pos: number): { ast: ASTNode; pos: number } {
    let { ast: left, pos: newPos } = parseUnary(tokens, pos);

    if (newPos < tokens.length && tokens[newPos].type === 'operator' &&
        tokens[newPos].value === '^') {
        newPos++;
        const { ast: right, pos: nextPos } = parsePower(tokens, newPos); // Right associative
        left = { type: 'binary', operator: '^', left, right };
        newPos = nextPos;
    }

    return { ast: left, pos: newPos };
}

function parseUnary(tokens: Token[], pos: number): { ast: ASTNode; pos: number } {
    if (pos < tokens.length && tokens[pos].type === 'operator' && tokens[pos].value === '-') {
        pos++;
        const { ast: operand, pos: newPos } = parseUnary(tokens, pos);
        return { ast: { type: 'unary', operator: '-', operand }, pos: newPos };
    }

    return parsePrimary(tokens, pos);
}

function parsePrimary(tokens: Token[], pos: number): { ast: ASTNode; pos: number } {
    if (pos >= tokens.length) {
        throw new Error('Unexpected end of expression');
    }

    const token = tokens[pos];

    // Number
    if (token.type === 'number') {
        return { ast: { type: 'number', value: parseFloat(token.value) }, pos: pos + 1 };
    }

    // Variable
    if (token.type === 'variable') {
        return { ast: { type: 'variable', name: token.value }, pos: pos + 1 };
    }

    // Function
    if (token.type === 'function') {
        const funcName = token.value;
        pos++;

        if (pos >= tokens.length || tokens[pos].type !== 'lparen') {
            throw new Error(`Expected '(' after function ${funcName}`);
        }
        pos++; // Skip '('

        const { ast: arg, pos: newPos } = parseExpr(tokens, pos);

        if (newPos >= tokens.length || tokens[newPos].type !== 'rparen') {
            throw new Error(`Expected ')' after function argument`);
        }

        return { ast: { type: 'function', name: funcName, arg }, pos: newPos + 1 };
    }

    // Parenthesized expression
    if (token.type === 'lparen') {
        pos++;
        const { ast, pos: newPos } = parseExpr(tokens, pos);

        if (newPos >= tokens.length || tokens[newPos].type !== 'rparen') {
            throw new Error('Expected closing parenthesis');
        }

        return { ast, pos: newPos + 1 };
    }

    throw new Error(`Unexpected token: ${token.value}`);
}

/**
 * Validate expression syntax
 */
export function validateExpression(expression: string): { valid: boolean; error?: string } {
    try {
        parseExpression(expression);
        return { valid: true };
    } catch (error) {
        return { valid: false, error: (error as Error).message };
    }
}
