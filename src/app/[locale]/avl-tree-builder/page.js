import JsonLd from "@/components/JsonLd";

import React from "react";
import { generateSeo } from "@/utils/Seo";
import Link from "next/link";

import styles from "./page.module.css";
import BinaryTree from "@/components/data-structures/BinaryTree/BinaryTree";
import QuickExercise from '@/components/data-structures/AVLExercises/QuickExercise';
import TreeRelatedLinks from '@/components/data-structures/TreeExercises/TreeRelatedLinks';
import practiceStyles from '@/components/data-structures/AVLExercises/Exercises.module.css';
import { getTranslations } from "next-intl/server";


// Styles
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import DefaultList from '@/components/text/DefaultList/DefaultList';
import FAQ from "@/components/text/FAQ/FAQ";
import TextGenericDesigns from '@/components/text/TextGenericDesigns.module.css';

// Layouts
import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";


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

   const metadata = await generateSeo(locale, "AVLTreeBuilder", 'avl-tree-builder');
   return { ...metadata, openGraph: {
     title: metadata.title, description: metadata.description, url: metadata.alternates.canonical,
     type: 'website', siteName: 'Decmatrix', locale: locale === 'pt' ? 'pt_BR' : 'en_US',
     alternateLocale: [locale === 'pt' ? 'en_US' : 'pt_BR'],
   } };
}

export default async function avl_tree_builder({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AVLTreeBuilder" });
  const exercises = await getTranslations({ locale, namespace: 'AVLExercises' });
  const practice = await getTranslations({ locale, namespace: 'AVLPractice' });

  return (
    <div>
      <JsonLd dataName="avlTreeBuilder" locale={locale} />
      <h1 className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</h1>
        <BinaryTree 
          inputFieldsContainerStyle={styles.inputFieldsContainer}
          treeType="AVL"
        />
        <p className={styles.bstInvitation}>
          {t.rich("bstInvitation", {
            linkBST: (chunks) => (
              <Link href={`/${locale}/bst-tree-builder`} className={styles.bstLink}>
                {chunks}
              </Link>
            ),
          })}
        </p>
        <section className={practiceStyles.practiceSection}>
          <h2>{practice('practiceTitle')}</h2>
          <p>{practice('practiceIntro')}</p>
          <p>{practice('practiceCta')}</p>
          <Link href={`/${locale}/avl-tree-exercises`} className={practiceStyles.link}>{exercises('invitation')}</Link>
          <h2>{practice('introTitle')}</h2>
          <p>{practice('introExercise')}</p>
          <QuickExercise introductory />
        </section>
        
        <TreeRelatedLinks locale={locale} current="avl-tree-builder" standalone />
        <ArticleLayoutDefault heading="h2" title={t("definition.title")}>
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
        
        <ArticleLayoutDefault heading="h2" title={t("proprieties.title")}>
          <ParagraphSection paragraphs={[
            t("proprieties.intro"),
          ]}/>
        </ArticleLayoutDefault>

        <ArticleLayoutDefault heading="h2" title={t("operations.title")}>
          <ParagraphSection paragraphs={[
            t("operations.searchText"),

            t("operations.insertionText"),
            
            t("operations.removalText")
          ]}/>
        </ArticleLayoutDefault>

        <ArticleLayoutDefault heading="h2" title={t("balanceAndRotations.title")}>
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
        
        <FAQ questions={t.raw("faqSection").map((_, index) => ({
          question: t(`faqSection.${index}.question`),
          answer: t(`faqSection.${index}.answer`),
        }))} />
    </div>
  );
}
