// Validation for the dedicated square-matrix calculators; legacy inputs keep their behavior.
export const MAX_MATRIX_ORDER = 10;
export const MAX_CELL_VALUE = 1e12;
export const MIN_CELL_VALUE = 1e-12;

export function parseMatrixValue(value) {
    const text = String(value).trim().replace(',', '.');
    const number = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
    const parts = text.split('/');
    if (parts.length > 2 || parts.some(part => !number.test(part.trim()))) {
        throw new Error('invalidValue');
    }
    const numerator = Number(parts[0]);
    const denominator = parts.length === 2 ? Number(parts[1]) : 1;
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
        throw new Error('invalidValue');
    }
    const result = numerator / denominator;
    if (!Number.isFinite(result) || Math.abs(result) > MAX_CELL_VALUE ||
        (result !== 0 && Math.abs(result) < MIN_CELL_VALUE) || (numerator !== 0 && result === 0)) {
        throw new Error('numericLimit');
    }
    return result;
}

export function validateSquareMatrix(matrix) {
    if (!Number.isInteger(matrix.rows) || matrix.rows < 1 || matrix.rows > MAX_MATRIX_ORDER ||
        !Number.isInteger(matrix.cols) || matrix.cols < 1 || matrix.cols > MAX_MATRIX_ORDER) {
        throw new Error('invalidOrder');
    }
    if (matrix.rows !== matrix.cols) throw new Error('notSquare');
    if (!Array.isArray(matrix.data) || matrix.data.length !== matrix.rows ||
        matrix.data.some(row => !Array.isArray(row) || row.length !== matrix.cols)) {
        throw new Error('invalidValue');
    }
    return { ...matrix, data: matrix.data.map(row => row.map(parseMatrixValue)) };
}

export function inverseResidual(matrix, inverse) {
    let residual = 0;
    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
            let sum = 0;
            for (let k = 0; k < matrix.cols; k++) sum += matrix.data[i][k] * inverse[k][j];
            residual = Math.max(residual, Math.abs(sum - (i === j ? 1 : 0)));
        }
    }
    return residual;
}

export function validateInverse(matrix, inverse, tolerance = 1e-8) {
    const left = inverseResidual(matrix, inverse);
    const right = inverseResidual({ rows: matrix.rows, cols: matrix.cols, data: inverse }, matrix.data);
    if (!Number.isFinite(left) || !Number.isFinite(right) || left > tolerance || right > tolerance) {
        throw new Error('unstable');
    }
    return inverse;
}

export function formatMatrixResult(value, locale) {
    if (value === 0) return '0';
    if (Math.abs(value) < 1e-6 || Math.abs(value) >= 1e6) return value.toExponential(11);
    return new Intl.NumberFormat(locale, { maximumSignificantDigits: 12, useGrouping: false }).format(value);
}
