'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import InputField from '@/components/ui/InputField';
import ReactiveButton from '@/components/ui/ReactiveButton';
import { BASES, baseReducer, baseResolution, baseDivisionSteps, generateBaseChallenge, initialBaseState } from '@/utils/computationalExercises/base';
import PracticeStats from './PracticeStats';
import styles from './Practice.module.css';

export default function BaseConversionPractice() {
    const t = useTranslations('BaseConversionExercises');
    const common = useTranslations('ComputationalPractice');
    const [mode, setMode] = useState('mixed');
    const [from, setFrom] = useState(10);
    const [to, setTo] = useState(2);
    const [state, dispatch] = useReducer(baseReducer, initialBaseState);
    const heading = useRef(null);
    const challenge = state.challenge;
    const finished = state.phase !== 'active';
    useEffect(() => { if (challenge) heading.current?.focus(); }, [challenge]);
    const next = () => dispatch({ type: 'new', challenge: generateBaseChallenge(mode === 'pair' ? { from, to } : {}, challenge) });
    function changeFrom(value) {
        const base = Number(value);
        setFrom(base);
        if (base === to) setTo(BASES.find(candidate => candidate !== base));
    }
    return <section className={styles.board} data-base-practice aria-label={t('practiceLabel')}>
        <div className={styles.settings}>
            <label>{t('mode')}<select value={mode} onChange={event => setMode(event.target.value)} data-base-mode>
                <option value="mixed">{t('mixed')}</option><option value="pair">{t('pair')}</option>
            </select></label>
            {mode === 'pair' && <>
                <label>{t('from')}<select value={from} onChange={event => changeFrom(event.target.value)} data-base-from>
                    {BASES.map(base => <option key={base} value={base}>{t(`bases.${base}`)}</option>)}
                </select></label>
                <label>{t('to')}<select value={to} onChange={event => setTo(Number(event.target.value))} data-base-to>
                    {BASES.filter(base => base !== from).map(base => <option key={base} value={base}>{t(`bases.${base}`)}</option>)}
                </select></label>
            </>}
            <ReactiveButton label={common(challenge ? 'new' : 'start')} onClick={next} />
        </div>
        <p className={styles.note}>{t('settingsNote')}</p>
        {challenge && <>
            <h2 ref={heading} tabIndex={-1} data-base-task>{t('task', challenge)}</h2>
            <form className={styles.answerForm} onSubmit={event => { event.preventDefault(); dispatch({ type: 'check' }); }}>
                <InputField label={t('answer', { base: challenge.to })} type="text" value={state.answer}
                    onChange={event => dispatch({ type: 'answer', value: event.target.value })}
                    disabled={finished} spellCheck={false} autoCapitalize="characters" aria-describedby="base-answer-guide base-feedback"
                    aria-invalid={['wrong', 'invalid'].includes(state.feedback) ? true : undefined}
                    data-result={['correct', 'assisted'].includes(state.feedback) ? 'correct' : undefined} />
                <p id="base-answer-guide" className={styles.note}>{t('answerGuide')}</p>
                <ReactiveButton label={common('check')} disabled={finished} extraStyles={styles.primary} />
            </form>
            <div id="base-feedback" role="status" aria-live="polite" aria-atomic="true" className={`${styles.feedback} ${['wrong', 'empty', 'invalid'].includes(state.feedback) ? styles.error : ['correct', 'assisted'].includes(state.feedback) ? styles.success : ''}`}>
                {state.feedback ? t(`feedback.${state.feedback}`, { base: challenge.to }) : t('ready')}
            </div>
            <div className={styles.actions}>
                {!finished && <>
                    <ReactiveButton label={common('hint')} disabled={state.hint} onClick={() => dispatch({ type: 'hint' })} />
                    <ReactiveButton label={common('reveal')} onClick={() => dispatch({ type: 'reveal' })} />
                </>}
                <ReactiveButton label={common('repeat')} onClick={() => dispatch({ type: 'repeat' })} />
                {finished && <ReactiveButton label={common('next')} onClick={next} extraStyles={styles.primary} />}
            </div>
            {state.hint && <p className={styles.help}>{t('hintText', { from: challenge.from, to: challenge.to })}</p>}
            {finished && <div className={styles.help} data-base-solution>
                <h3>{common('solution')}</h3>
                <p>{baseResolution(challenge)}</p>
                <p>{t('result', challenge)}</p>
                <p>{t('procedure', { to: challenge.to })}</p>
                <ol className={styles.articleList}>{baseDivisionSteps(challenge).map((step, index) => <li key={index}>{t('divisionStep', step)}</li>)}</ol>
            </div>}
        </>}
        <PracticeStats state={state} t={common} />
    </section>;
}
