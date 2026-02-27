"use client";
import JsonLd from "@/components/JsonLd";

import React, { useRef, useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import ArticleLayoutDefault from "@/components/TextComponents/ArticleLayouts/ArticleLayoutDefault";
import styles from "./page.module.css";
import BinaryTree from "@/components/BinaryTree";
import { useTranslations } from "use-intl";
import TextGenericDesigns from '@/components/TextComponents/TextGenericDesigns.module.css';
import HighlightSection from '@/components/TextComponents/HighlightSection';
import ParagraphSection from '@/components/TextComponents/ParagraphSection';



{/*
  1. Usuário insere valores na fila (separados por vírgula)
  2. Usuário clica em "Inserir Valores" para inserir todos os valores da fila na árvore
  3. Usuário pode clicar em "Próximo Passo" para inserir o próximo valor da fila na árvore
  4. A árvore é redesenhada a cada inserção
  5. Se o usuário quiser, pode clicar "Resetar" para resetar a árvore e a fila ou "Remover Último" 
  para remover o último valor inserido
  
*/}


function bst_tree_builder() {
  const t = useTranslations("BSTTreeBuilder");

  const locale = useParams().locale;
  return (
    <div>
      <JsonLd dataName="bstTreeBuilder" locale={locale} />
      <div className={TextGenericDesigns.pagesMainTitle}>{t("bstMainTitle")}</div>
        <BinaryTree 
          inputFieldsContainerStyle={styles.inputFieldsContainer}
          treeType="BST"
        /> 
          
        <ArticleLayoutDefault title={t("bstDefinitionTitle")}>
          <ParagraphSection
            paragraphs={[
              t("bstDefinitionText01"),
            ]}
          />

          <HighlightSection>
            <ParagraphSection
              paragraphs={[
                t.rich("bstDefinitionText02", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                }),
              ]}
            />
          </HighlightSection>
        </ArticleLayoutDefault>

        <ArticleLayoutDefault title={t("bstProprietiesTitle")}>
          <ParagraphSection
            paragraphs={[
              t("bstProprietiesText01"),
            ]}
          />
        </ArticleLayoutDefault>

        <ArticleLayoutDefault title={t("bstSearchInsertionAndRemovalTitle")}>
          <ParagraphSection
            paragraphs={[
              t("bstSearchText"),
              t("bstInsertionText"),
              t("bstRemovalText"),
            ]}
          />
        </ArticleLayoutDefault>
        
    </div>
  );
}

export default bst_tree_builder;