import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import styles from './TreeRelatedLinks.module.css';

const pages = [
    { slug: 'avl-tree-builder', key: 'avl' },
    { slug: 'avl-tree-exercises', key: 'avlExercises' },
    { slug: 'bst-tree-builder', key: 'bst' },
    { slug: 'bst-tree-exercises', key: 'bstExercises' },
];

export default async function TreeRelatedLinks({ locale, current, standalone = false }) {
    const t = await getTranslations({ locale, namespace: 'TreeRelatedLinks' });
    const heading = `related-${current}`;
    return <section className={`${styles.section} ${standalone ? styles.standalone : ''}`}
        aria-labelledby={heading} data-tree-related>
        <h2 id={heading}>{t('title')}</h2>
        <nav aria-labelledby={heading}>
            <ul className={styles.links}>
                {pages.filter(page => page.slug !== current).map(page => <li key={page.slug}>
                    <Link href={`/${locale}/${page.slug}`} className={styles.card}>
                        <strong>{t(`${page.key}.title`)} <span aria-hidden="true">→</span></strong>
                        <span>{t(`${page.key}.description`)}</span>
                    </Link>
                </li>)}
            </ul>
        </nav>
    </section>;
}
