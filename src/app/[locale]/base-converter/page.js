import BaseConverter from "@/components/computational_math/BaseConverter";
import JsonLd from "@/components/JsonLd";
import styles from "./page.module.css";

import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/utils/Seo";

// Text components & layouts
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ProprietiesList from '@/components/text/ProprietiesList/ProprietiesList';
import SymbolLegend from '@/components/text/SymbolLegend/SymbolLegend';
import FormulaCard from '@/components/text/FormulaCard/FormulaCard';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import StepsList from '@/components/text/StepsList/StepsList';
import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import TextGenericDesigns from '@/components/text/TextGenericDesigns.module.css';
import FAQ from "@/components/text/FAQ/FAQ";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    return await generateSeo(locale, "baseConverter");
}

export default async function BaseConverterPage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "baseConverter" });
    const formula = "N = \\sum_{i=0}^{n} d_i \\cdot b^i";

    return (
        <div className={styles.page}>
            <JsonLd dataName="baseConverter" locale={locale} />
            <div className={`${TextGenericDesigns.pagesMainTitle} ${styles.mainTitle}`}>{t("mainTitle")}</div>
            <BaseConverter />

            <ArticleLayoutDefault title={t("introSection.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("introSection.paragraph01"),
                        t("introSection.paragraph02"),
                    ]}
                />

                <HighlightSection>
                    <ProprietiesList
                        proprieties={t.raw("introSection.highlights").map((_, index) => ({
                            content: t(`introSection.highlights.${index}`),
                        }))}
                    />
                </HighlightSection>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("definitionSection.title")}>
                <ParagraphSection paragraphs={[t("definitionSection.content")]}/>

                <HighlightSection>
                    <ParagraphSection paragraphs={[t("definitionSection.highlight")]}/>
                </HighlightSection>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("howItWorksSection.title")}>
                <ParagraphSection paragraphs={[t("howItWorksSection.intro")]}/>

                <HighlightSection>
                    <StepsList
                        steps={t.raw("howItWorksSection.steps").map((_, index) => ({
                            content: t(`howItWorksSection.steps.${index}`),
                        }))}
                    />
                </HighlightSection>

                <ParagraphSection paragraphs={[t("howItWorksSection.conclusion")]}/>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("formularySection.title")}>
                <ParagraphSection paragraphs={[t("formularySection.intro")]}/>

                <FormulaCard equations={[formula]} />

                <SymbolLegend
                    symbols={{
                        N: t("formularySection.symbols.N"),
                        d: t("formularySection.symbols.d"),
                        b: t("formularySection.symbols.b"),
                    }}
                />
                <ParagraphSection paragraphs={[t("formularySection.explanation")]}/>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("positionExampleSection.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("positionExampleSection.intro"),
                        t("positionExampleSection.example"),
                    ]}
                />

                <HighlightSection>
                    <StepsList
                        steps={t.raw("positionExampleSection.steps").map((_, index) => ({
                            content: t(`positionExampleSection.steps.${index}`),
                        }))}
                    />
                </HighlightSection>

                <ParagraphSection paragraphs={[t("positionExampleSection.conclusion")]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("practicalExamplesSection.title")}>
                <ParagraphSection paragraphs={[t("practicalExamplesSection.intro")]}/>

                <HighlightSection>
                    <ParagraphSection paragraphs={[t("practicalExamplesSection.example")]}/>
                </HighlightSection>

                <ParagraphSection paragraphs={[t("practicalExamplesSection.conclusion")]}/>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("whyItMattersSection.title")}>
                <ParagraphSection paragraphs={[t("whyItMattersSection.intro")]}/>

                <HighlightSection>
                    <ProprietiesList
                        proprieties={t.raw("whyItMattersSection.list").map((_, index) => ({
                            content: t(`whyItMattersSection.list.${index}`),
                        }))}
                    />
                </HighlightSection>
            </ArticleLayoutDefault>

            <FAQ
                questions={t.raw("faqSection").map((_, index) => ({
                    question: t(`faqSection.${index}.question`),
                    answer: t(`faqSection.${index}.answer`),
                }))}
            />
        </div>
    );
}