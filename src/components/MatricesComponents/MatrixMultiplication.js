"use client";

import MatrixInput from "./MatrixInput";
import MatrixDisplay from "./MatrixDisplay";
import { useRef, useState } from "react";
import style from "./MatrixMultiplication.module.css";

import { Matrix } from "@/utils/matrixLogic/core";
import MatrixOps from "@/utils/matrixLogic/operations";

import { useTranslations } from "next-intl";

export default function MatrixMultiply() {
    const t = useTranslations("matrixMultiplicationComponent");
    const { multiplyMatrices } = MatrixOps;
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

    // 2. Função mestre que lida com a lógica de negócio e sincronização
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

            if (matrixId === 'A' && dimension === 'cols') next.rowsB = valToApply; // Aplica nas linhas de B o valor das colunas de A
            if (matrixId === 'B' && dimension === 'rows') next.colsA = valToApply; // Aplica nas colunas de A o valor das linhas de B
            
            return next;
        });

        // 2. Só altera o objeto real e a tela se for o momento final
        if (isFinal) {
            const numVal = Math.min(Math.max(parseInt(value) || 1, 1), 10);

            if (matrixId === 'A' && dimension === 'cols') {
                matrixA.current.cols = numVal;
                matrixB.current.rows = numVal;
            } else if (matrixId === 'B' && dimension === 'rows') {
                matrixB.current.rows = numVal;
                matrixA.current.cols = numVal;
            } else {
                const target = matrixId === 'A' ? matrixA : matrixB;
                target.current[dimension] = numVal;
            }

            matrixA.current.resize();
            matrixB.current.resize();
            setVersion(v => v + 1); // Dá o "alarme" para re-renderizar a grade
        }
    }

    function handleMultiply() {
        const resultMatrix = MatrixOps.multiplyMatrices(matrixA.current, matrixB.current);
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
                <h2>{t("resultTitle")}</h2>
                {handleMultiply() ? <MatrixDisplay matrix={handleMultiply()} /> : 
                    <p style={{ color: "red" }}>{t("error")}</p>
                }
             </div>

        </div>
    );
}