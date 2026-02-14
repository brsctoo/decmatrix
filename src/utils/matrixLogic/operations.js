/* Implementação das operações básicas de matrix (multiplicação, soma, subtração, transposta) */

import { Matrix } from "./core";

import MathUtils from "../MathUtils";
const { toNum, toFraction } = MathUtils;

function addMatrices(matrixA, matrixB) {
    if (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols) {
        throw new Error("As matrizes devem ter as mesmas dimensões para serem somadas.");
    }

    const result = new Matrix(matrixA.rows, matrixA.cols);

    for (let i = 0; i < matrixA.rows; i++) {
        for (let j = 0; j < matrixA.cols; j++) {
            result.data[i][j] = toFraction(toNum(matrixA.data[i][j]) + toNum(matrixB.data[i][j]));
        }
    }
    
    return result;
}

function subtractMatrices(matrixA, matrixB) {
    if (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols) {
        throw new Error("As matrizes devem ter as mesmas dimensões para serem subtraidas.");
    }

    const result = new Matrix(matrixA.rows, matrixA.cols);

    for (let i = 0; i < matrixA.rows; i++) {
        for (let j = 0; j < matrixA.cols; j++) {
            result.data[i][j] = toFraction(toNum(matrixA.data[i][j]) - toNum(matrixB.data[i][j]));
        }
    }
    
    return result;
}


function multiplyMatrices(matrixA, matrixB) {
    if (matrixA.cols !== matrixB.rows) {
        return null;
    }

    const result = new Matrix(matrixA.rows, matrixB.cols);

    for (let i = 0; i < matrixA.rows; i++) { // Pega cada linha de A
        for (let j = 0; j < matrixB.cols; j++) { // Pega cada coluna de B
            let sum = 0;
            for (let k = 0; k < matrixA.cols; k++) { // Para cada elemento da linha de A e coluna de B
                sum += toNum(matrixA.data[i][k]) * toNum(matrixB.data[k][j]); // Multiplica e soma os elementos correspondentes
            }
            result.data[i][j] = toFraction(sum); // Armazena o resultado na posição correspondente da matriz resultante
        }
    }
    
    return result;
}

function transposeMatrix(matrix) {
    const result = new Matrix(matrix.cols, matrix.rows); // A transposta tem as dimensões invertidas

    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
            result.data[j][i] = matrix.data[i][j]; // Inverte os índices para criar a transposta
        }
    }
    
    return result;
}

export default {
    addMatrices,
    subtractMatrices,
    multiplyMatrices,
    transposeMatrix
};