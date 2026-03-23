import JsonLd from "@/components/JsonLd";

import MatrixBasicOperations from "@/components/matrices/BasicOperations/BasicOperations";
import Image from "next/image";

import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/utils/Seo";

// Images
import basicOperationExample01_pt from "@/assets/algebra/matrix_basicOperations/basicOperation_example01_pt.png";
import basicOperationExample02_pt from "@/assets/algebra/matrix_basicOperations/basicOperation_example02_pt.png";
import basicOperationResult_pt from "@/assets/algebra/matrix_basicOperations/basicOperation_result_pt.png";

import basicOperationExample01_en from "@/assets/algebra/matrix_basicOperations/basicOperation_example01_en.png";
import basicOperationExample02_en from "@/assets/algebra/matrix_basicOperations/basicOperation_example02_en.png";
import basicOperationResult_en from "@/assets/algebra/matrix_basicOperations/basicOperation_result_en.png";


import MatrixDisplay from "@/components/matrices/Display/Display";
import { Matrix } from "@/utils/matrixLogic/core";

import style from "./page.module.css";

{/* Styles */}
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ProprietiesList from '@/components/text/ProprietiesList/ProprietiesList';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import StepsList from '@/components/text/StepsList/StepsList';
import TextGenericDesigns from '@/components/text/TextGenericDesigns.module.css';
import FAQ from "@/components/text/FAQ/FAQ";

{/* Layouts */}
import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    return await generateSeo(locale, "matrixBasicOperations");
}

