"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Link from "next/link";

import tStyle from "@/components/GenericTextDesign.module.css";
import Article from "@/components/Article";
import styles from "./page.module.css";
import BinaryTree from "@/components/BinaryTree";
import { useTranslations } from "use-intl";


{/*
  Desenha a árvore AVL no canvas, retornando uma lista de divs posicionadas

  1. Usuário insere valores na fila (separados por vírgula)
  2. Usuário clica em "Inserir Valores" para inserir todos os valores da fila na árvore
  3. Usuário pode clicar em "Próximo Passo" para inserir o próximo valor da fila na árvore
  4. A árvore é redesenhada a cada inserção
  5. Se o usuário quiser, pode clicar "Resetar" para resetar a árvore e a fila ou "Remover Último" 
  para remover o último valor inserido

  Resumindo, teremos variáveis para:
  - Armazenar o valor do input do usuário -> rawText
  - Fila que vai servir de vizualização para o usuário -> vizQueue
  - Fila interna que vai controlar os valores a serem inseridos -> queue
  - Sequência de nós inseridos na árvore -> nodeSequence
  
*/}


function avl_tree_builder() {
  const t = useTranslations("AVLTreeBuilder");

  const params = useParams();     
  const locale = params.locale; 

  return (
    <div>
      <h1 className={tStyle.mainTitle}>{t("mainTitle")}</h1>
        <BinaryTree 
          inputFieldsContainerStyle={styles.inputFieldsContainer}
          treeType="AVL"
        />
          
        <Article title={t("definition.title")}>
          <div className={tStyle.textSection}>
            <p className={tStyle.textParagraph}>
              {t("definition.intro")}
            </p>

            <p className={tStyle.textParagraph}>
              {t("definition.curiosity")}
            </p>

            <p className={tStyle.infoHighlight}>
              {t.rich("definition.rememberHighlight", {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
          </div>
        </Article>

        <Article title={t("proprieties.title")}>
          <p className={tStyle.textParagraph}>
            {t("proprieties.intro")}
          </p>
        </Article>

        <Article title={t("operations.title")}>
          <div className={tStyle.textSection}>
            <p className={tStyle.textParagraph}>
              {t("operations.searchText")}
            </p>
            <p className={tStyle.textParagraph}> {/* Tem link */}
              {t.rich("operations.insertionText", {
                linkBTS: (chunks) => (
                  <Link 
                    href={`/${locale}/bst-tree-builder`}
                    className={tStyle.inlineLink}
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
            <p className={tStyle.textParagraph}>
              {t("operations.removalText")}
            </p> 
          </div>
        </Article>

        <Article title={t("balanceAndRotations.title")}>
          <div className={tStyle.textSection}>
            <p className={tStyle.textParagraph}>
              {t("balanceAndRotations.intro")}
              {t("balanceAndRotations.cases.intro")}
            </p>
            
            <div className={tStyle.infoHighlight}>
              <ol className={tStyle.stepList}>
                <li>
                  {t.rich("balanceAndRotations.cases.case01", {
                    strong: (chunks) => <strong>{chunks}</strong>
                  })}
                </li>
                <li>
                  {t.rich("balanceAndRotations.cases.case02", {
                    strong: (chunks) => <strong>{chunks}</strong>
                  })}
                </li>
                <li>
                  {t.rich("balanceAndRotations.cases.case03", {
                    strong: (chunks) => <strong>{chunks}</strong>
                  })}
                </li>
                <li>
                  {t.rich("balanceAndRotations.cases.case04", {
                    strong: (chunks) => <strong>{chunks}</strong>
                  })}
                </li>
              </ol>
            </div>
          </div>
        </Article>
        
    </div>
  );
}

export default avl_tree_builder;