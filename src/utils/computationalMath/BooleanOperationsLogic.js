import Stack from "../dataStructures/Stack.js";

export function NOT(a) {
    return !a;
}

export function AND(a, b) {
    return a && b;  
}

export function OR(a, b) {
    return a || b;
}

export function XOR(a, b) {
    return (a || b) && !(a && b);
}

export function IMPLICATION(a, b) {
    return !a || b;
}

export function BICONDITIONAL(a, b) {
    return a === b;
}

export function NAND(a, b) {
    return !(a && b);
}

export function NOR(a, b) {
    return !(a || b);
}

const SYMBOL_MAP = {
    '¬': '!',
    '∧': '&&',
    '∨': '||',
    '⊻': '^',
    '→': '->',
    '↔': '<->',
};

const PREC = {
    '!':   4,
    '&&':  3,
    '^':   3, // XOR — mesma precedência do AND
    '||':  2,
    '->':  1,
    '<->': 0,
};

function tokenize(expression) {
    const tokens = [];
    let i = 0;

    while (i < expression.length) {
        const char = expression[i];

        if (char === ' ') { i++; continue; }

        if (char === '(' || char === ')') {
            tokens.push(char);
            i++;
            continue;
        }

        // símbolos unicode → converte pro token interno
        if (char in SYMBOL_MAP) {
            tokens.push(SYMBOL_MAP[char]);
            i++;
            continue;
        }

        // operadores textuais — checar multi-char antes de single-char
        if (expression.slice(i, i + 3) === '<->') { tokens.push('<->'); i += 3; continue; }
        if (expression.slice(i, i + 2) === '&&')  { tokens.push('&&');  i += 2; continue; }
        if (expression.slice(i, i + 2) === '||')  { tokens.push('||');  i += 2; continue; }
        if (expression.slice(i, i + 2) === '->')  { tokens.push('->');  i += 2; continue; }
        if (char === '!')                          { tokens.push('!');   i++;    continue; }
        if (char === '~')                          { tokens.push('!');   i++;    continue; }
        if (char === '^')                          { tokens.push('^');   i++;    continue; }

        if (/^[A-Z]$/.test(char)) {
            tokens.push(char);
            i++;
            continue;
        }

        throw new Error(`Token inválido: "${char}"`);
    }

    return tokens;
}

function toPostfix(tokens) {
    const opstack = new Stack();
    const postfix = [];

    for (const token of tokens) {
        if (/^[A-Z]$/.test(token)) {
            postfix.push(token);

        } else if (token === '(') {
            opstack.push(token);

        } else if (token === ')') {
            while (!opstack.isEmpty() && opstack.peek() !== '(') {
                postfix.push(opstack.pop());
            }
            if (opstack.isEmpty()) throw new Error('Parênteses desbalanceados');
            opstack.pop();

        } else {
            while (
                !opstack.isEmpty() &&
                opstack.peek() !== '(' &&
                PREC[opstack.peek()] >= PREC[token]
            ) {
                postfix.push(opstack.pop());
            }
            opstack.push(token);
        }
    }

    while (!opstack.isEmpty()) {
        const op = opstack.pop();
        if (op === '(') throw new Error('Parênteses desbalanceados');
        postfix.push(op);
    }

    return postfix;
}

function evaluate(postfix, values) {
    const stack = new Stack();

    for (const token of postfix) {
        if (/^[A-Z]$/.test(token)) {
            stack.push(values[token]);

        } else if (token === '!') {
            stack.push(NOT(stack.pop()));

        } else {
            const b = stack.pop();
            const a = stack.pop();
            if      (token === '&&')  stack.push(AND(a, b));
            else if (token === '||')  stack.push(OR(a, b));
            else if (token === '^')   stack.push(XOR(a, b));
            else if (token === '->')  stack.push(IMPLICATION(a, b));
            else if (token === '<->') stack.push(BICONDITIONAL(a, b));
        }
    }

    return stack.pop();
}

export function booleanExpressionSolver({ expression, variableTruthTable }) {
    // variableTruthTable = [["A", "B"], ["F", "F"], ["F", "T"], ["T", "F"], ["T", "T"]]

    const PREPOSITIONS = variableTruthTable[0];
    const VALUES = variableTruthTable.slice(1);

    const tokens = tokenize(expression);
    const postfix = toPostfix(tokens);

    const results = VALUES.map(row => {
        const values = {};
        PREPOSITIONS.forEach((prop, i) => {
            values[prop] = row[i] === 'T';
        });
        return evaluate(postfix, values);
    });

    return results;
}