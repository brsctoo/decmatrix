// Decimal-only inputs: exact rational classification, bounded work and strings.
export const LIMIT = 1e12;
export function rational(n, d = 1n) {
    if (!d) throw new Error('numericLimit');
    if (d < 0n) [n, d] = [-n, -d];
    let a = n < 0n ? -n : n, b = d;
    while (b) [a, b] = [b, a % b];
    return { n: n / a, d: d / a };
}
export const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a, b) => rational(a.n * b.n, a.d * b.d);
export const div = (a, b) => rational(a.n * b.d, a.d * b.n);
export const num = a => Number(a.n) / Number(a.d);
export const zero = a => a.n === 0n;
export const neg = a => rational(-a.n, a.d);
export function parseCoefficient(value) {
    const text = String(value).trim().replace(',', '.');
    const match = text.match(/^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:e([+-]?\d+))?$/i);
    if (!match) throw new Error('invalidValue');
    if (text.length > 40 || Math.abs(Number(match[3] || 0)) > 24) throw new Error('numericLimit');
    const exponent = Number(match[3] || 0) - (match[2].split('.')[1]?.length || 0);
    let n = BigInt(match[2].replace('.', '')) * (match[1] === '-' ? -1n : 1n);
    const result = exponent >= 0 ? rational(n * 10n ** BigInt(exponent)) : rational(n, 10n ** BigInt(-exponent));
    const magnitude = result.n < 0n ? -result.n : result.n;
    if (magnitude > 1000000000000n * result.d || (!zero(result) && magnitude * 1000000000000n < result.d)) throw new Error('numericLimit');
    return result;
}
export function numericText(value, locale = 'en') {
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US', { maximumSignificantDigits: 12, useGrouping: false }).format(Object.is(value, -0) ? 0 : value);
}
export function tex(value, locale = 'en') {
    if (typeof value === 'number') return numericText(value, locale).replace(',', '{,}');
    return value.d === 1n ? String(value.n) : `\\frac{${value.n}}{${value.d}}`;
}
export const paren = (value, locale) => `\\left(${tex(value, locale)}\\right)`;
export function expression(coefficients, variables, locale) {
    const terms = coefficients.flatMap((value, i) => zero(value) ? [] : [{ value, variable: variables[i] }]);
    if (!terms.length) return '0';
    return terms.map(({ value, variable }, i) => {
        const negative = value.n < 0n;
        const abs = negative ? neg(value) : value;
        const coefficient = variable && abs.n === abs.d ? '' : tex(abs, locale);
        return `${negative ? '-' : i ? '+' : ''}${coefficient}${variable}`;
    }).join(' ');
}
export function equation(row, locale) { return `${expression(row.slice(0, 2), ['x', 'y'], locale)} = ${tex(row[2], locale)}`; }
export function normalizedResidual(row, x, y) {
    // Exact substitution avoids a false failure in severe cancellation; also
    // expose a scale-normalized floating residual for the plotted coordinates.
    const exact = sub(add(mul(row[0], x), mul(row[1], y)), row[2]);
    const terms = [num(row[0]) * num(x), num(row[1]) * num(y), num(row[2])];
    const scale = Math.max(...terms.map(Math.abs));
    const floating = scale === 0 ? 0 : Math.abs(terms[0] / scale + terms[1] / scale - terms[2] / scale) /
        terms.reduce((s, t) => s + Math.abs(t / scale), 0);
    return { exact: zero(exact), floating };
}
export function solveFunction(raw) {
    const [a, b] = [raw.a, raw.b].map(parseCoefficient);
    const kind = zero(a) ? zero(b) ? 'null' : 'constant' : a.n > 0n ? 'increasing' : 'decreasing';
    const root = zero(a) ? null : div(neg(b), a);
    return { a, b, root, kind, rows: [[a, rational(-1n), neg(b)]],
        point: root ? [num(root), 0] : null, intercept: num(b) };
}
export function solveSystem(raw) {
    const rows = [1, 2].map(i => ['a', 'b', 'c'].map(key => parseCoefficient(raw[`${key}${i}`])));
    const active = rows.filter(row => !zero(row[0]) || !zero(row[1]));
    const contradiction = rows.some(row => zero(row[0]) && zero(row[1]) && !zero(row[2]));
    if (contradiction) return { kind: 'none', reason: 'contradiction', rows, steps: [] };
    if (!active.length) return { kind: 'plane', reason: 'identities', rows, steps: [] };
    if (active.length === 1) return { kind: 'line', reason: 'identity', rows, line: active[0], steps: [] };
    const [r1, r2] = rows;
    const determinant = sub(mul(r1[0], r2[1]), mul(r2[0], r1[1]));
    if (zero(determinant)) {
        const compatible = zero(sub(mul(r1[0], r2[2]), mul(r2[0], r1[2]))) &&
            zero(sub(mul(r1[1], r2[2]), mul(r2[1], r1[2])));
        const pivot = zero(r1[0]) ? 1 : 0;
        const factor = div(r2[pivot], r1[pivot]);
        const eliminated = r2.map((v, i) => sub(v, mul(factor, r1[i])));
        return { kind: compatible ? 'line' : 'none', reason: compatible ? 'coincident' : 'parallel', rows, line: r1, factor, eliminated };
    }
    let first = r1, second = r2;
    const swapped = zero(first[0]);
    if (swapped) [first, second] = [second, first];
    const factor = div(second[0], first[0]);
    const eliminated = second.map((v, i) => sub(v, mul(factor, first[i])));
    const y = div(eliminated[2], eliminated[1]);
    const x = div(sub(first[2], mul(first[1], y)), first[0]);
    const residuals = rows.map(row => normalizedResidual(row, x, y));
    if (residuals.some(r => !r.exact || r.floating > 1e-10)) throw new Error('unstable');
    return { kind: 'unique', rows, x, y, point: [num(x), num(y)], swapped, first, factor, eliminated, residuals };
}

