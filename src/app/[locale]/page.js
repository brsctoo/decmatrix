import React from "react";

import { generateSeo } from "@/utils/Seo";
import { getTranslations } from "next-intl/server";

import TreePreview from "@/components/home/TreePreview/TreePreview";

import style from "./page.module.css";

import ArticleLayoutSplit from "@/components/text/article-layouts/ArticleLayoutSplit/ArticleLayoutSplit";
import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import { GridSections, GridSection } from "@/components/text/GridSection/GridSection";

{/* Styles */}
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import DefaultList from '@/components/text/DefaultList/DefaultList';
import FAQ from '@/components/text/FAQ/FAQ';
import TextGenericDesigns from '@/components/text/TextGenericDesigns.module.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return await generateSeo(locale, "Home");
}

async function Home({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

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

      <ArticleLayoutSplit title={t("clarityText.title")}>
        <ParagraphSection paragraphs={[t("clarityText.description")]} />
      </ArticleLayoutSplit>

      <TreePreview 
        title={t("previewBinaryTree.title")}
        description={t("previewBinaryTree.description")}
      />

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

        <GridSection 
          title={t("avaliableTools.bubbleSortSimulatorCard.title")} 
          route={`/bubble-sort`}
          clickSubtitle={t("avaliableTools.acessSimulatorButtonLabel")}
        >
          
          {t("avaliableTools.bubbleSortSimulatorCard.description")}
        </GridSection>  

        <GridSection 
          title={t("avaliableTools.insertionSortSimulatorCard.title")} 
          route={`/insertion-sort`}
          clickSubtitle={t("avaliableTools.acessSimulatorButtonLabel")}
        >
          
          {t("avaliableTools.insertionSortSimulatorCard.description")}
        </GridSection>  

        <GridSection 
          title={t("avaliableTools.selectionSortSimulatorCard.title")} 
          route={`/selection-sort`}
          clickSubtitle={t("avaliableTools.acessSimulatorButtonLabel")}
        >
          
          {t("avaliableTools.selectionSortSimulatorCard.description")}
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

        <FAQ questions={t.raw("faqSection").map((_, index) => ({
          question: t(`faqSection.${index}.question`),
          answer: t(`faqSection.${index}.answer`),
        }))} />
    </div>
  );
}

export default Home;  