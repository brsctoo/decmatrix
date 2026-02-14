"use client";
import JsonLd from "@/components/JsonLd";

import MatrixMultiplication from "@/components/MatricesComponents/MatrixMultiplication";
import Image from "next/image";

import { MathDisplayEquation } from "@/components/MathDisplay";

import { useTranslations } from "next-intl";
import Link from 'next/link';
import { useParams } from 'next/navigation'; 

// Images
import multiplicationExample01_pt from "@/assets/matrix_multiplication/multiplication_example01_pt.png";
import multiplicationExample02_pt from "@/assets/matrix_multiplication/multiplication_example02_pt.png";
import multiplicationResult_pt from "@/assets/matrix_multiplication/multiplication_result_example_pt.png";

import multiplicationExample01_en from "@/assets/matrix_multiplication/multiplication_example01_en.png";
import multiplicationExample02_en from "@/assets/matrix_multiplication/multiplication_example02_en.png";
import multiplicationResult_en from "@/assets/matrix_multiplication/multiplication_result_example_en.png";

import Article from "@/components/Article";
import tStyle from "@/components/GenericTextDesign.module.css";
import style from "./page.module.css";

export default function MatrixMultiplicationPage() {
    const { locale } = useParams();
    const t = useTranslations("matrixMultiplication");
    return (
        <div>
            <JsonLd dataName="matrixMultiplication" locale={locale} />
            <h1 className={tStyle.mainTitle}>{t("mainTitle")}</h1>
            <MatrixMultiplication />

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
                        {t("usageTutorial.observation")}
                    </p>

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
                        src={locale === "pt" ? multiplicationExample01_pt : multiplicationExample01_en} 
                        alt={t("exampleCalculation.imageAlt")}
                        style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                    />
                    <Image 
                        src={locale === "pt" ? multiplicationExample02_pt : multiplicationExample02_en} 
                        alt={t("exampleCalculation.imageAlt")}
                        style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                    />
                    
                    <p className={tStyle.textParagraph}>
                        {t.rich("exampleCalculation.calculationStep", {
                            strong: (children) => <strong>{children}</strong>
                        })}
                    </p>

                    <Image 
                        src={locale === "pt" ? multiplicationResult_pt : multiplicationResult_en} 
                        alt={t("exampleCalculation.resultImageAlt")}
                        style={{ maxWidth: "100%", height: "auto", margin: "20px 0" }}
                    />
                    
                    <p className={tStyle.textParagraph}>
                        {t("exampleCalculation.conclusion")}
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
                            <li key={index} dangerouslySetInnerHTML={{ __html: item }} /> // Usamos dangerouslySetInnerHTML para renderizar as tags HTML dentro das strings de tradução
                        ))}
                    </ul>

                    <p className={tStyle.textParagraph}>
                        {t("definitionSection.importance")}
                    </p>
                </div>
            </Article>

            <Article title={t("formularySection.title")}>
                <div className={tStyle.textSection}>
                    <p className={tStyle.textParagraph}>
                        {t("formularySection.intro")}
                    </p>
                    
                    <div className={tStyle.formulaContainer}>
                        <div className={style.formulaEquation}>
                            <MathDisplayEquation 
                                equation={String.raw`C_{i,j} = \sum_{k=1}^{n} A_{i,k} \times B_{k,j}`} 
                            />
                        </div>
                    </div>

                    <ul className={tStyle.symbolLegend}>
                        <li>{t.rich("formularySection.formulaList.formulaList01", {
                            strong: (children) => <strong>{children}</strong>,
                            sub: (children) => <span style={{ fontSize: "0.9em" }}>{children}</span>
                        })}</li>
                        <li>{t.rich("formularySection.formulaList.formulaList02", {
                            strong: (children) => <strong>{children}</strong>,
                            sub: (children) => <span style={{ fontSize: "0.9em" }}>{children}</span>
                        })}</li>
                        <li>{t.rich("formularySection.formulaList.formulaList03", {
                            strong: (children) => <strong>{children}</strong>,
                            sub: (children) => <span style={{ fontSize: "0.9em" }}>{children}</span>
                        })}</li>
                        <li>{t.rich("formularySection.formulaList.formulaList04", {
                            strong: (children) => <strong>{children}</strong>,
                            sub: (children) => <span style={{ fontSize: "0.9em" }}>{children}</span>
                        })}</li>
                    </ul>

                    <p className={tStyle.textParagraph}>
                        {t("formularySection.observation")}
                    </p>
                </div>
            </Article>
        </div>
    );
}

