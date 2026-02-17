{/* Inverte uma matriz n x n 
    - utilizando o método de Gauss-Jordan:
    01. Criar a matriz aumentada [A | I], onde A é a matriz original e I é a matriz identidade do mesmo tamanho.
    02. Aplicar operações elementares para transformar a parte A da matriz aumentada na matriz identidade.
    03. As mesmas operações aplicadas para transformar A em I serão aplicadas à parte I, que se tornará a inversa de A.
    04. Se durante o processo a parte A não puder ser transformada em I (por exemplo, se encontrar uma linha de zeros), a matriz original não é invertível.
*/}  

import { Matrix } from "./core";
import MathUtils from "../MathUtils";

export default function invertMatrix(matrix) {
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

    // 2. Loop principal para cada coluna e linha (pivô)
    for (let i = 0; i < n; i++) {

        // Encontrar o pivô
        let pivot = augmented[i][i];
        
        // Se o pivô for zero, a matriz não é invertível
        if (Math.abs(pivot) < 0.0000000001) {
            throw new Error("A matriz não é invertível.");
        } 

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
    
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            result[i][j] = toFraction(result[i][j]); // converte para fração
        }
    }

    return result;
}