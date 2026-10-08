import { getTranslations } from 'next-intl/server';
import ArticleLayoutDefault from '@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import FormulaCard from '@/components/text/FormulaCard/FormulaCard';
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ExampleSection from '@/components/text/ExampleSection/ExampleSection';
import StepsList from '@/components/text/StepsList/StepsList';
import FAQ from '@/components/text/FAQ/FAQ';
import Link from 'next/link';
import styles from './LinearCalculators.module.css';
import textStyles from '@/components/text/TextGenericDesigns.module.css';

export default async function LinearArticle({ locale, system = false }) {
    const t = await getTranslations({ locale, namespace: system ? 'LinearSystemCalculator' : 'LinearFunctionCalculator' });
    return <div className={styles.scope}>
        <ArticleLayoutDefault title={t('article.definitionTitle')}>
            <ParagraphSection paragraphs={[t('article.definition')]} />
            <FormulaCard equations={system ? ['a_1x+b_1y=c_1', 'a_2x+b_2y=c_2'] : ['f(x)=ax+b']} />
            <ParagraphSection paragraphs={[t('article.symbols')]} />
        </ArticleLayoutDefault>
        <ArticleLayoutDefault title={t('article.rootsTitle')}>
            <HighlightSection><ParagraphSection paragraphs={[t('article.roots')]} /></HighlightSection>
        </ArticleLayoutDefault>
        <ArticleLayoutDefault title={t('article.guideTitle')}>
            <HighlightSection><StepsList steps={t.raw('article.guide').map(content => ({ content }))} /></HighlightSection>
        </ArticleLayoutDefault>
        <ArticleLayoutDefault title={t('article.usageTitle')}>
            <ParagraphSection paragraphs={[t('article.usage')]} />
            <ExampleSection title={t('article.exampleTitle')}>
                <ParagraphSection paragraphs={[t('article.example')]} />
                <FormulaCard equations={system ? ['x+y=3,\\quad x-y=1', '2y=2,\\quad y=1,\\quad x=2'] : ['f(x)=2x-4', '2x-4=0\\quad\\Longrightarrow\\quad x=2', 'f(0)=-4']} />
            </ExampleSection>
        </ArticleLayoutDefault>
        <ArticleLayoutDefault title={t('article.graphTitle')}>
            <ParagraphSection paragraphs={[t('article.graph'), t('graphLimited')]} />
        </ArticleLayoutDefault>
        <ArticleLayoutDefault title={t('article.applicationsTitle')}>
            <ParagraphSection paragraphs={[t('article.applications')]} />
            <p className={styles.related}>
                {t('related.intro')}{' '}
                <Link className={textStyles.inlineLink} href={`/${locale}/quadratic-equation-calculator`}>{t('related.quadratic')}</Link>{' '}
                {t('related.connector')}{' '}
                <Link className={textStyles.inlineLink} href={`/${locale}/${system ? 'linear-function-calculator' : 'linear-system-calculator'}`}>{t('related.other')}</Link>.
            </p>
        </ArticleLayoutDefault>
        <FAQ questions={t.raw('faq').map(item => ({ question: item.question, answer: item.answer }))} />
    </div>;
}
