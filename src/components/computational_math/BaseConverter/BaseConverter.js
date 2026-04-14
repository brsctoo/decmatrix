"use client";

import React, {useState} from 'react';
import styles from './BaseConverter.module.css';
import { useTranslations } from 'next-intl';
import InputField from '@/components/ui/InputField';
import ReactiveButton from '@/components/ui/ReactiveButton';

// Utils
import { convertBase, validateInput } from '@/utils/computationalMath/BaseConverterLogic';

const DEFAULT_BASES = [
    { key: 'binary', base: 2 },
    { key: 'octal', base: 8 },
    { key: 'decimal', base: 10 },
    { key: 'hexadecimal', base: 16 },
];

export default function BaseConverter() {
    const [number, setNumber] = useState('');
    const [fromBase, setFromBase] = useState(2);
    const [customFromBase, setCustomFromBase] = useState('');
    const [newBase, setNewBase] = useState('');
    const [customBases, setCustomBases] = useState([]);
    const [removedDefaultBases, setRemovedDefaultBases] = useState([]);

    const t = useTranslations('BaseConverterComponent');

    const effectiveFromBase = fromBase === 'personalized'
        ? Number(customFromBase)
        : fromBase;
    
    const isBaseValid = !isNaN(effectiveFromBase) && effectiveFromBase >= 2 && effectiveFromBase <= 36;

    const CONVERTED_NUMBERS = [
        ...DEFAULT_BASES
            .filter(({ base }) => !removedDefaultBases.includes(base))
            .map(({ key, base }) => ({
                key, base, label: t(`defaultBaseLabels.${key}`),
                value: (number && isBaseValid) ? convertBase(number, effectiveFromBase, base) : ''
            })),
        ...customBases.map(base => ({
            key: `base${base}`, base, label: t('customBaseLabel', { base }),
            value: (number && isBaseValid) ? convertBase(number, effectiveFromBase, base) : '',
        }))
    ];

    function addBaseToTable(baseValue) {
        const num = Number(baseValue);
        if (isNaN(num) || num < 2 || num > 36) return;

        const isDefaultRemoved = removedDefaultBases.includes(num);

        if (isDefaultRemoved) {
            setRemovedDefaultBases(removedDefaultBases.filter(b => b !== num));
            setNewBase('');
            return;
        }

        if (!customBases.includes(num)) {
            setCustomBases([...customBases, num]);
            setNewBase('');
        }
    }

    function removeBase(baseValue) {
        if (DEFAULT_BASES.some(b => b.base === baseValue)) {
            setRemovedDefaultBases([...removedDefaultBases, baseValue]);
        } else {
            setCustomBases(customBases.filter(base => base !== baseValue));
        }
    }

    function handleInput(e) {
        const inputValue = e.target.value;
        if (validateInput(inputValue, effectiveFromBase)) {
            setNumber(inputValue);
        }
    }

    function handleFromBaseChange(e) {
        const val = e.target.value;
        if (val === 'personalized') {
            setFromBase('personalized');
            setNumber('');
            return;
        }

        const newFromBase = parseInt(val);
        if (number) {
            try {
                setNumber(convertBase(number, effectiveFromBase, newFromBase));
            } catch {
                setNumber('');
            }
        }
        setFromBase(newFromBase);
    }

    const baseOptions = [
        { value: 2, label: t('baseOptions.binary') },
        { value: 10, label: t('baseOptions.decimal') },
        { value: 8, label: t('baseOptions.octal') },
        { value: 16, label: t('baseOptions.hexadecimal') },
        { value: 'personalized', label: t('baseOptions.personalized') }
    ];

    function handleExportCSV() {
        let csvContent = `${t('exportSection.headers.base')},${t('exportSection.headers.name')},${t('exportSection.headers.result')}\n`;

        CONVERTED_NUMBERS.forEach(({ base, label, value }) => {
            const finalValue = value || '-';
            csvContent += `${base},${label},${finalValue}\n`;
        });

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        
        const fileName = number ? `decmatrix_bases_${number}.csv` : "decmatrix_bases.csv";
        link.setAttribute("download", fileName);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className={styles.wrapper}>

            {/* ── Inputs ── */}
            <div className={styles.inputCard}>
                <InputField 
                    label={t('mainInput.label')}
                    type="text"
                    value={number}
                    onChange={handleInput}
                    placeholder={t('mainInput.placeholder')}
                    selectValue={fromBase}
                    onSelectChange={(value) => handleFromBaseChange({target: {value}})}
                    selectOptions={baseOptions}
                />
                
                {fromBase === 'personalized' && (
                    <div className={styles.customBaseField}>
                        <InputField
                            label={t('sourceBaseSection.label')}
                            type="number"
                            value={customFromBase}
                            onChange={(e) => {
                                setCustomFromBase(e.target.value);
                                setNumber('');
                            }}
                            placeholder={t('sourceBaseSection.placeholder')}
                        />
                    </div>
                )}
            </div>

            {/* ── Tabela estilizada (com remoção) ── */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <span className={styles.tableHeaderLabel}>{t('resultsSection.label')}</span>
                    <span className={styles.tableHeaderSub}>
                        {t('resultsSection.subtitle', { base: isBaseValid ? effectiveFromBase : '?' })}
                    </span>
                </div>
                <table className={styles.styledTable}>
                    <thead>
                        <tr>
                            <th>{t('tableHeaders.base')}</th>
                            <th>{t('tableHeaders.result')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {CONVERTED_NUMBERS.map(({ key, base, label, value }) => (
                            <tr key={key} className={styles.styledRow}>
                                <td className={styles.baseCell}>
                                    <span className={styles.baseBadge}>{base}</span>
                                    <span className={styles.baseLabel}>{label}</span>
                                </td>
                                <td className={styles.valueCell}>
                                    <span className={styles.valueText}>{value || '—'}</span>
                                </td>
                                <td className={styles.actionCell}>
                                    <ReactiveButton 
                                        onClick={() => removeBase(base)} 
                                        label={t('removeButtonLabel')}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Adicionar base ── */}
            <div className={styles.addBaseCard}>
                <div className={styles.addBaseRow}>
                    <InputField 
                        label={t('addBaseSection.label')}
                        type="text"
                        value={newBase}
                        onChange={(e) => setNewBase(e.target.value)}
                        placeholder={t('addBaseSection.placeholder')}
                        onKeyDown={(e) => e.key === 'Enter' && addBaseToTable(parseInt(newBase))}
                    />
                    <ReactiveButton 
                        onClick={() => addBaseToTable(parseInt(newBase))}
                        label={t('addBaseSection.buttonLabel')}
                        extraStyles={styles.addBaseButton}
                    />
                </div>
            </div>

            <div className={styles.exportCard}>
                <div className={styles.exportHeader}>
                    <span className={styles.exportHeaderLabel}>{t('exportSection.label')}</span>
                    <div style={{ marginLeft: "auto" }}>
                        <ReactiveButton 
                            onClick={handleExportCSV} 
                            label={t('exportSection.buttonLabel')} 
                            extraStyles={styles.addBaseButton}
                        />
                    </div>
                </div>
                <table className={styles.exportTable}>
                    <thead>
                        <tr>
                            <th>{t('exportSection.headers.base')}</th>
                            <th>{t('exportSection.headers.name')}</th>
                            <th>{t('exportSection.headers.result')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CONVERTED_NUMBERS.map(({ key, base, label, value }) => (
                            <tr key={key} className={styles.exportRow}>
                                <td>{base}</td>
                                <td>{label}</td>
                                <td className={styles.exportValue}>{value || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}