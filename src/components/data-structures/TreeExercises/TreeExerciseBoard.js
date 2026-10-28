"use client";

import { useEffect, useReducer, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import ReactiveButton from '@/components/ui/ReactiveButton/ReactiveButton';
import { exerciseReducer, score } from '@/utils/avlExercises/lesson';
import { generateExercise, MODES } from '@/utils/avlExercises/generator';
import { generateBstExercise } from '@/utils/bstExercises/generator';
import ExerciseTree from '../AVLExercises/ExerciseTree';
import ExerciseControls from '../AVLExercises/ExerciseControls';
import styles from '../AVLExercises/Exercises.module.css';
import useExerciseTranslations from './useExerciseTranslations';

export default function TreeExerciseBoard({ variant = 'avl' }) {
    const bst = variant === 'bst';
    const locale = useLocale();
    const t = useExerciseTranslations(variant);
    const p = useTranslations('AVLPractice');
    const [state, dispatch] = useReducer(exerciseReducer, null);
    const [mode, setMode] = useState(bst ? 'bst' : 'mixed');
    const [count, setCount] = useState(8);
    const [settings, setSettings] = useState(true);
    const [resetKey, setResetKey] = useState(0);
    const instruction = useRef(null);
    useEffect(() => { instruction.current?.focus({ preventScroll: true }); }, [state?.index, state?.phase, state?.pending.length, resetKey]);
    function start() {
        let sequence = bst ? generateBstExercise(count) : generateExercise(mode, count);
        if (state && sequence.join(',') === state.sequence.join(',')) sequence = sequence.map(value => value + 1);
        dispatch({ type: 'start', sequence, mode, variant });
        setSettings(false); setResetKey(value => value + 1);
    }
    function retry() { dispatch({ type: 'retry' }); setSettings(false); setResetKey(value => value + 1); }
    const completed = state?.phase === 'COMPLETED';
    const modeLabel = value => bst || value === 'mixed' ? t(value) : value;
    const counts = bst ? Array.from({ length: 30 }, (_, i) => i + 1) : Array.from({ length: 15 }, (_, i) => i + 6);
    const stats = <dl className={`${styles.stats} ${bst ? styles.bstStats : ''}`}>{(bst ? ['correct', 'errors', 'hints'] : ['correct', 'errors', 'rotations', 'hints']).map(key => <div key={key}><dt>{t(key)}</dt><dd>{state?.[key]}</dd></div>)}</dl>;
    return <section className={styles.tool} data-tree-exercise={variant} data-avl-tool={!bst ? 'full' : undefined} data-bst-tool={bst ? 'full' : undefined} aria-label={t('mainTitle')}>
        {state && <><div className={styles.progress}>
            {!bst && <strong>{t('currentMode', { mode: modeLabel(state.mode) })}</strong>}
            <label>{t('progress', { done: state.index, total: state.sequence.length })}<progress value={state.index} max={state.sequence.length} /></label>
        </div></>}
        <details className={styles.settings} open={settings} onToggle={event => setSettings(event.currentTarget.open)}>
            <summary>{p('settings')}</summary>
            <fieldset className={styles.configuration}>
                <legend className={styles.srOnly}>{t('configuration')}</legend>
                {!bst && <label>{t('mode')}<select value={mode} onChange={event => setMode(event.target.value)}>
                    {MODES.map(item => <option key={item} value={item}>{modeLabel(item)}</option>)}
                </select></label>}
                <label>{t('count')}<select value={count} onChange={event => setCount(Number(event.target.value))}>
                    {counts.map(value => <option key={value} value={value}>{value}</option>)}
                </select></label>
                <ReactiveButton label={t(state ? 'new' : 'start')} onClick={start} />
                {state && <ReactiveButton label={t('retry')} onClick={retry} />}
            </fieldset>
            {state && <p className={styles.note}>{t('replaceNote')}</p>}
        </details>
        {state && <>
            <div className={styles.workspace}>
            <ExerciseTree tree={state.tree} selected={state.selected} showBalance={state.showBalance} resetKey={resetKey}
                inserting={state.phase === 'INSERTING'} nextValue={state.sequence[state.index]}
                rotating={state.phase === 'REBALANCING'} onRotate={direction => dispatch({ type: 'rotate', direction })}
                onInsert={(parentId, side) => dispatch({ type: 'insert', parentId, side })}
                onSelect={id => dispatch({ type: 'select', id })} />
            <ExerciseControls state={state} dispatch={dispatch} instructionRef={instruction} />
            </div>
            {completed && <section className={styles.result} aria-label={t('result')}>
                <h2 ref={instruction} tabIndex={-1}>{t('result')}</h2>
                <p>{t('values', { values: state.sequence.join(', ') })}</p>
                {bst && <p>{t('insertedNodes', { count: state.nodeCount })}</p>}
                <strong>{t('score', { score: score(state) })}</strong>
                <p className={styles.note}>{t('scoreRule')}</p>
                <div className={styles.actions}><ReactiveButton label={t('retry')} onClick={retry} /><ReactiveButton label={t('new')} onClick={start} /></div>
                {bst && <Link href={`/${locale}/bst-tree-builder`} className={styles.link}>{t('openSimulator')}</Link>}
            </section>}
            {stats}
        </>}
    </section>;
}
