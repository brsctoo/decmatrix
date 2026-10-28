"use client";

import { useTranslations } from 'next-intl';
import ReactiveButton from '@/components/ui/ReactiveButton/ReactiveButton';
import { hintDetails } from '@/utils/avlExercises/lesson';
import styles from './Exercises.module.css';
import useExerciseTranslations from '../TreeExercises/useExerciseTranslations';

// Shared manual actions/feedback/help for the complete lesson and quick puzzles.
export default function ExerciseControls({ state, dispatch, quick = false, introductory = false, instructionRef }) {
    const t = useExerciseTranslations(state.variant);
    const p = useTranslations('AVLPractice');
    const completed = state.phase === 'COMPLETED';
    const selected = state.tree.nodes.find(node => node.id === state.selected);
    const details = completed ? null : hintDetails(state);
    function hint(level) {
        if (details.inserting && details.side === 'root') return t('hintRoot');
        return t(`hint${details.inserting ? 'Insert' : 'Rotate'}${level}`, {
            node: details.node ?? '', ancestor: details.ancestor ?? '', side: t(details.side),
            value: state.sequence[state.index], root: state.tree.root?.value ?? '',
            rootSide: state.tree.root ? t(state.sequence[state.index] < state.tree.root.value ? 'left' : 'right') : '',
        });
    }
    return <div className={styles.controlPanel}>
        {!completed && <>
            <div className={styles.decision} data-exercise-decision>
            <h2 ref={instructionRef} tabIndex={-1}>{quick ? p('quickTask') : t(state.phase === 'INSERTING' ? 'next' : 'rebalancing', { value: state.sequence[state.index] })}</h2>
            <p className={styles.selectedValue}>{selected ? t('selected', { value: selected.value }) : t('noSelection')}</p>
            <p className={styles.directInstruction}>{p(state.phase === 'INSERTING' ? 'directInsert' : 'directRotate')}</p>
            <details className={styles.manualControls}>
            <summary>{p(state.phase === 'INSERTING' ? 'manualInsert' : 'rotationControls')}</summary>
            {state.tree.root && <label className={styles.selection}>
                <span>{p('chooseNode')}</span>
                <select data-node-select value={state.selected ?? ''} onChange={event => dispatch({ type: 'select', id: event.target.value ? Number(event.target.value) : null })}>
                    <option value="">{t('noSelection')}</option>
                    {[...state.tree.nodes].sort((a, b) => a.value - b.value).map(node => <option key={node.id} value={node.id}>{node.value}</option>)}
                </select>
            </label>}
            <div className={styles.actions}>
                {state.phase === 'INSERTING' ? !state.tree.root
                    ? <ReactiveButton label={t('root')} onClick={() => dispatch({ type: 'insert', parentId: null, side: 'root' })} />
                    : ['left', 'right'].map(side => <ReactiveButton key={side} label={t(side === 'left' ? 'insertLeft' : 'insertRight')}
                        disabled={!selected} onClick={() => dispatch({ type: 'insert', parentId: state.selected, side })} />)
                    : ['left', 'right'].map(direction => <ReactiveButton key={direction} label={t(direction === 'left' ? 'rotateLeft' : 'rotateRight')}
                        disabled={!selected} onClick={() => dispatch({ type: 'rotate', direction })} />)}
            </div>
            </details>
            </div>
        </>}
        <div role="status" aria-live="polite" aria-atomic="true" className={`${styles.feedback} ${state.feedback.error ? styles.error : ''}`}>
            {quick && completed ? p(introductory ? 'introSuccess' : 'quickSuccess') : t(`feedback.${state.feedback.key}`, state.feedback.values)}
            {state.feedback.error && <span> ({t('errors')}: {state.errors})</span>}
        </div>
        {!completed && <details className={styles.help}>
            <summary>{p('help')}</summary>
            {state.variant !== 'bst' && <><label className={styles.checkbox}><input type="checkbox" checked={state.showBalance}
                onChange={event => dispatch({ type: 'balance', value: event.target.checked })} />{t('showBalance')}</label>
            <p className={styles.note}>{t('balanceRule')}</p></>}
            <p className={styles.note}>{p('panHelp')}</p>
            <button type="button" onClick={() => dispatch({ type: 'hint' })} disabled={state.hintLevel >= (state.tree.root ? 4 : 1)}>{t('hint')}</button>
            <ol aria-live="polite">{Array.from({ length: state.hintLevel }, (_, index) => <li key={index}>{hint(index + 1)}</li>)}</ol>
            {state.hintLevel >= (state.tree.root ? 4 : 1) && <p className={styles.note}>{t('hintLimit')}</p>}
        </details>}
    </div>;
}
