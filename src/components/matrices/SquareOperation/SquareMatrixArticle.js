import Link from "next/link";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import SquareOperation from "./SquareOperation";
import MatrixDisplay from "../Display/Display";
import HighlightSection from "@/components/text/HighlightSection/HighlightSection";
import ProprietiesList from "@/components/text/ProprietiesList/ProprietiesList";
import SymbolLegend from "@/components/text/SymbolLegend/SymbolLegend";
import FormulaCard from "@/components/text/FormulaCard/FormulaCard";
import ParagraphSection from "@/components/text/ParagraphSection/ParagraphSection";
import StepsList from "@/components/text/StepsList/StepsList";
import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import TextGenericDesigns from "@/components/text/TextGenericDesigns.module.css";
import FAQ from "@/components/text/FAQ/FAQ";
import style from "@/app/[locale]/matrix-basic-operations/page.module.css";

// Same section order/layout as matrix-multiplication; examples use the existing matrix display.
export default async function SquareMatrixArticle({ locale, operation }) {
    const namespace = operation === 'determinant' ? 'matrixDeterminant' : 'matrixInverse';
    const t = await getTranslations({ locale, namespace });
    const example = { rows: 2, cols: 2, data: [[4, 7], [2, 6]] };
    const inverseExample = { rows: 2, cols: 2, data: [['3/5', '-7/10'], ['-1/5', '2/5']] };
    const rich = {
        strong: chunks => <strong>{chunks}</strong>,
        linkInverse: chunks => <Link href={`/${locale}/matrix-inverse`} className={TextGenericDesigns.inlineLink}>{chunks}</Link>,
        linkDeterminant: chunks => <Link href={`/${locale}/matrix-determinant`} className={TextGenericDesigns.inlineLink}>{chunks}</Link>,
        linkMultiplication: chunks => <Link href={`/${locale}/matrix-multiplication`} className={TextGenericDesigns.inlineLink}>{chunks}</Link>,
    };

    return (
        <div>
            <JsonLd dataName={namespace} />
            <h1 className={TextGenericDesigns.pagesMainTitle}>{t('mainTitle')}</h1>
            <SquareOperation operation={operation} />

            <ArticleLayoutDefault title={t('usageTutorial.title')} heading="h2">
                <ParagraphSection paragraphs={[t('usageTutorial.intro')]} />
                <HighlightSection>
                    <StepsList steps={t.raw('usageTutorial.steps').map((_, index) => ({
                        content: t.rich(`usageTutorial.steps.${index}`, rich),
                    }))} />
                </HighlightSection>
                <ParagraphSection paragraphs={[t('usageTutorial.observation'), t('usageTutorial.conclusion')]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t('exampleCalculation.title')} heading="h2">
                <ParagraphSection paragraphs={[t('exampleCalculation.scenario')]} />
                <MatrixDisplay matrix={example} otherClasses={style.matrixDisplayExample} protectOverflow />
                <ParagraphSection paragraphs={[t.rich('exampleCalculation.calculationStep', rich)]} />
                <FormulaCard equations={t.raw('exampleCalculation.equations')} />
                {operation === 'inverse' && <MatrixDisplay matrix={inverseExample} otherClasses={style.matrixDisplayResult} protectOverflow />}
                <ParagraphSection paragraphs={[t('exampleCalculation.conclusion')]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t('definitionSection.title')} heading="h2">
                <ParagraphSection paragraphs={[t('definitionSection.intro')]} />
                <HighlightSection>
                    <ParagraphSection paragraphs={[t.rich('definitionSection.existence', rich)]} />
                </HighlightSection>
                <h3 className={TextGenericDesigns.pagesSubTitle}>{t('definitionSection.proprieties.title')}</h3>
                <ProprietiesList proprieties={t.raw('definitionSection.proprieties.list').map((_, index) => ({
                    content: t.rich(`definitionSection.proprieties.list.${index}`, rich),
                }))} />
                <ParagraphSection paragraphs={[t.rich('definitionSection.importance', rich)]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t('formularySection.title')} heading="h2">
                <ParagraphSection paragraphs={[t('formularySection.intro')]} />
                <FormulaCard equations={t.raw('formularySection.equations')} />
                <SymbolLegend symbols={t.raw('formularySection.symbols')} />
                <ParagraphSection paragraphs={[t('formularySection.observation')]} />
            </ArticleLayoutDefault>

            <FAQ questions={t.raw('faqSection').map((_, index) => ({
                question: t(`faqSection.${index}.question`),
                answer: t(`faqSection.${index}.answer`),
            }))} />
        </div>
    );
}
