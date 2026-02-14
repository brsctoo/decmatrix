"use client";
import React from "react";

import Image from "next/image";
import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import Article from "@/components/Article";
import tStyle from "@/components/GenericTextDesign.module.css";
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useTranslations } from "next-intl";

function Home() {
  const router = useRouter();
  const pathname = usePathname(); // Retorna "/pt/alguma-coisa"
  const params = useParams();     
  const locale = params.locale;   // "pt" ou "en"

  const t = useTranslations("Home");

  return (
    <div className={style.homeContainer}>
      <h1 className={style.mainTitle}>Decmatrix</h1>
      <div className={style.intro}>
        <p> 
          {t("introduction.intro")}
        </p>
        <p>
          {t("introduction.idea")}
        </p>
      </div>
      <h2 className={style.subTitle}>{t("mainAreas.title")}</h2>
      <div>
        <section className={style.sections}>
          <Article title={t("mainAreas.dataStructuresSection.title")} variant="gridBox">
            {t("mainAreas.dataStructuresSection.description")}
          </Article>

          <Article title={t("mainAreas.algebraSection.title")} variant="gridBox">
            {t("mainAreas.algebraSection.description")}
          </Article>

          <Article title={t("mainAreas.financialCalculatorsSection.title")} variant="gridBox">
            {t("mainAreas.financialCalculatorsSection.description")}
          </Article>

          <Article title={t("mainAreas.matrixSection.title")} variant="gridBox">
            {t("mainAreas.matrixSection.description")}
          </Article>
        </section>
      </div>
      
      {/* Ferramentas disponíveis */}
      <h2 className={style.subTitle}>{t("avaliableTools.title")}</h2>
      <div className={style.cardsGrid}>
        <div className={style.card}>
          <h3 className={style.cardTitle}>{t("avaliableTools.secondGradeEquationCard.title")}</h3>
          <div className={style.cardText}>
            {t("avaliableTools.secondGradeEquationCard.description")}
          </div>
          <ReactiveButton 
            label={t("avaliableTools.acessCalculatorButtonLabel")}
            link={`//${locale}/quadratic-equation-calculator`}
            onClick={() => router.push(`/${locale}/quadratic-equation-calculator`)} 
            active={pathname === `/${locale}/quadratic-equation-calculator`} 
            extraStyles={style.homeButton}
          />
        </div>
        
        <div className={style.card}>
          <h3 className={style.cardTitle}>{t("avaliableTools.compoundInterestCalculatorCard.title")}</h3>
          <div className={style.cardText}>
            {t("avaliableTools.compoundInterestCalculatorCard.description")}
          </div>
          <ReactiveButton 
            label={t("avaliableTools.acessCalculatorButtonLabel")}
            link={`//${locale}/compound-interest-calculator`}
            onClick={() => router.push(`/${locale}/compound-interest-calculator`)} 
            active={pathname === `/${locale}/compound-interest-calculator`} 
            extraStyles={style.homeButton}
          />
        </div>

        <div className={style.card}>
          <h3 className={style.cardTitle}>{t("avaliableTools.simpleInterestCalculatorCard.title")}</h3>
          <div className={style.cardText}>
            {t("avaliableTools.simpleInterestCalculatorCard.description")}
          </div>
          <ReactiveButton 
            label={t("avaliableTools.acessCalculatorButtonLabel")}
            link={`//${locale}/simple-interest-calculator`}
            onClick={() => router.push(`/${locale}/simple-interest-calculator`)} 
            active={pathname === `/${locale}/simple-interest-calculator`} 
            extraStyles={style.homeButton}
          />
        </div>

        <div className={style.card}>
          <h3 className={style.cardTitle}>{t("avaliableTools.binarySearchTreeSimulatorCard.title")}</h3>
          <div className={style.cardText}>
            {t("avaliableTools.binarySearchTreeSimulatorCard.description")}
          </div>
          <ReactiveButton 
            label={t("avaliableTools.acessSimulatorButtonLabel")}
            link={`//${locale}/bst-tree-builder`}
            onClick={() => router.push(`/${locale}/bst-tree-builder`)} 
            active={pathname === `/${locale}/bst-tree-builder`} 
            extraStyles={style.homeButton}
          />
        </div>

        <div className={style.card}>
          <h3 className={style.cardTitle}>{t("avaliableTools.avlTreeSimulatorCard.title")}</h3>
          <div className={style.cardText}>
            {t("avaliableTools.avlTreeSimulatorCard.description")}
          </div>
          <ReactiveButton 
            label={t("avaliableTools.acessSimulatorButtonLabel")}
            link={`//${locale}/avl-tree-builder`}
            onClick={() => router.push(`/${locale}/avl-tree-builder`)} 
            active={pathname === `/${locale}/avl-tree-builder`} 
            extraStyles={style.homeButton}
          />
        </div>

        <div className={style.card}>
          <h3 className={style.cardTitle}>{t("avaliableTools.matrixMultiplication.title")}</h3>
          <div className={style.cardText}>
            {t("avaliableTools.matrixMultiplication.description")}
          </div>
          <ReactiveButton 
            label={t("avaliableTools.acessCalculatorButtonLabel")}
            link={`//${locale}/matrix-multiplication`}
            onClick={() => router.push(`/${locale}/matrix-multiplication`)} 
            active={pathname === `/${locale}/matrix-multiplication`} 
            extraStyles={style.homeButton}
          />
        </div>

        <div className={style.card}>
          <h3 className={style.cardTitle}>{t("avaliableTools.matrixBasicOperations.title")}</h3>
          <div className={style.cardText}>
            {t("avaliableTools.matrixBasicOperations.description")}
          </div>
          <ReactiveButton 
            label={t("avaliableTools.acessCalculatorButtonLabel")}
            link={`//${locale}/matrix-basic-operations`}
            onClick={() => router.push(`/${locale}/matrix-basic-operations`)} 
            active={pathname === `/${locale}/matrix-basic-operations`} 
            extraStyles={style.homeButton}
          />
        </div>
      </div>

      {/* Nossa visão */}
      <h3 className={style.subTitle}> {t('objectiveAndValues.title')} </h3>
      <section className={style.sections}>
        <Article title={t('objectiveAndValues.objectivesSection.title')}>
          {t('objectiveAndValues.objectivesSection.description')}
        </Article>

        <Article title={t('objectiveAndValues.valuesSection.title')}>
          <div className={tStyle.infoHighlight}>
             <ol className={tStyle.stepList}> 
              <li> {t.rich('objectiveAndValues.valuesSection.value01', {
                strong: (chunks) => <strong>{chunks}</strong>
              })} </li>
              <li> {t.rich('objectiveAndValues.valuesSection.value02', {
                strong: (chunks) => <strong>{chunks}</strong>
              })} </li>
              <li> {t.rich('objectiveAndValues.valuesSection.value03', {
                strong: (chunks) => <strong>{chunks}</strong>
              })} </li>
              <li> {t.rich('objectiveAndValues.valuesSection.value04', {
                strong: (chunks) => <strong>{chunks}</strong>
              })} </li>
            </ol>
          </div>
        </Article>
      </section>
    </div>
  );
}

export default Home;  