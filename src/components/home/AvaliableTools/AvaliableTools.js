"use client"

import React from "react";
import { GridSections, GridSection } from "@/components/text/GridSection/GridSection";
import { useIsMobile } from "@/context/ViewportContext";
import { useTranslations } from 'next-intl';

export default function AvaliableTools() {
    const isMobile = useIsMobile();
    const t = useTranslations("Home");

    if (isMobile) return null;

    return (
        <GridSections clickable={true} title={t("avaliableTools.title")} subtitle={t("avaliableTools.subtitle")}>
        <GridSection 
            title={t("avaliableTools.secondGradeEquationCard.title")} 
            route={`/quadratic-equation-calculator`}
            clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >
            {t("avaliableTools.secondGradeEquationCard.description")}
        </GridSection>
        <GridSection title={t('avaliableTools.linearFunction.title')} route="/linear-function-calculator" clickSubtitle={t('avaliableTools.acessCalculatorButtonLabel')}>
            {t('avaliableTools.linearFunction.description')}
        </GridSection>
        <GridSection title={t('avaliableTools.linearSystem.title')} route="/linear-system-calculator" clickSubtitle={t('avaliableTools.acessCalculatorButtonLabel')}>
            {t('avaliableTools.linearSystem.description')}
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
            title={t("avaliableTools.matrixDeterminant.title")}
            route={`/matrix-determinant`}
            clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >
            {t("avaliableTools.matrixDeterminant.description")}
        </GridSection>

        <GridSection
            title={t("avaliableTools.matrixInverse.title")}
            route={`/matrix-inverse`}
            clickSubtitle={t("avaliableTools.acessCalculatorButtonLabel")}
        >
            {t("avaliableTools.matrixInverse.description")}
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
        <GridSection title={t('avaliableTools.baseConverter.title')} route="/base-converter" clickSubtitle={t('avaliableTools.acessCalculatorButtonLabel')}>
            {t('avaliableTools.baseConverter.description')}
        </GridSection>
        <GridSection title={t('avaliableTools.truthTable.title')} route="/truth-table-generator" clickSubtitle={t('avaliableTools.acessCalculatorButtonLabel')}>
            {t('avaliableTools.truthTable.description')}
        </GridSection>
    </GridSections>
  );
}
