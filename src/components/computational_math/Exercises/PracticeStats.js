import styles from './Practice.module.css';

export default function PracticeStats({ state, t }) {
    return <dl className={styles.stats}>
        {['correct', 'assisted', 'errors'].map(key => <div key={key}>
            <dt>{t(`stats.${key}`)}</dt><dd>{state[key]}</dd>
        </div>)}
    </dl>;
}
