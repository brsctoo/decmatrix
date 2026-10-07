import { useId } from 'react';
import { useTranslations } from 'next-intl';
import FormulaCard from '@/components/text/FormulaCard/FormulaCard';
import StepsList from '@/components/text/StepsList/StepsList';
import styles from './DeterminantResult.module.css';

export default function DeterminantResult({ result }) {
    const t = useTranslations('matrixDeterminantComponent');
    const headingId = useId();
    return <div className={styles.content}>
        <div className={styles.resultScroll} tabIndex={0} aria-label={t('resultTitle')}>
            <p className={styles.value}>{t('resultLabel', { relation: result.relation, value: result.display })}</p>
        </div>
        {result.zero && <p className={styles.singular}>{t(result.exact ? 'singularResult' : 'approximateZero')}</p>}
        <p className={styles.note}>{t(result.exact ? 'exactNote' : 'precisionNote')}</p>
        {result.steps.length ? <section aria-labelledby={headingId} className={styles.steps}>
            <h3 id={headingId}>{t('stepsTitle')}</h3>
            <p>{t(`methods.order${result.order}`)}</p>
            <StepsList steps={result.steps.map(step => ({ content: <>
                <span>{t(`steps.${step.key}`)}</span>
                <FormulaCard equations={step.equations} />
            </> }))} />
        </section> : <p className={styles.availability}>{t('stepsUnavailable')}</p>}
    </div>;
}
