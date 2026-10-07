"use client";

import MatrixInput from "../Input";
import MatrixDisplay from "../Display";
import { useRef, useState } from "react";
import style from "../Multiplication/Multiplication.module.css";
import { Matrix } from "@/utils/matrixLogic/core";
import { determinantState } from '@/utils/matrixLogic/determinantPresentation';
import DeterminantResult from './DeterminantResult';
import invertMatrix from "@/utils/matrixLogic/inverse";
import { validateSquareMatrix, validateInverse, formatMatrixResult, MAX_MATRIX_ORDER } from "@/utils/matrixLogic/square";
import ReactiveButton from "@/components/ui/ReactiveButton/ReactiveButton";
import { useLocale, useTranslations } from "next-intl";

export default function SquareOperation({ operation }) {
    const t = useTranslations(operation === 'determinant' ? 'matrixDeterminantComponent' : 'matrixInverseComponent');
    const locale = useLocale();
    const [sizeInput, setSizeInput] = useState('2');
    const matrixA = useRef(new Matrix(2, 2));
    matrixA.current.name = 'A';
    const [, setVersion] = useState(0);
    const refresh = () => setVersion(version => version + 1);

    function handleDimensionChange(dim, value, isFinal = false) {
        setSizeInput(value);
        const order = Number(value);
        if (isFinal && value.trim() !== '' && Number.isInteger(order) && order >= 1 && order <= MAX_MATRIX_ORDER) {
            matrixA.current.rows = order;
            matrixA.current.cols = order;
            matrixA.current.resize();
            setSizeInput(String(order));
            refresh();
        }
    }

    let result;
    let error;
    try {
        const order = Number(sizeInput);
        if (!Number.isInteger(order) || order < 1 || order > MAX_MATRIX_ORDER) throw new Error('invalidOrder');
        // Do not show the previous size's result while an order edit is pending.
        if (order !== matrixA.current.rows) throw new Error('pendingOrder');
        if (operation === 'determinant') {
            const state = determinantState(matrixA.current, sizeInput, locale);
            if (state.error) throw new Error(state.error);
            result = state.result;
        } else {
            const matrix = validateSquareMatrix(matrixA.current);
            const inverse = validateInverse(matrix, invertMatrix(matrix, { numeric: true }));
            result = { rows: matrix.rows, cols: matrix.cols, data: inverse.map(row => row.map(formatValue)) };
        }
    } catch (issue) {
        const known = ['invalidOrder', 'pendingOrder', 'notSquare', 'invalidValue', 'numericLimit', 'singular', 'unstable'];
        error = known.includes(issue.message) ? issue.message : 'numericLimit';
    }

    function formatValue(value) {
        return formatMatrixResult(value, locale);
    }

    return (
        <div>
            <MatrixInput
                matrixInstance={matrixA.current}
                rowsValue={sizeInput}
                colsValue={sizeInput}
                onSizeChange={handleDimensionChange}
                onUpdate={refresh}
                strictValues
                protectOverflow
                cellLabel={(row, column) => t('cellLabel', { row, column })}
                inputNote={t('squareNote')}
                actions={<ReactiveButton label={t('calculateButton')} onClick={() => handleDimensionChange('rows', sizeInput, true)} />}
            />

            <div className={`${style.resultContainer} ${style.protectedResult}`} aria-live="polite" aria-atomic="true">
                <h2>{t('resultTitle')}</h2>
                {error ? <p role="alert" style={{ color: '#ef4444' }}>{t(`errors.${error}`)}</p> : <>
                    {operation === 'determinant' ? <DeterminantResult result={result} /> : <>
                        <MatrixDisplay matrix={result} otherClasses={style.resultMatrix} protectOverflow />
                        <p>{t('precisionNote')}</p>
                    </>}
                </>}
            </div>
        </div>
    );
}
