import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import ArticleLayoutDefault from '@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import FAQ from '@/components/text/FAQ/FAQ';
import text from '@/components/text/TextGenericDesigns.module.css';
import BaseConversionPractice from './BaseConversionPractice';
import TruthTablePractice from './TruthTablePractice';
import styles from './Practice.module.css';

export default async function PracticePage({ locale, kind }) {
    const base = kind === 'base';
    const t = await getTranslations({ locale, namespace: base ? 'BaseConversionExercises' : 'TruthTableExercises' });
    return <main className={styles.page}>
        <h1 className={text.pagesMainTitle}>{t('mainTitle')}</h1>
        <p className={styles.intro}>{t('intro')}</p>
        {base ? <BaseConversionPractice /> : <TruthTablePractice />}
        <Link data-practice-tool href={`/${locale}/${base ? 'base-converter' : 'truth-table-generator'}`} className={styles.link}>{t('toolLink')}</Link>
        {t.raw('article.sections').map(section => <ArticleLayoutDefault key={section.title} heading="h2" title={section.title}>
            <ParagraphSection paragraphs={section.paragraphs} />
        </ArticleLayoutDefault>)}
        <FAQ questions={t.raw('article.faq')} />
    </main>;
}
