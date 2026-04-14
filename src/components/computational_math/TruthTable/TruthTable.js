"use client";

import { booleanExpressionSolver } from "@/utils/computationalMath/BooleanOperationsLogic";
import styles from "./TruthTable.module.css";
import InputField from "@/components/ui/InputField";
import ReactiveButton from "@/components/ui/ReactiveButton";
import React, { useState, useMemo } from "react";

const LOGIC_BUTTONS = [
    { id: 'not',   display: '¬',  insertValue: '¬'  },
    { id: 'and',   display: '∧',  insertValue: '∧'  },
    { id: 'or',    display: '∨',  insertValue: '∨'  },
    { id: 'imp',   display: '→',  insertValue: '→'  },
    { id: 'bic',   display: '↔',  insertValue: '↔'  },
    { id: 'xor',   display: '⊻',  insertValue: '⊻'  },
    { id: 'open',  display: '(',  insertValue: '('  },
    { id: 'close', display: ')',  insertValue: ')'  },
];

const DEFAULT_LABELS = {
    inputLabel: "Expressões",
    inputPlaceholder: "Ex: AvB, ~CvA",
    generateButtonLabel: "Gerar Tabela",
    variablesLabel: "Variáveis detectadas",
    errorEmptyExpression: "Digite ao menos uma expressão.",
    errorNoVariables: "Nenhuma variável encontrada. Use letras maiúsculas (A, B, C...).",
    insertButtonAriaLabel: "Inserir {value}",
};

function parseExpressions(raw) {
    return raw
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
}

function extractVariables(expressions) {
    const vars = new Set();
    for (const expr of expressions) {
        for (const char of expr) {
            if (char >= 'A' && char <= 'Z') vars.add(char);
        }
    }
    return [...vars].sort();
}

function createTruthTableLogic(variables) {
    const numRows = Math.pow(2, variables.length);
    const table = [[...variables]];

    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < variables.length; j++) {
            const blockSize = Math.pow(2, variables.length - 1 - j);
            row.push(Math.floor(i / blockSize) % 2 === 0 ? 'F' : 'T');
        }
        table.push(row);
    }

    return table;
}

function TruthTableView({ table, variables, expressions, expressionResults }) {
    return (
        <div className={styles.tableCard}>
            <div className={styles.tableScroll}>
                <table className={styles.truthTable}>
                    <thead>
                        <tr>
                            {variables.map((v, i) => (
                                <th key={i}>{v}</th>
                            ))}
                            {expressions.map((expr, i) => (
                                <th key={i}>{expr}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                                {expressionResults.map((result, exprIndex) => (
                                    <td key={exprIndex} className={styles.resultCell}>
                                        {result.length > 0 ? (result[rowIndex] ? 'T' : 'F') : '—'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function TruthTable({ labels = DEFAULT_LABELS }) {
    const [raw, setRaw] = useState("A∨B, ~C∨A");
    const [expressions, setExpressions] = useState(["A∨B", "~C∨A"]);
    const [variables, setVariables] = useState(["A", "B", "C"]);
    const [error, setError] = useState('');

    const truthTableLogic = useMemo(() => {
        return createTruthTableLogic(variables);
    }, [variables]);

    const expressionResults = expressions.map(expr => {
        try {
            return booleanExpressionSolver({
                expression: expr,
                variableTruthTable: truthTableLogic,
            });
        } catch {
            return [];
        }
    });

    function handleAddToken(token) {
        setRaw(prev => prev + token);
    }

    function handleGenerate() {
        const parsed = parseExpressions(raw);

        if (parsed.length === 0) {
            setError(labels.errorEmptyExpression);
            return;
        }

        const newVars = extractVariables(parsed);

        if (newVars.length === 0) {
            setError(labels.errorNoVariables);
            return;
        }

        setError('');
        setExpressions(parsed);
        setVariables(newVars);
    }

    return (
        <div className={styles.wrapper}>

            <section className={styles.inputCard}>
                <InputField
                    label={labels.inputLabel}
                    type="text"
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder={labels.inputPlaceholder}
                    style={{
                        padding: '15px 16px',
                        minHeight: '52px',
                        fontSize: '15px',
                        borderRadius: '10px',
                    }}
                />

                <div className={styles.actionsRow}>
                    <ReactiveButton onClick={handleGenerate} label={labels.generateButtonLabel} extraStyles={styles.generateButton} />
                </div>

                <div className={styles.toolbar}>
                    {LOGIC_BUTTONS.map((btn) => (
                        <button
                            key={btn.id}
                            className={styles.logicBtn}
                            type="button"
                            onClick={() => handleAddToken(btn.insertValue)}
                            aria-label={labels.insertButtonAriaLabel.replace('{value}', btn.display)}
                        >
                            {btn.display}
                        </button>
                    ))}
                </div>

                <div className={styles.variablesRow}>
                    <span className={styles.variablesLabel}>{labels.variablesLabel}</span>
                    <div className={styles.variablesList}>
                        {variables.map((variable) => (
                            <span key={variable} className={styles.variableBadge}>{variable}</span>
                        ))}
                    </div>
                </div>

                {error && <p className={styles.errorMsg}>{error}</p>}
            </section>

            {expressions.length > 0 && (
                <TruthTableView
                    table={truthTableLogic}
                    variables={variables}
                    expressions={expressions}
                    expressionResults={expressionResults}
                />
            )}
        </div>
    );
}