export default async function MatrixBasicOperationsPage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "matrixBasicOperations" });

    const matrixA_example = new Matrix(3, 3);
    matrixA_example.data = [[2, 5, 3], [1, 4, 6], [7, 2, 8]];
    const matrixB_example = new Matrix(3, 3);
    matrixB_example.data = [[6, 3, 4], [5, 2, 1], [2, 9, 3]];
    const matrixSum_example = new Matrix(3, 3);
    matrixSum_example.data = [[8, 8, 7], [6, 6, 7], [9, 11, 11]];
    const matrixSub_example = new Matrix(3, 3);
    matrixSub_example.data = [[-4, 2, -1], [-4, 2, 5], [5, -7, 5]];

    return (
        <div>
            <JsonLd dataName="matrixBasicOperations" locale={locale} />
            <div className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</div>
            <MatrixBasicOperations />

            <ArticleLayoutDefault title={t("usageTutorial.title")}>
                <ParagraphSection paragraphs={[
                    t("usageTutorial.intro")
                ]} />

                <HighlightSection>
                    <StepsList steps={t.raw("usageTutorial.steps").map((_, index) => ({ 
                        content: t.rich(`usageTutorial.steps.${index}`, {
                            strong: (children) => <strong>{children}</strong>,
                        })
                    }))} />
                </HighlightSection>

                <ParagraphSection paragraphs={[
                    t("usageTutorial.conclusion")
                ]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("exampleCalculation.title")}>
                
                <ParagraphSection paragraphs={[
                    t("exampleCalculation.scenario")
                ]} />
                    
                <Image 
                    src={locale === "pt" ? basicOperationExample01_pt : basicOperationExample01_en} 
                    alt={t("exampleCalculation.imageAlt")}
                    style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                />
                <Image 
                    src={locale === "pt" ? basicOperationExample02_pt : basicOperationExample02_en} 
                    alt={t("exampleCalculation.imageAlt")}
                    style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                />
                    
                <ParagraphSection paragraphs={[
                    t.rich("exampleCalculation.calculationStep", { strong: (children) => <strong>{children}</strong> })
                ]} />

                <Image 
                    src={locale === "pt" ? basicOperationResult_pt : basicOperationResult_en} 
                    alt={t("exampleCalculation.resultImageAlt")}
                    style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                />
                    
                <ParagraphSection paragraphs={[
                    t("exampleCalculation.conclusion")
                ]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("stepByStep.title")}>
                <ParagraphSection paragraphs={[
                    t("stepByStep.intro"),
                    <strong>{t("stepByStep.exampleIntro")}</strong>
                ]} />
                
                {/* Passos principais */}
                {t.raw("stepByStep.steps").map((step, index) => (
                    <HighlightSection key={index}>
                        <h2 className={TextGenericDesigns.pagesSubsubTitle}><strong>{step.title}</strong></h2>
                        <ParagraphSection paragraphs={[step.description]} />
                        {step.operations && (
                            <StepsList steps={step.operations.map((operation, opIndex) => ({ content: operation }))} />
                        )}
                    </HighlightSection>
                ))}
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("stepByStep.practicalExample.title")}>
                <ParagraphSection paragraphs={[
                    t("stepByStep.practicalExample.intro")
                ]} />
                    
                <div className={style.matrixDisplayExampleContainer}>
                    <div>
                        <h2 className={TextGenericDesigns.pagesSubsubTitle}><strong>{t("stepByStep.practicalExample.matrixA")}</strong></h2>
                        <MatrixDisplay matrix={matrixA_example} otherClasses={style.matrixDisplayExample}/>
                    </div>
                    <div>
                        <h2 className={TextGenericDesigns.pagesSubsubTitle}><strong>{t("stepByStep.practicalExample.matrixB")}</strong></h2>
                        <MatrixDisplay matrix={matrixB_example} otherClasses={style.matrixDisplayExample}/>
                    </div>
                </div>

                {/* Soma */}
                <ParagraphSection paragraphs={[ <strong>{t("stepByStep.practicalExample.soma.title")}</strong> ]}/>
            
                <StepsList steps={t.raw("stepByStep.practicalExample.soma.steps").map((_, index) => ({ 
                    content: t.rich(`stepByStep.practicalExample.soma.steps.${index}`, {
                        strong: (children) => <strong>{children}</strong>,
                    })
                }))} />

                <HighlightSection>
                    <h2 className={TextGenericDesigns.pagesSubsubTitle}><strong>{t("stepByStep.practicalExample.soma.result")}</strong></h2>
                    <MatrixDisplay matrix={matrixSum_example} otherClasses={style.matrixDisplayResult}/>
                </HighlightSection>

                {/* Subtração */}
                <ParagraphSection paragraphs={[ <strong>{t("stepByStep.practicalExample.subtracao.title")}</strong> ]}/>

                <StepsList steps={t.raw("stepByStep.practicalExample.subtracao.steps").map((_, index) => ({ 
                    content: t.rich(`stepByStep.practicalExample.subtracao.steps.${index}`, {
                        strong: (children) => <strong>{children}</strong>,
                    })
                }))} />

                <HighlightSection>
                    <h2 className={TextGenericDesigns.pagesSubsubTitle}><strong>{t("stepByStep.practicalExample.subtracao.result")}</strong></h2>
                    <MatrixDisplay matrix={matrixSub_example} otherClasses={style.matrixDisplayResult}/>
                </HighlightSection>
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("errorArticle.title")}>
                <ParagraphSection paragraphs={[
                    t("errorArticle.intro")
                ]} />

                <HighlightSection>
                    <ParagraphSection paragraphs={[
                        t.rich("errorArticle.example", { strong: (children) => <strong>{children}</strong> })
                    ]} />
                </HighlightSection>

                <ParagraphSection paragraphs={[
                    t("errorArticle.conclusion")
                ]} />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("definitionSection.title")}>
                <ParagraphSection paragraphs={[
                    t("definitionSection.intro")
                ]} />

                <HighlightSection>
                    <ParagraphSection paragraphs={[
                    t.rich("definitionSection.existence", { strong: (children) => <strong>{children}</strong> })
                    ]} />
                </HighlightSection>

                <h2 className={TextGenericDesigns.pagesSubTitle}>{t("definitionSection.proprieties.title")}</h2>
                    
                <ProprietiesList
                    proprieties={t.raw("definitionSection.proprieties.list").map((_, index) => ({ 
                        content: t.rich(`definitionSection.proprieties.list.${index}`, {
                            strong: (children) => <strong>{children}</strong>,
                        })
                    }))}
                />

                <ParagraphSection paragraphs={[
                    t("definitionSection.importance")
                ]} />
            </ArticleLayoutDefault>

            <FAQ questions={t.raw("faqSection").map((_, index) => ({
                question: t(`faqSection.${index}.question`),
                answer: t(`faqSection.${index}.answer`),
            }))} />
        </div>
    );
}

