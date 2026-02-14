"use client";
import JsonLd from "@/components/JsonLd";

import MatrixBasicOperations from "@/components/MatricesComponents/MatrixBasicOperations";
import Image from "next/image";

import { useTranslations } from "next-intl";
import Link from 'next/link';
import { useParams } from 'next/navigation'; 

// Images
import basicOperationExample01_pt from "@/assets/matrix_basicOperations/basicOperation_example01_pt.png";
import basicOperationExample02_pt from "@/assets/matrix_basicOperations/basicOperation_example02_pt.png";
import basicOperationResult_pt from "@/assets/matrix_basicOperations/basicOperation_result_pt.png";

import basicOperationExample01_en from "@/assets/matrix_basicOperations/basicOperation_example01_en.png";
import basicOperationExample02_en from "@/assets/matrix_basicOperations/basicOperation_example02_en.png";
import basicOperationResult_en from "@/assets/matrix_basicOperations/basicOperation_result_en.png";


import MatrixDisplay from "@/components/MatricesComponents/MatrixDisplay";
import { Matrix } from "@/utils/matrixLogic/core";

import Article from "@/components/Article";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";

export default function MatrixBasicOperationsPage() {
    const matrixA_example = new Matrix(3, 3);
    matrixA_example.data = [[2, 5, 3], [1, 4, 6], [7, 2, 8]];
    const matrixB_example = new Matrix(3, 3);
    matrixB_example.data = [[6, 3, 4], [5, 2, 1], [2, 9, 3]];
    const matrixSum_example = new Matrix(3, 3);
    matrixSum_example.data = [[8, 8, 7], [6, 6, 7], [9, 11, 11]];
    const matrixSub_example = new Matrix(3, 3);
    matrixSub_example.data = [[-4, 2, -1], [-4, 2, 5], [5, -7, 5]];
    
    const { locale } = useParams();
    const t = useTranslations("matrixBasicOperations");
    return (
        <div>
            <JsonLd dataName="matrixBasicOperations" locale={locale} />
            <h1 className={tStyle.mainTitle}>{t("mainTitle")}</h1>
            <MatrixBasicOperations />

            <Article title={t("usageTutorial.title")}>
                <div className={tStyle.textSection}>
                    <p className={tStyle.textParagraph}>
                        {t("usageTutorial.intro")}
                    </p>

                    <div className={tStyle.infoHighlight}>
                        <ol className={tStyle.stepList}>
                            <li>{t.rich("usageTutorial.step01", {
                                strong: (children) => <strong>{children}</strong>
                            })}</li>
                            <li>{t.rich("usageTutorial.step02", {
                                strong: (children) => <strong>{children}</strong>
                            })}</li>
                            <li>{t.rich("usageTutorial.step03", {
                                strong: (children) => <strong>{children}</strong>
                            })}</li>
                            <li>{t.rich("usageTutorial.step04", {
                                strong: (children) => <strong>{children}</strong>
                            })}</li>
                        </ol>
                    </div>

                    <p className={tStyle.textParagraph}>
                        {t("usageTutorial.conclusion")}
                    </p>
                </div>
            </Article>

            <Article title={t("exampleCalculation.title")}>
                <div className={tStyle.textSection}>
                    <p className={tStyle.textParagraph}>
                        {t("exampleCalculation.scenario")}
                    </p>
                    
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
                    
                    <p className={tStyle.textParagraph}>
                        {t.rich("exampleCalculation.calculationStep", {
                            strong: (children) => <strong>{children}</strong>
                        })}
                    </p>

                    <Image 
                        src={locale === "pt" ? basicOperationResult_pt : basicOperationResult_en} 
                        alt={t("exampleCalculation.resultImageAlt")}
                        style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                    />
                    
                    <p className={tStyle.textParagraph}>
                        {t("exampleCalculation.conclusion")}
                    </p>
                </div>
            </Article>

            <Article title={t("stepByStep.title")}>
                <div className={tStyle.textSection}>
                    <p className={tStyle.textParagraph}>
                        {t("stepByStep.intro")}
                    </p>

                    <p className={tStyle.textParagraph}>
                        <strong>{t("stepByStep.exampleIntro")}</strong>
                    </p>

                    {/* Passos principais */}
                    {t.raw("stepByStep.steps").map((step, index) => (
                        <div key={index} className={tStyle.infoHighlight}>
                            <h3><strong>Passo {step.number}: {step.title}</strong></h3>
                            <p className={tStyle.textParagraph}>{step.description}</p>
                            {step.operations && (
                                <ul className={tStyle.stepList}>
                                    {step.operations.map((op, opIndex) => (
                                        <li key={opIndex}>{op}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {/* Exemplo prático */}
                    <h2 className={tStyle.sectionHeading}>{t("stepByStep.practicalExample.title")}</h2>
                    <p className={tStyle.textParagraph}>
                        {t("stepByStep.practicalExample.intro")}
                    </p>
                    
                    <div className={style.matrixDisplayExampleContainer}>
                        <div>
                            <strong>{t("stepByStep.practicalExample.matrixA")}</strong>
                            <MatrixDisplay matrix={matrixA_example} otherClasses={style.matrixDisplayExample}/>
                        </div>
                        <div>
                            <p><strong>{t("stepByStep.practicalExample.matrixB")}</strong></p>
                            <MatrixDisplay matrix={matrixB_example} otherClasses={style.matrixDisplayExample}/>
                        </div>
                    </div>

                    {/* Soma */}
                    <h3>{t("stepByStep.practicalExample.soma.title")}</h3>
                    <ol className={tStyle.stepList}>
                        {t.raw("stepByStep.practicalExample.soma.steps").map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                    <div className={tStyle.infoHighlight}>
                        <p><strong>{t("stepByStep.practicalExample.soma.result")}</strong></p>
                        <MatrixDisplay matrix={matrixSum_example} otherClasses={style.matrixDisplayResult}/>
                    </div>

                    {/* Subtração */}
                    <h3>{t("stepByStep.practicalExample.subtracao.title")}</h3>
                    <ol className={tStyle.stepList}>
                        {t.raw("stepByStep.practicalExample.subtracao.steps").map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                    <div className={tStyle.infoHighlight}>
                        <p><strong>{t("stepByStep.practicalExample.subtracao.result")}</strong></p>
                        <MatrixDisplay matrix={matrixSub_example} otherClasses={style.matrixDisplayResult} />
                    </div>
                </div>
            </Article>

            <Article title={t("errorArticle.title")}>
                <div className={tStyle.textSection}>
                    <p className={tStyle.textParagraph}>
                        {t("errorArticle.intro")}
                    </p>

                    <div className={tStyle.infoHighlight}>
                        <p className={tStyle.textParagraph}>
                            {t.rich("errorArticle.example", {
                                strong: (children) => <strong>{children}</strong>
                            })}
                        </p>
                    </div>

                    <p className={tStyle.textParagraph}>
                        {t("errorArticle.conclusion")}
                    </p>
                </div>
            </Article>

            <Article title={t("definitionSection.title")}>
                <div className={tStyle.textSection}>
                    <p className={tStyle.textParagraph}>
                        {t("definitionSection.intro")}
                    </p>

                    <div className={tStyle.infoHighlight}>
                        <p className={tStyle.textParagraph}>
                            {t.rich("definitionSection.existence", {
                                strong: (children) => <strong>{children}</strong>
                            })}
                        </p>
                    </div>

                    <h2 className={tStyle.sectionHeading}>{t("definitionSection.proprieties.title")}</h2>
                    
                    <ul className={tStyle.stepList}>
                        {t.raw("definitionSection.proprieties.list").map((item, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                    </ul>

                    <p className={tStyle.textParagraph}>
                        {t("definitionSection.importance")}
                    </p>
                </div>
            </Article>

        </div>
    );
}

