import determinant from './determinant';
import { validateSquareMatrix, formatMatrixResult, MAX_MATRIX_ORDER } from './square';

// Bounds are presentation budgets, not additional restrictions on valid inputs.
const INPUT_DIGITS = 64;
const EXPONENT_LIMIT = 80;
const RATIONAL_DIGITS = 256;
const DISPLAY_DIGITS = 80;
const gcd = (a, b) => {
    a = a < 0n ? -a : a;
    while (b) [a, b] = [b, a % b];
    return a;
};
function rational(n, d = 1n) {
    if (d < 0n) [n, d] = [-n, -d];
    const divisor = gcd(n, d);
    const value = { n: n / divisor, d: d / divisor };
    if (String(value.n).length > RATIONAL_DIGITS || String(value.d).length > RATIONAL_DIGITS) throw new Error('budget');
    return value;
}
function decimal(text) {
    const match = text.trim().match(/^([+-]?)(\d*(?:\.\d*)?)(?:e([+-]?\d+))?$/i);
    if (!match || text.length > 160) throw new Error('budget');
    const digits = match[2].replace('.', '');
    const exponent = Number(match[3] || 0);
    if (digits.length > INPUT_DIGITS || Math.abs(exponent) > EXPONENT_LIMIT) throw new Error('budget');
    const scale = (match[2].split('.')[1]?.length || 0) - exponent;
    const n = BigInt(digits) * (match[1] === '-' ? -1n : 1n);
    return scale >= 0 ? rational(n, 10n ** BigInt(scale)) : rational(n * 10n ** BigInt(-scale));
}
function parseExact(value) {
    const text = String(value).trim().replace(',', '.');
    if (text.length > 320) throw new Error('budget');
    const [numerator, denominator] = text.split('/');
    const a = decimal(numerator);
    if (denominator === undefined) return a;
    const b = decimal(denominator);
    return rational(a.n * b.d, a.d * b.n);
}
const exactOps = {
    multiply: (a, b) => rational(a.n * b.n, a.d * b.d),
    add: (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d),
    subtract: (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d),
};
const floatOps = { multiply: (a, b) => a * b, add: (a, b) => a + b, subtract: (a, b) => a - b };
const numberOf = value => typeof value === 'number' ? value : Number(value.n) / Number(value.d);
function smallCalculation(data, ops) {
    const n = data.length;
    if (n === 1) return { value: data[0][0], positive: [], negative: [], scale: Math.abs(numberOf(data[0][0])) };
    const terms = n === 2 ? [[[0, 0], [1, 1]], [[0, 1], [1, 0]]] : [
        [[0, 0], [1, 1], [2, 2]], [[0, 1], [1, 2], [2, 0]], [[0, 2], [1, 0], [2, 1]],
        [[0, 2], [1, 1], [2, 0]], [[0, 0], [1, 2], [2, 1]], [[0, 1], [1, 0], [2, 2]],
    ];
    const products = terms.map(indices => {
        const factors = indices.map(([r, c]) => data[r][c]);
        return { factors, value: factors.reduce(ops.multiply) };
    });
    const split = products.length / 2;
    const positive = products.slice(0, split);
    const negative = products.slice(split);
    const positiveSum = positive.map(term => term.value).reduce(ops.add);
    const negativeSum = negative.map(term => term.value).reduce(ops.add);
    return { positive, negative, positiveSum, negativeSum, value: ops.subtract(positiveSum, negativeSum),
        scale: products.reduce((sum, term) => sum + Math.abs(numberOf(term.value)), 0) };
}
function displayable(calculation, data) {
    const values = [...data.flat(), calculation.value, ...calculation.positive.map(t => t.value),
        ...calculation.negative.map(t => t.value)];
    if (data.length > 1) values.push(calculation.positiveSum, calculation.negativeSum);
    return values.every(v => String(v.n).length <= DISPLAY_DIGITS && String(v.d).length <= DISPLAY_DIGITS);
}
export function formatDeterminantValue(value, locale) {
    if (typeof value !== 'number') return value.d === 1n ? String(value.n) : `${value.n}/${value.d}`;
    const text = formatMatrixResult(value, locale);
    return locale === 'pt' ? text.replace('.', ',') : text;
}
function texValue(value, locale) {
    if (typeof value !== 'number') return value.d === 1n ? String(value.n) : `\\frac{${value.n}}{${value.d}}`;
    return formatDeterminantValue(value, locale).replace(',', '{,}').replace(/e([+-]?\d+)$/i, '\\times 10^{$1}');
}
function equations(calculation, order, exact, locale) {
    const relation = exact ? '=' : '\\approx';
    const value = v => texValue(v, locale);
    const factor = v => numberOf(v) < 0 ? `\\left(${value(v)}\\right)` : value(v);
    const products = terms => terms.map(term => `${term.factors.map(factor).join(' \\times ')} ${relation} ${value(term.value)}`);
    const final = `\\det(A) ${relation} ${value(calculation.value)}`;
    if (order === 1) return [{ key: 'single', equations: [final] }];
    if (order === 2) return [
        { key: 'twoProducts', equations: products([...calculation.positive, ...calculation.negative]) },
        { key: 'difference', equations: [`\\det(A) ${relation} ${factor(calculation.positiveSum)} - ${factor(calculation.negativeSum)} ${relation} ${value(calculation.value)}`] },
    ];
    return [
        { key: 'positiveProducts', equations: products(calculation.positive) },
        { key: 'negativeProducts', equations: products(calculation.negative) },
        { key: 'sums', equations: [
            `S_{+} ${relation} ${calculation.positive.map(t => factor(t.value)).join(' + ')} ${relation} ${value(calculation.positiveSum)}`,
            `S_{-} ${relation} ${calculation.negative.map(t => factor(t.value)).join(' + ')} ${relation} ${value(calculation.negativeSum)}`,
        ] },
        { key: 'difference', equations: [`\\det(A) ${relation} ${factor(calculation.positiveSum)} - ${factor(calculation.negativeSum)} ${relation} ${value(calculation.value)}`] },
    ];
}

