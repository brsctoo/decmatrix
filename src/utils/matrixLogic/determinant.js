/* Calcula o determinante de uma matriz qualquer n x n --> Fazemos por eliminação de Gauss */
import MathUtils from "../MathUtils";
const { toNum, toFraction } = MathUtils;

export default function determinant(matrix, { numeric = false } = {}) {
    let signal = 1; // para controlar o sinal do determinante, que muda quando trocamos linhas
    let det = 1; // o valor do determinante, que é o produto dos pivôs (diagonal da matriz triangular resultante)

    // Verifica se a matriz é quadrada, pois apenas matrizes quadradas podem ser invertidas. Se não for, lança um erro.
    if (matrix.rows !== matrix.cols) {
        throw new Error("A matriz deve ser quadrada para calcular o determinante.");
    } 

    const data = matrix.data.map(row => [...row]); // cria uma cópia da matriz para não alterar a original -> ainda tudo em string

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            data[i][j] = toNum(data[i][j]); // converte cada célula para número (isso já lida com frações)
        }
    }

    const n = matrix.rows; // tamanho da matriz

    // 2. Loop principal para cada coluna e linha (pivô)
    for (let i = 0; i < n; i++) {

        // Pivoteamento parcial: não confundir valores pequenos com zero absoluto.
        let pivotRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(data[k][i]) > Math.abs(data[pivotRow][i])) pivotRow = k;
        }
        if (data[pivotRow][i] === 0) return numeric ? 0 : '0';
        if (pivotRow !== i) {
            [data[i], data[pivotRow]] = [data[pivotRow], data[i]];
            signal *= -1;
        }
        const pivot = data[i][i];

        // zerar os elementos abaixo do pivô, ou seja, k é a linha que queremos zerar, e i é a linha do pivô
        for (let k = i + 1; k < n; k++) {
            let factor = data[k][i] / pivot; // fator para zerar o elemento
            data[k][i] = 0;

            // Começamos o j em i + 1, pois o elemento data[k][i] já foi "zerado" acima
            for (let j = i + 1; j < n; j++) {
                data[k][j] -= factor * data[i][j];
            }
        }
    }

    // 3. Loop principal para calcular o produto da diagnoal principal (que agora é uma matriz triangular superior)
    for (let i = 0; i < n; i++) {
        det *= data[i][i]; 
    }

    const result = det * signal;
    // Evita passar NaN/Infinity ao conversor de frações (que usa um loop).
    if (!Number.isFinite(result)) {
        if (numeric) throw new Error('numericLimit');
        return NaN;
    }
    if (numeric) return result;
    return result !== 0 && Math.abs(result) < 1e-10 ? String(result) : toFraction(result);
}
