"use client";
import React from "react";

import Image from "next/image";
import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";

import ArticleLayoutDefault from "@/components/TextComponents/ArticleLayouts/ArticleLayoutDefault";
import { GridSections, GridSection } from "@/components/TextComponents/GridSection";

{/* Styles */}
import HighlightSection from '@/components/TextComponents/HighlightSection';
import ParagraphSection from '@/components/TextComponents/ParagraphSection';
import DefaultList from '@/components/TextComponents/DefaultList';
import ExampleSection from '@/components/TextComponents/ExampleSection';
import SymbolLegend from '@/components/TextComponents/SymbolLegend';
import FormulaCard from '@/components/TextComponents/FormulaCard';
import TextGenericDesigns from '@/components/TextComponents/TextGenericDesigns.module.css';


import { useRouter, usePathname, useParams } from 'next/navigation';
import { useTranslations } from "next-intl";

function Home() {
  const router = useRouter();
  const pathname = usePathname(); // Retorna "/pt/alguma-coisa"
  const params = useParams();     
  const locale = params.locale;   // "pt" ou "en"

  const t = useTranslations("Home");

  return (
    <div className={style.homeContainer} >
      <h1 className={style.mainTitle}>{t.rich("title.mainTitle", 
        { retroText: (chunks) => <span className={TextGenericDesigns.retroText}>{chunks}</span> }
      )}</h1>
      
      <div className={style.subTitle}>
        <span>{t("title.subTitle01")}</span>
        <span>{t("title.subTitle02")}</span>
      </div>
      
      <GridSections>
          <GridSection title={t("mainAreas.dataStructuresSection.title")} variant="gridBox">
            {t("mainAreas.dataStructuresSection.description")}
          </GridSection>

          <GridSection title={t("mainAreas.precalculusSection.title")} variant="gridBox">
            {t("mainAreas.precalculusSection.description")}
          </GridSection>

          <GridSection title={t("mainAreas.financialCalculatorsSection.title")} variant="gridBox">
            {t("mainAreas.financialCalculatorsSection.description")}
          </GridSection>

          <GridSection title={t("mainAreas.linearAlgebraSection.title")} variant="gridBox">
            {t("mainAreas.linearAlgebraSection.description")}
          </GridSection>
      </GridSections>

      {/* Ferramentas disponíveis */}
      <GridSections clickable={true} title={t("avaliableTools.title")} subtitle={t("avaliableTools.subtitle")}>
        <GridSection 
          title={t("avaliableTools.secondGradeEquationCard.title")} 
          route={`/quadratic-equation-calculator`}
          clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >

          {t("avaliableTools.secondGradeEquationCard.description")}
        </GridSection>
        
        <GridSection 
          title={t("avaliableTools.compoundInterestCalculatorCard.title")}
          route={`/compound-interest-calculator`}
          clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >

          {t("avaliableTools.compoundInterestCalculatorCard.description")}
        </GridSection>

        <GridSection 
          title={t("avaliableTools.simpleInterestCalculatorCard.title")}
          route={`/simple-interest-calculator`}
          clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >

          {t("avaliableTools.simpleInterestCalculatorCard.description")}
        </GridSection>

        <GridSection 
          title={t("avaliableTools.binarySearchTreeSimulatorCard.title")}
          route={`/bst-tree-builder`}
          clickSubtitle={t("avaliableTools.acessSimulatorButtonLabel")}
        >
          
          {t("avaliableTools.binarySearchTreeSimulatorCard.description")}
        </GridSection>

        <GridSection 
          title={t("avaliableTools.avlTreeSimulatorCard.title")} 
          route={`/avl-tree-builder`}
          clickSubtitle={t("avaliableTools.acessSimulatorButtonLabel")}
        >
          
          {t("avaliableTools.avlTreeSimulatorCard.description")}
        </GridSection>

        <GridSection 
          title={t("avaliableTools.matrixMultiplication.title")} 
          route={`/matrix-multiplication`}
          clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >
          
          {t("avaliableTools.matrixMultiplication.description")}
        </GridSection>

        <GridSection 
          title={t("avaliableTools.matrixBasicOperations.title")} 
          route={`/matrix-basic-operations`}
          clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >
          
          {t("avaliableTools.matrixBasicOperations.description")}
        </GridSection>  
      </GridSections>

      {/* Nossa visão */}
      <ArticleLayoutDefault title={t('objectiveAndValues.objectivesSection.title')}>
        <ParagraphSection paragraphs={[t('objectiveAndValues.objectivesSection.description')]} />
      </ArticleLayoutDefault>

        <ArticleLayoutDefault title={t('objectiveAndValues.valuesSection.title')}>
          <HighlightSection>
            <DefaultList
              itens={t.raw("objectiveAndValues.valuesSection.values").map((_, index) => ({
                content: t.rich(`objectiveAndValues.valuesSection.values.${index}`, {
                  strong: (chunks) => <strong>{chunks}</strong>,
                }),
              }))}
            />
          </HighlightSection>
        </ArticleLayoutDefault>
    </div>
  );
}

export default Home;  