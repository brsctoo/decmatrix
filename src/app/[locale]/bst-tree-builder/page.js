"use client";
import JsonLd from "@/components/JsonLd";

import React, { useRef, useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import tStyle from "@/components/GenericTextDesign.module.css";
import Article from "@/components/Article";
import styles from "./page.module.css";
import BinaryTree from "@/components/BinaryTree";
import { useTranslations } from "use-intl";


{/*
  Desenha a árvore BST no canvas, retornando uma lista de divs posicionadas

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


function bst_tree_builder() {
  const t = useTranslations("BSTTreeBuilder");

  const locale = useParams().locale;
  return (
    <div>
      <JsonLd dataName="bstTreeBuilder" locale={locale} />
      <h1 className={tStyle.mainTitle}>{t("bstMainTitle")}</h1>
        <BinaryTree 
          inputFieldsContainerStyle={styles.inputFieldsContainer}
          treeType="BST"
        />
          
        <Article title={t("bstDefinitionTitle")}>
          <div className={tStyle.textSection}>
            <p className={tStyle.textParagraph}>
            {t("bstDefinitionText01")}
            </p>

            <p className={tStyle.infoHighlight}>
              {t.rich('bstDefinitionText02', {
                strong: (chunks) => <strong>{chunks}</strong>
              })}
            </p>
          </div>
        </Article>

        <Article title={t("bstProprietiesTitle")}>
          <p className={tStyle.textParagraph}>
            {t("bstProprietiesText01")}
          </p>
        </Article>

        <Article title={t("bstSearchInsertionAndRemovalTitle")}>
          <div className={tStyle.textSection}>
            <p className={tStyle.textParagraph}>
            {t("bstSearchText")}
            </p>
            <p className={tStyle.textParagraph}>
              {t("bstInsertionText")}
            </p>
            <p className={tStyle.textParagraph}>
              {t("bstRemovalText")}
            </p> 
          </div>
        </Article>
        
    </div>
  );
}

export default bst_tree_builder;