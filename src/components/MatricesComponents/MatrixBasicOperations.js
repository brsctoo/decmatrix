"use client";

import MatrixInput from "./MatrixInput";
import MatrixDisplay from "./MatrixDisplay";
import { useRef, useState } from "react";
import style from "./MatrixMultiplication.module.css";

import { Matrix } from "@/utils/matrixLogic/core";
import MatrixOps from "@/utils/matrixLogic/operations";

import { useTranslations } from "next-intl";

export default function MatrixBasicOperations() {
    const t = useTranslations("matrixBasicOperationsComponent");
    const { addMatrices, subtractMatrices } = MatrixOps;
    // 1. Estado único para todos os inputs de tamanho da página
    const [sizeInputs, setSizeInputs] = useState({
        rowsA: "2", colsA: "2",
        rowsB: "2", colsB: "2"
    });

    const matrixA = useRef(new Matrix(2, 2));
    matrixA.current.name = "A";
    const matrixB = useRef(new Matrix(2, 2));
    matrixB.current.name = "B";
    const [version, setVersion] = useState(0); // Só para forçar o React a redesenhar quando as matrizes mudarem

    // 2. Função que lida com a lógica de negócio e sincronização
    function handleDimensionChange(matrixId, dimension, value, isFinal = false) {
        {/*
            matrixId: 'A' ou 'B', a matriz que está sendo editada
            dimension: 'rows' ou 'cols', a dimensão que está sendo editada
            value: string do input
            isFinal: boolean indicando se é o momento final (Blur ou Enter)
        */}

        // 1. Atualiza o visual (sempre)
        setSizeInputs(prev => {
            let valToApply = value;

            // Se for o momento final (Blur ou Enter), aplicamos a validação de limite
            if (isFinal) {
                let num = parseInt(valToApply) || 1;
                if (num < 1) num = 1;
                if (num > 10) num = 10;
                valToApply = num.toString();
            }

            const next = { ...prev, [`${dimension}${matrixId}`]: valToApply };

            // Para a soma e subtração, as colunas de A e as linhas de B devem ser iguais, então sincronizamos ambos
            if (matrixId === 'A' && dimension === 'cols') next.colsB = valToApply; 
            if (matrixId === 'A' && dimension === 'rows') next.rowsB = valToApply; 
            if (matrixId === 'B' && dimension === 'cols') next.colsA = valToApply;
            if (matrixId === 'B' && dimension === 'rows') next.rowsA = valToApply;
            
            return next;
        });

        // 2. Só altera o objeto real e a tela se for o momento final
        if (isFinal) {
            const numVal = Math.min(Math.max(parseInt(value) || 1, 1), 10);
                
            if (matrixId === 'A' && dimension === 'cols') {
                matrixA.current.cols = numVal;
                matrixB.current.cols = numVal;
            } else if (matrixId === 'A' && dimension === 'rows') {
                matrixA.current.rows = numVal;
                matrixB.current.rows = numVal;              
            } else if (matrixId === 'B' && dimension === 'rows') {
                matrixB.current.rows = numVal;
                matrixA.current.rows = numVal;
            } else if (matrixId === 'B' && dimension === 'cols') {
                matrixB.current.cols = numVal;
                matrixA.current.cols = numVal;
            }

            matrixA.current.resize();
            matrixB.current.resize();
            setVersion(v => v + 1);
        }
    }

    function handleSum() {
        const resultMatrix = MatrixOps.addMatrices(matrixA.current, matrixB.current);
        return resultMatrix;
    }

    function handleSubtract() {
        const resultMatrix = MatrixOps.subtractMatrices(matrixA.current, matrixB.current);
        return resultMatrix;
    }

    return (
        <div>
            <MatrixInput 
                matrixInstance={matrixA.current} 
                rowsValue={sizeInputs.rowsA}
                colsValue={sizeInputs.colsA}
                onSizeChange={(dim, val, isFinal) => handleDimensionChange('A', dim, val, isFinal)}
                onUpdate={() => setVersion(v => v + 1)} 
            />
            <MatrixInput 
                matrixInstance={matrixB.current} 
                rowsValue={sizeInputs.rowsB}
                colsValue={sizeInputs.colsB}
                onSizeChange={(dim, val, isFinal) => handleDimensionChange('B', dim, val, isFinal)}
                onUpdate={() => setVersion(v => v + 1)}
            />

            <div className={style.resultContainer}> 
                <h2>{t("addResultTitle")}</h2>
                {handleSum() ? <MatrixDisplay matrix={handleSum()} /> : 
                    <p style={{ color: "red" }}>{t("error")}</p>
                }
             </div>

            <div className={style.resultContainer}> 
                <h2>{t("subtractResultTitle")}</h2>
                {handleSubtract() ? <MatrixDisplay matrix={handleSubtract()} /> : 
                    <p style={{ color: "red" }}>{t("error")}</p>
                }
             </div>

        </div>
    );
}