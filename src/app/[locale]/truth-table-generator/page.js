import TruthTable from "@/components/computational_math/TruthTable";
import JsonLd from "@/components/JsonLd";
import styles from "./page.module.css";

import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/utils/Seo";

import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import FAQ from "@/components/text/FAQ/FAQ";
import FormulaCard from "@/components/text/FormulaCard/FormulaCard";
import HighlightSection from "@/components/text/HighlightSection/HighlightSection";
import ParagraphSection from "@/components/text/ParagraphSection/ParagraphSection";
import ProprietiesList from "@/components/text/ProprietiesList/ProprietiesList";
import StepsList from "@/components/text/StepsList/StepsList";
import SymbolLegend from "@/components/text/SymbolLegend/SymbolLegend";
import TextGenericDesigns from "@/components/text/TextGenericDesigns.module.css";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    return await generateSeo(locale, "truthTable");
}

export default async function TruthTablePage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "truthTable" });
    const formula = "L = 2^n";

    return (
        <div className={styles.page}>
            <JsonLd dataName="truthTable" />
            <div className={`${TextGenericDesigns.pagesMainTitle} ${styles.mainTitle}`}>{t("mainTitle")}</div>
            <TruthTable
                labels={{
                    inputLabel: t("ui.inputLabel"),
                    inputPlaceholder: t("ui.inputPlaceholder"),
                    generateButtonLabel: t("ui.generateButtonLabel"),
                    variablesLabel: t("ui.variablesLabel"),
                    errorEmptyExpression: t("ui.errorEmptyExpression"),
                    errorNoVariables: t("ui.errorNoVariables"),
                    insertButtonAriaLabel: t("ui.insertButtonAriaLabel"),
                }}
            />

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
                <ParagraphSection paragraphs={[t("definitionSection.content")]} />

                <HighlightSection>
                    <ParagraphSection paragraphs={[t("definitionSection.highlight")]} />
                </HighlightSection>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("howItWorksSection.title")}>
                <ParagraphSection paragraphs={[t("howItWorksSection.intro")]} />

                <HighlightSection>
                    <StepsList
                        steps={t.raw("howItWorksSection.steps").map((_, index) => ({
                            content: t(`howItWorksSection.steps.${index}`),
                        }))}
                    />
                </HighlightSection>

                <ParagraphSection paragraphs={[t("howItWorksSection.conclusion")]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("operatorsSection.title")}>
                <HighlightSection>
                    <SymbolLegend
                        symbols={{
                            "¬": t("operatorsSection.symbols.not"),
                            "∧": t("operatorsSection.symbols.and"),
                            "∨": t("operatorsSection.symbols.or"),
                            "→": t("operatorsSection.symbols.implication"),
                            "↔": t("operatorsSection.symbols.biconditional"),
                            "⊻": t("operatorsSection.symbols.xor"),
                        }}
                    />
                </HighlightSection>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("formularySection.title")}>
                <ParagraphSection paragraphs={[t("formularySection.intro")]} />

                <FormulaCard equations={[formula]} />

                <SymbolLegend
                    symbols={{
                        L: t("formularySection.symbols.L"),
                        n: t("formularySection.symbols.n"),
                    }}
                />
                <ParagraphSection paragraphs={[t("formularySection.explanation")]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("exampleSection.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("exampleSection.intro"),
                        t("exampleSection.example"),
                    ]}
                />

                <HighlightSection>
                    <StepsList
                        steps={t.raw("exampleSection.steps").map((_, index) => ({
                            content: t(`exampleSection.steps.${index}`),
                        }))}
                    />
                </HighlightSection>

                <ParagraphSection paragraphs={[t("exampleSection.conclusion")]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("practicalExamplesSection.title")}>
                <ParagraphSection paragraphs={[t("practicalExamplesSection.intro")]} />

                <HighlightSection>
                    <ParagraphSection paragraphs={[t("practicalExamplesSection.example")]} />
                </HighlightSection>

                <ParagraphSection paragraphs={[t("practicalExamplesSection.conclusion")]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("whyItMattersSection.title")}>
                <ParagraphSection paragraphs={[t("whyItMattersSection.intro")]} />

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