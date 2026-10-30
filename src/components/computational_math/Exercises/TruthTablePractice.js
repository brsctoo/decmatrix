'use client';

import { useEffect, useReducer, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ReactiveButton from '@/components/ui/ReactiveButton';
import { TRUTH_EXERCISES, buildTruthExercise, newTruthState, truthReducer } from '@/utils/computationalExercises/truth';
import PracticeStats from './PracticeStats';
import styles from './Practice.module.css';

export default function TruthTablePractice() {
    const t = useTranslations('TruthTableExercises');
    const common = useTranslations('ComputationalPractice');
    const [state, dispatch] = useReducer(truthReducer, 0, newTruthState);
    const exercise = TRUTH_EXERCISES[state.index];
    const { rows, expected } = buildTruthExercise(exercise);
    const finished = state.phase !== 'active';
    const heading = useRef(null);
    useEffect(() => { if (state.index > 0) heading.current?.focus(); }, [state.index]);
    const truth = value => t(value ? 'true' : 'false');
    return <section className={styles.board} data-truth-practice aria-label={t('practiceLabel')}>
        <div className={styles.settings}>
            <label>{t('choose')}<select data-truth-catalog value={state.index} onChange={event => dispatch({ type: 'select', index: Number(event.target.value) })}>
                {TRUTH_EXERCISES.map((item, index) => <option value={index} key={item.id}>{index + 1}. {t(`catalog.${item.id}.title`)} — {item.expression}</option>)}
            </select></label>
        </div>
        <h2 ref={heading} tabIndex={-1}>{t(`catalog.${exercise.id}.title`)}: {exercise.expression}</h2>
        <p>{t(`catalog.${exercise.id}.task`)}</p>
        <p className={styles.note}>{t('variables', { variables: exercise.variables.join(', ') })} {t('instructions')}</p>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label={t('tableRegion')}>
            <table className={styles.table} data-truth-table>
                <caption>{t('caption', { expression: exercise.expression })}</caption>
                <thead><tr>
                    <th scope="col">{t('row')}</th>
                    {exercise.variables.map(variable => <th scope="col" key={variable}>{variable}</th>)}
                    {exercise.columns.map((expression, c) => <th id={`truth-column-${c}`} scope="col" key={expression}>{expression}</th>)}
                </tr></thead>
                <tbody>{rows.map((row, r) => <tr key={r}>
                    <th id={`truth-row-${r}`} scope="row">{r + 1}</th>
                    {row.map((value, c) => <td key={c}>{truth(value === 'T')}</td>)}
                    {exercise.columns.map((expression, c) => {
                        const mark = state.marks[r]?.[c];
                        return <td key={expression} headers={`truth-row-${r} truth-column-${c}`} className={mark ? styles[mark] : undefined}>
                            <select data-truth-answer={`${r}:${c}`} value={state.answers[r][c]} disabled={finished}
                                aria-label={t('cell', { row: r + 1, expression })} aria-invalid={mark === 'wrong' || mark === 'empty' ? true : undefined}
                                aria-describedby={mark ? `truth-mark-${r}-${c}` : undefined}
                                onChange={event => dispatch({ type: 'answer', row: r, column: c, value: event.target.value })}>
                                <option value="">—</option><option value="true">{truth(true)}</option><option value="false">{truth(false)}</option>
                            </select>
                            {mark && <span id={`truth-mark-${r}-${c}`} className={styles.mark}>{t(`marks.${mark}`)}</span>}
                        </td>;
                    })}
                </tr>)}</tbody>
            </table>
        </div>
        <div className={styles.actions}>
            <ReactiveButton label={t('check')} disabled={finished} onClick={() => dispatch({ type: 'check' })} extraStyles={styles.primary} />
            <ReactiveButton label={common('repeat')} onClick={() => dispatch({ type: 'repeat' })} />
            {!finished && <ReactiveButton label={common('reveal')} onClick={() => dispatch({ type: 'reveal' })} />}
            {finished && state.index < TRUTH_EXERCISES.length - 1 && <ReactiveButton label={common('next')} onClick={() => dispatch({ type: 'next' })} extraStyles={styles.primary} />}
        </div>
        <div role="status" aria-live="polite" aria-atomic="true" className={`${styles.feedback} ${['empty', 'wrong'].includes(state.feedback) ? styles.error : state.feedback === 'correct' ? styles.success : ''}`}>
            {t(`feedback.${state.feedback || 'ready'}`)}
        </div>
        {state.feedback && <p>{t(`catalog.${exercise.id}.explanation`)}</p>}
        {finished && <div className={styles.help} data-truth-solution>
            <h3>{common('solution')}</h3>
            <div className={styles.scroll} tabIndex={0} role="region" aria-label={t('solutionRegion')}>
                <table className={styles.table}>
                    <caption>{t('solutionCaption', { expression: exercise.expression })}</caption>
                    <thead><tr>{[...exercise.variables, ...exercise.columns].map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
                    <tbody>{rows.map((row, r) => <tr key={r}>
                        {row.map((value, c) => <td key={c}>{truth(value === 'T')}</td>)}
                        {expected[r].map((value, c) => <td key={c}>{truth(value)}</td>)}
                    </tr>)}</tbody>
                </table>
            </div>
        </div>}
        <PracticeStats state={state} t={common} />
    </section>;
}
