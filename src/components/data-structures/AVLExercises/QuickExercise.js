"use client";

import { useEffect, useReducer, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { createIntroChallenge, generateQuickChallenge } from '@/utils/avlExercises/quick';
import { exerciseReducer } from '@/utils/avlExercises/lesson';
import ExerciseTree from './ExerciseTree';
import ExerciseControls from './ExerciseControls';
import ReactiveButton from '@/components/ui/ReactiveButton/ReactiveButton';
import styles from './Exercises.module.css';

export default function QuickExercise({ introductory = false }) {
    const p = useTranslations('AVLPractice');
    const locale = useLocale();
    const [state, dispatch] = useReducer((state, action) => action.type === 'challenge' ? action.state : exerciseReducer(state, action), null,
        () => introductory ? createIntroChallenge() : null);
    const [kind, setKind] = useState('single');
    const [currentKind, setCurrentKind] = useState('single');
    const [resetKey, setResetKey] = useState(0);
    const instruction = useRef(null);
    // Generate after hydration so SSR and client never disagree on random values.
    useEffect(() => {
        if (!introductory) dispatch({ type: 'challenge', state: generateQuickChallenge('single') });
    }, [introductory]);
    function next() {
        dispatch({ type: 'challenge', state: generateQuickChallenge(kind, Math.random, state?.sequence) });
        setCurrentKind(kind); setResetKey(value => value + 1);
        instruction.current?.focus({ preventScroll: true });
    }
    return <section className={`${styles.tool} ${styles.quick}`} data-avl-tool={introductory ? 'intro' : 'quick'} aria-label={p(introductory ? 'introTitle' : 'quickTitle')}>
        <div className={styles.task}>
            <h3 tabIndex={-1} ref={instruction}>{p(state?.phase === 'COMPLETED' ? 'quickDone' : 'quickTask')}</h3>
            <p>{p(currentKind === 'single' ? 'singleLabel' : 'doubleLabel')}</p>
        </div>
        {state ? <>
            <ExerciseTree tree={state.tree} selected={state.selected} showBalance={state.showBalance} compact resetKey={resetKey}
                onSelect={id => dispatch({ type: 'select', id })} />
            <ExerciseControls state={state} dispatch={dispatch} quick introductory={introductory} />
            {state.phase === 'COMPLETED' && (introductory ?
                <Link className={styles.link} href={`/${locale}/avl-tree-exercises`}>{p('continuePractice')}</Link> : <div className={styles.nextChallenge}>
                <label>{p('nextKind')}<select value={kind} onChange={event => setKind(event.target.value)}>
                    <option value="single">{p('singleLabel')}</option><option value="double">{p('doubleLabel')}</option>
                </select></label>
                <ReactiveButton label={p('nextChallenge')} onClick={next} />
            </div>)}
        </> : <p>{p('loading')}</p>}
    </section>;
}
