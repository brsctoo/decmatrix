import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { generateSeo } from '@/utils/Seo';
import AVLExercises from '@/components/data-structures/AVLExercises/AVLExercises';
import QuickExercise from '@/components/data-structures/AVLExercises/QuickExercise';
import RotationDiagrams from '@/components/data-structures/AVLExercises/RotationDiagrams';
import ArticleLayoutDefault from '@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import FAQ from '@/components/text/FAQ/FAQ';
import text from '@/components/text/TextGenericDesigns.module.css';
import styles from '@/components/data-structures/AVLExercises/Exercises.module.css';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const metadata = await generateSeo(locale, 'AVLExercises', 'avl-tree-exercises');
    return { ...metadata, openGraph: {
        title: metadata.title, description: metadata.description, url: metadata.alternates.canonical,
        type: 'website', siteName: 'Decmatrix', locale: locale === 'pt' ? 'pt_BR' : 'en_US',
        alternateLocale: [locale === 'pt' ? 'en_US' : 'pt_BR'],
    } };
}

export default async function Page({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'AVLExercises' });
    const p = await getTranslations({ locale, namespace: 'AVLPractice' });
    return <main className={styles.page}>
        <h1 className={text.pagesMainTitle}>{t('mainTitle')}</h1>
        <section className={styles.practiceMode} aria-label={p('fullTitle')}>
            <h2>{p('fullTitle')}</h2>
            <p>{p('fullIntro')}</p>
            <AVLExercises />
        </section>
        <section className={styles.practiceMode} aria-label={p('quickTitle')}>
            <h2>{p('quickTitle')}</h2>
            <p>{p('quickIntro')}</p>
            <QuickExercise />
        </section>
        <Link className={styles.link} href={`/${locale}/avl-tree-builder`}>{t('simulator')}</Link>
        <div className={styles.learning}>
        <ArticleLayoutDefault heading="h2" title={t('article.howTitle')}><ParagraphSection paragraphs={p.raw('howSteps')} /></ArticleLayoutDefault>
        <ArticleLayoutDefault heading="h2" title={p('bstTitle')}><ParagraphSection paragraphs={[p('bst'), p('bstExample'), p('bstAction')]} /></ArticleLayoutDefault>
        <ArticleLayoutDefault heading="h2" title={t('article.balanceTitle')}><ParagraphSection paragraphs={[t('article.balance'), p('heightExample')]} /></ArticleLayoutDefault>
        <ArticleLayoutDefault heading="h2" title={p('ancestorTitle')}><ol className={styles.articleList}>{p.raw('ancestorSteps').map(item => <li key={item}>{item}</li>)}</ol></ArticleLayoutDefault>
        <ArticleLayoutDefault heading="h2" title={t('article.casesTitle')}>
            <ul className={styles.articleList}>{t.raw('article.cases').map(item => <li key={item}>{item}</li>)}</ul>
            <ParagraphSection paragraphs={[p('caseWarning')]} />
        </ArticleLayoutDefault>
        <ArticleLayoutDefault heading="h2" title={p('workedTitle')}>
            {p.raw('examples').map((example, index) => <section className={styles.example} key={example.title}>
                <h3>{example.title}</h3>
                <ol className={styles.articleList}>{example.steps.map(step => <li key={step}>{step}</li>)}</ol>
                <RotationDiagrams kind={['LL', 'RR', 'LR', 'RL'][index]} p={p} />
            </section>)}
        </ArticleLayoutDefault>
        <ArticleLayoutDefault heading="h2" title={p('errorsTitle')}><ul className={styles.articleList}>{p.raw('commonErrors').map(item => <li key={item}>{item}</li>)}</ul></ArticleLayoutDefault>
        <FAQ questions={[...t.raw('article.faq'), ...p.raw('faq')]} />
        </div>
    </main>;
}
