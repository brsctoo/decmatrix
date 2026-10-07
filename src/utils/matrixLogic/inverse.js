{/* Inverte uma matriz n x n 
    - utilizando o método de Gauss-Jordan:
    01. Criar a matriz aumentada [A | I], onde A é a matriz original e I é a matriz identidade do mesmo tamanho.
    02. Aplicar operações elementares para transformar a parte A da matriz aumentada na matriz identidade.
    03. As mesmas operações aplicadas para transformar A em I serão aplicadas à parte I, que se tornará a inversa de A.
    04. Se durante o processo a parte A não puder ser transformada em I (por exemplo, se encontrar uma linha de zeros), a matriz original não é invertível.
*/}  

import { Matrix } from "./core";
import MathUtils from "../MathUtils";

export default function invertMatrix(matrix, { numeric = false } = {}) {
    const { toNum, toFraction } = MathUtils;
    
    {/* Verifica se a matriz é quadrada, pois apenas matrizes quadradas podem ser invertidas. Se não for, lança um erro. */}
    if (matrix.rows !== matrix.cols) {
       throw new Error("A matriz deve ser quadrada para calcular a inversa.");
    } 

    const n = matrix.rows; // tamanho da matriz

    // 1. Criar a Matriz Aumentada [A | I]
    let augmented = matrix.data.map((row, i) => {
        const numericRow = row.map(cell => toNum(cell)); 
        const identityRow = new Array(n).fill(0); // linha da matriz identidade
        identityRow[i] = 1; // coloca 1 na posição correspondente para formar a identidade
        return [...numericRow, ...identityRow]; // concatena 
    }) 

    const scales = augmented.map(row => Math.max(...row.slice(0, n).map(Math.abs)));

    // 2. Loop principal para cada coluna e linha (pivô)
    for (let i = 0; i < n; i++) {

        let pivotRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[pivotRow][i])) pivotRow = k;
        }
        if (augmented[pivotRow][i] === 0) throw new Error('singular');
        if (!Number.isFinite(augmented[pivotRow][i])) throw new Error('numericLimit');
        if (Math.abs(augmented[pivotRow][i]) <= Number.EPSILON * n * scales[pivotRow] * 8) {
            throw new Error('unstable');
        }
        if (pivotRow !== i) {
            [augmented[i], augmented[pivotRow]] = [augmented[pivotRow], augmented[i]];
            [scales[i], scales[pivotRow]] = [scales[pivotRow], scales[i]];
        }
        const pivot = augmented[i][i];

        for (let j = 0; j < 2 * n; j++) {
            augmented[i][j] /= pivot;
        }

        for (let k = 0; k < n; k++) {
            if (k !== i) { // para todas as linhas exceto a do pivô
                let factor = augmented[k][i]; // fator para zerar o elemento
                for (let j = 0; j < 2 * n; j++) { // subtrai a linha do pivô multiplicada pelo fator
                    augmented[k][j] -= factor * augmented[i][j]; 
                }
            }
        }
    }

    let result = augmented.map(row => row.slice(n));
    if (result.some(row => row.some(value => !Number.isFinite(value)))) throw new Error('numericLimit');
    if (numeric) return result;
    
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            const value = result[i][j];
            result[i][j] = value !== 0 && Math.abs(value) < 1e-10 ? String(value) : toFraction(value);
        }
    }

    return result;
}