// A fixed representable window, explicitly disclosed if notable coordinates
// cannot fit. Clip implicit lines against the box: verticals need no division by b.
export function graphModel(result, isFunction = false) {
    const notable = result.point ? [...result.point] : [];
    if (isFunction) notable.push(result.intercept);
    for (const row of result.rows) {
        if (!zero(row[0])) notable.push(num(div(row[2], row[0])));
        if (!zero(row[1])) notable.push(num(div(row[2], row[1])));
    }
    const outside = notable.some(v => !Number.isFinite(v) || Math.abs(v) > 1e6);
    const extent = outside ? 10 : Math.max(5, ...notable.map(v => Math.abs(v) * 1.25));
    const segments = result.rows.map(row => {
        const [a, b, c] = row.map(num);
        if (a === 0 && b === 0) return [];
        const points = [];
        const push = (x, y) => {
            if (Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) <= extent * (1 + 1e-12) && Math.abs(y) <= extent * (1 + 1e-12) &&
                !points.some(p => Math.abs(p.x - x) < extent * 1e-12 && Math.abs(p.y - y) < extent * 1e-12)) points.push({ x, y });
        };
        if (b !== 0) for (const x of [-extent, extent]) push(x, (c - a * x) / b);
        if (a !== 0) for (const y of [-extent, extent]) push((c - b * y) / a, y);
        return points.length >= 2 ? [points[0], points[points.length - 1]] : [];
    });
    const point = result.point && result.point.every(v => Math.abs(v) <= extent) ? result.point : null;
    return { extent, segments, point, outside, clipped: segments.some((s, i) => !s.length && (!zero(result.rows[i][0]) || !zero(result.rows[i][1]))) };
}

// Real function values only; O(201) work even for an enormous root. Include
// visible notable x coordinates without rounding them to an arbitrary grid.
export function functionChartData(result, graph = graphModel(result, true)) {
    const a = num(result.a), b = num(result.b);
    const xs = Array.from({ length: 201 }, (_, i) => -graph.extent + 2 * graph.extent * i / 200);
    xs.push(0);
    if (result.root && Math.abs(num(result.root)) <= graph.extent) xs.push(num(result.root));
    return [...new Set(xs)].sort((x, y) => x - y).map(x => ({ x, y: a * x + b }))
        .filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));
}
