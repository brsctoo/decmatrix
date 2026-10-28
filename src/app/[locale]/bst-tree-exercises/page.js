import TreeRelatedLinks from '@/components/data-structures/TreeExercises/TreeRelatedLinks';
import { getTranslations } from 'next-intl/server';
import { generateSeo } from '@/utils/Seo';
import TreeExerciseBoard from '@/components/data-structures/TreeExercises/TreeExerciseBoard';
import BSTExample from '@/components/data-structures/TreeExercises/BSTExample';
import ArticleLayoutDefault from '@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import FAQ from '@/components/text/FAQ/FAQ';
import text from '@/components/text/TextGenericDesigns.module.css';
import styles from '@/components/data-structures/AVLExercises/Exercises.module.css';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const metadata = await generateSeo(locale, 'BSTExercises', 'bst-tree-exercises');
    return { ...metadata, openGraph: {
        title: metadata.title, description: metadata.description, url: metadata.alternates.canonical,
        type: 'website', siteName: 'Decmatrix', locale: locale === 'pt' ? 'pt_BR' : 'en_US',
        alternateLocale: [locale === 'pt' ? 'en_US' : 'pt_BR'],
    } };
}

export default async function Page({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'BSTExercises' });
    return <main className={`${styles.page} ${styles.bstPage}`}>
        <h1 className={text.pagesMainTitle}>{t('mainTitle')}</h1>
        <TreeExerciseBoard variant="bst" />
        <TreeRelatedLinks locale={locale} current="bst-tree-exercises" />
        <div className={styles.learning}>
            <ArticleLayoutDefault heading="h2" title={t('article.howTitle')}>
                <ParagraphSection paragraphs={[t('article.how')]} />
            </ArticleLayoutDefault>
            <ArticleLayoutDefault heading="h2" title={t('article.insertTitle')}>
                <ol className={styles.articleList}>{t.raw('article.steps').map(step => <li key={step}>{step}</li>)}</ol>
            </ArticleLayoutDefault>
            <ArticleLayoutDefault heading="h2" title={t('article.exampleTitle')}>
                <BSTExample t={t} />
                <ParagraphSection paragraphs={[t('article.example')]} />
            </ArticleLayoutDefault>
            <ArticleLayoutDefault heading="h2" title={t('article.errorsTitle')}>
                <ul className={styles.articleList}>{t.raw('article.errors').map(item => <li key={item}>{item}</li>)}</ul>
            </ArticleLayoutDefault>
            <FAQ questions={t.raw('article.faq')} />
        </div>
    </main>;
}