function rejectTextualUnderflow(rawMatrix) {
    // Inspect the significand only: exponent digits do not make literal zero
    // nonzero. Keep this guard local; the shared parser/inverse API is unchanged.
    const token = /^[+-]?(\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
    for (const row of Array.isArray(rawMatrix.data) ? rawMatrix.data : []) {
        if (!Array.isArray(row)) continue;
        for (const value of row) {
            const parts = String(value).trim().replace(',', '.').split('/');
            if (parts.length > 2) continue;
            for (const part of parts) {
                const text = part.trim();
                const match = text.match(token);
                if (match && /[1-9]/.test(match[1]) && Number(text) === 0) throw new Error('numericLimit');
            }
        }
    }
}

export function determinantPresentation(rawMatrix, locale = 'en') {
    rejectTextualUnderflow(rawMatrix);
    const matrix = validateSquareMatrix(rawMatrix);
    const algorithm = determinant(matrix, { numeric: true });
    if (matrix.rows > 3) return { exact: false, relation: '≈', value: algorithm,
        display: formatDeterminantValue(algorithm, locale), zero: algorithm === 0, steps: [], order: matrix.rows };
    let calculation;
    let exact = false;
    try {
        const data = rawMatrix.data.map(row => row.map(parseExact));
        calculation = smallCalculation(data, exactOps);
        if (!displayable(calculation, data)) throw new Error('budget');
        exact = true;
    } catch {
        calculation = smallCalculation(matrix.data, floatOps);
    }
    const numeric = numberOf(calculation.value);
    // Absolute forward-error budget based on product magnitudes, not on the
    // possibly tiny cancelled determinant. Never turn a small result into zero.
    const tolerance = Number.EPSILON * 256 * Math.max(calculation.scale, Math.abs(algorithm), Number.MIN_VALUE);
    if (!Number.isFinite(numeric) || Math.abs(numeric - algorithm) > tolerance) throw new Error('unstable');
    return { exact, relation: exact ? '=' : '≈', value: numeric,
        display: formatDeterminantValue(calculation.value, locale), zero: exact ? calculation.value.n === 0n : numeric === 0,
        steps: equations(calculation, matrix.rows, exact, locale), order: matrix.rows, algorithm, tolerance };
}

// A shared state boundary makes pending/invalid input discard all stale steps.
export function determinantState(rawMatrix, sizeInput, locale = 'en') {
    try {
        const order = Number(sizeInput);
        if (!Number.isInteger(order) || order < 1 || order > MAX_MATRIX_ORDER) throw new Error('invalidOrder');
        if (order !== rawMatrix.rows) throw new Error('pendingOrder');
        return { result: determinantPresentation(rawMatrix, locale) };
    } catch (issue) {
        const known = ['invalidOrder', 'pendingOrder', 'notSquare', 'invalidValue', 'numericLimit', 'unstable'];
        return { error: known.includes(issue.message) ? issue.message : 'numericLimit' };
    }
}
