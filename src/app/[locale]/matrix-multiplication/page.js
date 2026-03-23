import JsonLd from "@/components/JsonLd";

import MatrixMultiplication from "@/components/matrices/Multiplication/Multiplication";
import Image from "next/image";

import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/utils/Seo";

// Images
import multiplicationExample01_pt from "@/assets/algebra/matrix_multiplication/multiplication_example01_pt.png";
import multiplicationExample02_pt from "@/assets/algebra/matrix_multiplication/multiplication_example02_pt.png";
import multiplicationResult_pt from "@/assets/algebra/matrix_multiplication/multiplication_result_example_pt.png";

import multiplicationExample01_en from "@/assets/algebra/matrix_multiplication/multiplication_example01_en.png";
import multiplicationExample02_en from "@/assets/algebra/matrix_multiplication/multiplication_example02_en.png";
import multiplicationResult_en from "@/assets/algebra/matrix_multiplication/multiplication_result_example_en.png";

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
import style from "./page.module.css";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    return await generateSeo(locale, "matrixMultiplication");
}

export default async function MatrixMultiplicationPage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "matrixMultiplication" });
    
    return (
        <div>
            <JsonLd dataName="matrixMultiplication" locale={locale} />
            <div className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</div>
            <MatrixMultiplication />

            <ArticleLayoutDefault title={t("usageTutorial.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("usageTutorial.intro"),
                    ]}
                />

                <HighlightSection>
                    <StepsList
                        steps={t.raw("usageTutorial.steps").map((_, index) => ({
                            content: t.rich(`usageTutorial.steps.${index}`, {
                                strong: (children) => <strong>{children}</strong>,
                            }),
                        }))}
                    />
                </HighlightSection>

                <ParagraphSection
                    paragraphs={[
                        t("usageTutorial.observation"),
                        t("usageTutorial.conclusion"),
                    ]}
                />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("exampleCalculation.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("exampleCalculation.scenario"),
                    ]}
                />

                <Image
                    src={locale === "pt" ? multiplicationExample01_pt : multiplicationExample01_en}
                    alt={t("exampleCalculation.imageAlt")}
                    style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                />
                <Image
                    src={locale === "pt" ? multiplicationExample02_pt : multiplicationExample02_en}
                    alt={t("exampleCalculation.imageAlt")}
                    style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                />

                <ParagraphSection
                    paragraphs={[
                        t.rich("exampleCalculation.calculationStep", {
                            strong: (children) => <strong>{children}</strong>,
                        }),
                    ]}
                />

                <Image
                    src={locale === "pt" ? multiplicationResult_pt : multiplicationResult_en}
                    alt={t("exampleCalculation.resultImageAlt")}
                    style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                />

                <ParagraphSection
                    paragraphs={[
                        t("exampleCalculation.conclusion"),
                    ]}
                />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("definitionSection.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("definitionSection.intro"),
                    ]}
                />

                <HighlightSection>
                    <ParagraphSection
                        paragraphs={[
                            t.rich("definitionSection.existence", {
                                strong: (children) => <strong>{children}</strong>,
                            }),
                        ]}
                    />
                </HighlightSection>

                <h2 className={TextGenericDesigns.pagesSubTitle}>{t("definitionSection.proprieties.title")}</h2>

                <ProprietiesList
                    proprieties={t.raw("definitionSection.proprieties.list").map((_, index) => ({
                        content: t.rich(`definitionSection.proprieties.list.${index}`, {
                            strong: (children) => <strong>{children}</strong>,
                        }),
                    }))}
                />

                <ParagraphSection
                    paragraphs={[
                        t("definitionSection.importance"),
                    ]}
                />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("formularySection.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("formularySection.intro"),
                    ]}
                />
                
                <FormulaCard
                    equations={[
                        'C_{i,j} = \\sum_{k=1}^{n} A_{i,k} \\times B_{k,j}',
                    ]}
                />

                <SymbolLegend
                    symbols={{
                        "C_{i,j}": t.rich("formularySection.formulaList.formulaList01", {
                            strong: (children) => <strong>{children}</strong>,
                        }),
                        "A_{i,k}": t("formularySection.formulaList.formulaList02"),
                        "B_{k,j}": t("formularySection.formulaList.formulaList03"),
                        "n": t("formularySection.formulaList.formulaList04"),
                    }}
                    renderSymbol={(symbol) => {
                        if (symbol === "C_{i,j}") return <>C<sub>i,j</sub></>;
                        if (symbol === "A_{i,k}") return <>A<sub>i,k</sub></>;
                        if (symbol === "B_{k,j}") return <>B<sub>k,j</sub></>;
                        return symbol;
                    }}
                />

                <ParagraphSection
                    paragraphs={[
                        t("formularySection.observation"),
                    ]}
                />
            </ArticleLayoutDefault>

            <FAQ questions={t.raw("faqSection").map((_, index) => ({
                question: t(`faqSection.${index}.question`),
                answer: t(`faqSection.${index}.answer`),
            }))} />
        </div>
    );
}

