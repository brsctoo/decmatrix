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
  );
}
