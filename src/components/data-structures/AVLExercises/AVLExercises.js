"use client";

import { useEffect, useReducer, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import ReactiveButton from '@/components/ui/ReactiveButton/ReactiveButton';
import { exerciseReducer, score } from '@/utils/avlExercises/lesson';
import { generateExercise, MODES } from '@/utils/avlExercises/generator';
import ExerciseTree from './ExerciseTree';
import ExerciseControls from './ExerciseControls';
import styles from './Exercises.module.css';

export default function AVLExercises() {
    const t = useTranslations('AVLExercises');
    const p = useTranslations('AVLPractice');
    const [state, dispatch] = useReducer(exerciseReducer, null);
    const [mode, setMode] = useState('mixed');
    const [count, setCount] = useState(8);
    const [settings, setSettings] = useState(true);
    const [resetKey, setResetKey] = useState(0);
    const instruction = useRef(null);
    useEffect(() => { instruction.current?.focus({ preventScroll: true }); }, [state?.index, state?.phase, state?.pending.length, resetKey]);
    function start() {
        let sequence = generateExercise(mode, count);
        if (state && sequence.join(',') === state.sequence.join(',')) sequence = sequence.map(value => value + 1);
        dispatch({ type: 'start', sequence, mode });
        setSettings(false); setResetKey(value => value + 1);
    }
    function retry() { dispatch({ type: 'retry' }); setSettings(false); setResetKey(value => value + 1); }
    const completed = state?.phase === 'COMPLETED';
    const stats = <dl className={styles.stats}>{['correct', 'errors', 'rotations', 'hints'].map(key => <div key={key}><dt>{t(key)}</dt><dd>{state?.[key]}</dd></div>)}</dl>;
    return <section className={styles.tool} data-avl-tool="full" aria-label={t('mainTitle')}>
        {state && <><div className={styles.progress}>
            <strong>{t('currentMode', { mode: state.mode === 'mixed' ? t('mixed') : state.mode })}</strong>
            <label>{t('progress', { done: state.index, total: state.sequence.length })}<progress value={state.index} max={state.sequence.length} /></label>
        </div></>}
        <details className={styles.settings} open={settings} onToggle={event => setSettings(event.currentTarget.open)}>
            <summary>{p('settings')}</summary>
            <fieldset className={styles.configuration}>
                <legend className={styles.srOnly}>{t('configuration')}</legend>
                <label>{t('mode')}<select value={mode} onChange={event => setMode(event.target.value)}>
                    {MODES.map(item => <option key={item} value={item}>{item === 'mixed' ? t('mixed') : item}</option>)}
                </select></label>
                <label>{t('count')}<select value={count} onChange={event => setCount(Number(event.target.value))}>
                    {Array.from({ length: 15 }, (_, i) => i + 6).map(value => <option key={value} value={value}>{value}</option>)}
                </select></label>
                <ReactiveButton label={t(state ? 'new' : 'start')} onClick={start} />
                {state && <ReactiveButton label={t('retry')} onClick={retry} />}
            </fieldset>
            {state && <p className={styles.note}>{t('replaceNote')}</p>}
        </details>
        {state && <>
            {!completed && <div className={styles.task}>
                <h2 ref={instruction} tabIndex={-1}>{t(state.phase === 'INSERTING' ? 'next' : 'rebalancing', { value: state.sequence[state.index] })}</h2>
                {state.tree.root && <p>{p(state.phase === 'INSERTING' ? 'insertTask' : 'rotateTask')}</p>}
            </div>}
            <ExerciseTree tree={state.tree} selected={state.selected} showBalance={state.showBalance} resetKey={resetKey}
                onSelect={id => dispatch({ type: 'select', id })} />
            <ExerciseControls state={state} dispatch={dispatch} />
            {completed && <section className={styles.result} aria-label={t('result')}>
                <h2 ref={instruction} tabIndex={-1}>{t('result')}</h2>
                <p>{t('values', { values: state.sequence.join(', ') })}</p>
                <strong>{t('score', { score: score(state) })}</strong>
                <p className={styles.note}>{t('scoreRule')}</p>
                <div className={styles.actions}><ReactiveButton label={t('retry')} onClick={retry} /><ReactiveButton label={t('new')} onClick={start} /></div>
            </section>}
            {stats}
        </>}
    </section>;
}
