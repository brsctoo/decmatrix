"use client";
import JsonLd from "@/components/JsonLd";

import React, { useRef, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";

import styles from "./page.module.css";
import BinaryTree from "@/components/BinaryTree";
import { useTranslations } from "use-intl";


// Styles
import HighlightSection from '@/components/TextComponents/HighlightSection';
import ParagraphSection from '@/components/TextComponents/ParagraphSection';
import DefaultList from '@/components/TextComponents/DefaultList';
import ExampleSection from "@/components/TextComponents/ExampleSection";
import SymbolLegend from '@/components/TextComponents/SymbolLegend';
import FormulaCard from '@/components/TextComponents/FormulaCard';
import TextGenericDesigns from '@/components/TextComponents/TextGenericDesigns.module.css';

// Layouts
import ArticleLayoutSplit from "@/components/TextComponents/ArticleLayouts/ArticleLayoutSplit";
import ArticleLayoutDefault from "@/components/TextComponents/ArticleLayouts/ArticleLayoutDefault";


{/*
  1. Usuário insere valores na fila (separados por vírgula)
  2. Usuário clica em "Inserir Valores" para inserir todos os valores da fila na árvore
  3. Usuário pode clicar em "Próximo Passo" para inserir o próximo valor da fila na árvore
  4. A árvore é redesenhada a cada inserção
  5. Se o usuário quiser, pode clicar "Resetar" para resetar a árvore e a fila ou "Remover Último" 
  para remover o último valor inserido  
*/}


function avl_tree_builder() {
  const t = useTranslations("AVLTreeBuilder");

  const { locale } = useParams();     

  return (
    <div>
      <JsonLd dataName="avlTreeBuilder" locale={locale} />
      <h1 className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</h1>
        <BinaryTree 
          inputFieldsContainerStyle={styles.inputFieldsContainer}
          treeType="AVL"
        />
        
        <ArticleLayoutDefault title={t("definition.title")}>
          <ParagraphSection paragraphs={[
            t("definition.intro"),
            t("definition.curiosity")
          ]}/>

          <HighlightSection>
            <ParagraphSection paragraphs={[
              t.rich("definition.rememberHighlight", {
                strong: (chunks) => <strong>{chunks}</strong>
              })
            ]}/> 
          </HighlightSection>
        </ArticleLayoutDefault>
        
        <ArticleLayoutDefault title={t("proprieties.title")}>
          <ParagraphSection paragraphs={[
            t("proprieties.intro"),
          ]}/>
        </ArticleLayoutDefault>

        <ArticleLayoutDefault title={t("operations.title")}>
          <ParagraphSection paragraphs={[
            t("operations.searchText"),

            t.rich("operations.insertionText", {
                linkBTS: (chunks) => (
                  <Link 
                    href={`/${locale}/bst-tree-builder`}
                    className={TextGenericDesigns.inlineLink}
                  >
                    {chunks}
                  </Link>
                ),
            }),
            
            t("operations.removalText")
          ]}/>
        </ArticleLayoutDefault>

        <ArticleLayoutDefault title={t("balanceAndRotations.title")}>
          <ParagraphSection paragraphs={[
            t("balanceAndRotations.intro"),
            t("balanceAndRotations.cases.intro")
          ]}/>
            
          <HighlightSection>
            <DefaultList itens={[
              {
                content: t.rich("balanceAndRotations.cases.case01", {
                  strong: (chunks) => <strong>{chunks}</strong>
                }),
              },
              {
                content: t.rich("balanceAndRotations.cases.case02", {
                  strong: (chunks) => <strong>{chunks}</strong>
                }),
              },
              {
                content: t.rich("balanceAndRotations.cases.case03", {
                  strong: (chunks) => <strong>{chunks}</strong>
                })
              },
              {
                content: t.rich("balanceAndRotations.cases.case04", {
                  strong: (chunks) => <strong>{chunks}</strong>
                }),
              }
            ]} />
          </HighlightSection>
        </ArticleLayoutDefault>
        
    </div>
  );
}

export default avl_tree_builder;