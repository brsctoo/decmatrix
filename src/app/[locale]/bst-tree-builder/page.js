import JsonLd from "@/components/JsonLd";
import React from "react";

import { generateSeo } from "@/utils/Seo";

import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import styles from "./page.module.css";
import BinaryTree from "@/components/data-structures/BinaryTree/BinaryTree";
import { getTranslations } from "next-intl/server";
import TextGenericDesigns from '@/components/text/TextGenericDesigns.module.css';
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';

import FAQ from "@/components/text/FAQ/FAQ";

{/*
  1. Usuário insere valores na fila (separados por vírgula)
  2. Usuário clica em "Inserir Valores" para inserir todos os valores da fila na árvore
  3. Usuário pode clicar em "Próximo Passo" para inserir o próximo valor da fila na árvore
  4. A árvore é redesenhada a cada inserção
  5. Se o usuário quiser, pode clicar "Resetar" para resetar a árvore e a fila ou "Remover Último" 
  para remover o último valor inserido
  
*/}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return await generateSeo(locale, "BSTTreeBuilder");
}

export default async function bst_tree_builder({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "BSTTreeBuilder" });
  
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
        
        <FAQ questions={t.raw("faqSection").map((_, index) => ({
          question: t(`faqSection.${index}.question`),
          answer: t(`faqSection.${index}.answer`),
        }))} />
    </div>
  );
}