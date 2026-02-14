"use client";

import { useState, useRef, useEffect } from "react";
import InputField from "../InputField";
import style from "./MatrixInput.module.css";
import MatrixOps from "@/utils/matrixLogic/operations";
import determinant from "@/utils/matrixLogic/determinant";
import invertMatrix from "@/utils/matrixLogic/inverse";
import ReactiveButton from "../ReactiveButton";
import MathUtils from "@/utils/MathUtils";

import { useTranslations } from "next-intl";

import { FractionDisplay } from "../MathDisplay";

// matrixInstance é uma ref para o objeto Matrix da classe core.js
export default function MatrixInput({ matrixInstance, rowsValue, colsValue, onSizeChange, onUpdate }) {
    const t = useTranslations("matrixInput");
    const { transposeMatrix } = MatrixOps;
    const { toNum } = MathUtils;
    // Gatilho para validar e aplicar o tamanho final
    const handleFinalize = (dim, val) => {
        onSizeChange(dim, val, true); 
    };

    return (
        <div className={style.wrapper}>
            <div className={style.inputContainer}>
                <div>
                    <h2 className={style.matrixTitle}>{t("title")} {matrixInstance.name}</h2>
                </div>
                <div className={style.inputFieldsContainer}>
                    <div>
                        <InputField
                            label={t("rowsLabel")}
                            type="number"
                            hasSpinButtons={"true"}
                            min="1"
                            max="10"
                            value={rowsValue}
                            onChange={(e) => onSizeChange('rows', e.target.value, false)} // Atualiza o estado para atualizar o valor do input, mas não atualiza a matriz real
                            onBlur={(e) => handleFinalize('rows', e.target.value)} // Aplica validação e sincronização no blur
                            onKeyDown={(e) => e.key === "Enter" && handleFinalize('rows', e.target.value)} // Aplica validação e sincronização no Enter
                        />
                        <InputField
                            label={t("columnsLabel")}
                            type="number"
                            hasSpinButtons={"true"}
                            min="1"
                            max="10"
                            value={colsValue} 
                            onChange={(e) => onSizeChange('cols', e.target.value, false)} // Atualiza o estado para atualizar o valor do input, mas não atualiza a matriz real
                            onBlur={(e) => handleFinalize('cols', e.target.value)} // Aplica validação e sincronização no blur
                            onKeyDown={(e) => e.key === "Enter" && handleFinalize('cols', e.target.value)} // Aplica validação e sincronização no Enter
                        />
                        {matrixInstance.rows !== matrixInstance.cols ? (
                            <p style={{ color: "orange", marginTop: "20px" }}>{t("notSquareMatrix")}</p>
                        ) : toNum(determinant(matrixInstance)) !== 0 ? (
                            <p style={{ marginTop: "20px" }}><span style={{ color: "#523c2d", fontWeight: "600" }}>{t("determinant")}:</span> <span style={{ color: "green", fontWeight: "600" }}>{determinant(matrixInstance)}</span></p>
                        ) : (
                            <p style={{ marginTop: "20px" }}><span style={{ color: "#523c2d", fontWeight: "600" }}>{t("determinant")}:</span> <span style={{ color: "red", fontWeight: "600" }}>0 (Singular)</span></p>
                        )} 
                    </div>
                    <div>
                        <ReactiveButton 
                            label={t("invertButton")}
                            onClick={() => {
                                try {
                                    const inverted = invertMatrix(matrixInstance);
                                    matrixInstance.data = inverted;
                                    onUpdate();
                                } catch (error) {
                                    alert(t("notInvertibleAlert"));
                                }
                            }} 
                            blocked={matrixInstance.rows !== matrixInstance.cols || toNum(determinant(matrixInstance)) === 0} // Só habilita se for quadrada
                        />                        
                        <ReactiveButton 
                            label={t("transposeButton")}
                            onClick={() => {
                                try {
                                    const transposed = transposeMatrix(matrixInstance);
                                    matrixInstance.data = transposed.data;
                                    matrixInstance.rows = transposed.rows;
                                    matrixInstance.cols = transposed.cols;
                                    onUpdate();
                                } catch (error) {
                                    alert(t("invalidTransposeAlert"));
                                }
                            }} 
                            blocked={false}
                        />
                    </div>
                </div>
            <div className={style.matrixContainer} style={{ "--grid-cols": matrixInstance.cols }}>
                <div className={style.matrixInner}> {/* O "abraço" real */}
                    <div className={style.bracketLeft}></div>
                    <div className={style.grid}>
                        {matrixInstance.data.map((row, r) => // passa cada linha da matriz
                            row.map((val, c) => ( // para cada célula, renderiza um input
                                <input 
                                    key={`${r}-${c}`}
                                    type="text"
                                    value={val}
                                    onChange={(e) => {
                                        const rawValue = e.target.value;

                                        // 1. SEGURANÇA: Bloqueia letras, mas permite caracteres de fração e sinais
                                        if (!/^-?[0-9.,/]*$/.test(rawValue)) return;
                                        
                                        if (rawValue.includes(',')) {
                                            // Substitui vírgula por ponto para decimais
                                            matrixInstance.changeCellValue(r, c, rawValue.replace(',', '.'));
                                            onUpdate();
                                            return;
                                        }
                                        // Atualizamos o valor visual na matriz (mantendo a string em fração)
                                        matrixInstance.changeCellValue(r, c, rawValue);
                                        onUpdate();
                                    }}
                                    onBlur={(e) => {
                                        const rawValue = e.target.value;

                                        if (rawValue.includes(',')) {
                                            matrixInstance.changeCellValue(r, c, rawValue.replace(',', '.')); // Substitui vírgula por ponto para decimais
                                        }
        
                                        if (rawValue === '' || rawValue === '/' || rawValue === '-') {
                                            matrixInstance.changeCellValue(r, c, 0); // Campo vazio ou inválido vira 0
                                        } else if (rawValue.includes('/')) {
                                            // Verifica se a fração é válida (ex: "1/2")
                                            const [num, den] = rawValue.split('/');
                                            if (den === "0" || isNaN(parseFloat(num)) || isNaN(parseFloat(den))) {
                                                matrixInstance.changeCellValue(r, c, 0); // Fração inválida vira 0
                                            }
                                        }
                                        onUpdate();
                                    }}
                                    className={style.cellInput}
                                />
                            ))
                        )}
                    </div>
                    <div className={style.bracketRight}></div>
                </div>
            </div>
            </div>
        </div>
    );
}