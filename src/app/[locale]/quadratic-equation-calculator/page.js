import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";

import QuadraticEquationCalculator from "@/components/pre-calculus/QuadraticEquation";

import { getTranslations } from "next-intl/server";

// Images
import quadraticEquationExamplePt from "@/assets/precalculus/quadratic_equation/example_pt.png";
import quadraticEquationResultExample01Pt from "@/assets/precalculus/quadratic_equation/result_example01_pt.png";
import quadraticEquationResultExample02Pt from "@/assets/precalculus/quadratic_equation/result_example02_pt.png";

import quadraticEquationExampleEn from "@/assets/precalculus/quadratic_equation/example_en.png";
import quadraticEquationResultExample01En from "@/assets/precalculus/quadratic_equation/result_example01_en.png";
import quadraticEquationResultExample02En from "@/assets/precalculus/quadratic_equation/result_example02_en.png";

// Styles
import FAQ from "@/components/text/FAQ/FAQ";
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import StepsList from '@/components/text/StepsList/StepsList';
import ExampleSection from "@/components/text/ExampleSection/ExampleSection";
import SymbolLegend from '@/components/text/SymbolLegend/SymbolLegend';
import FormulaCard from '@/components/text/FormulaCard/FormulaCard';
import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import { generateSeo } from "@/utils/Seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return await generateSeo(locale, "QuadraticEquationCalculator");
}

export default async function QuadraticEquationCalculatorPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "QuadraticEquationCalculator" });

  return (
    <div>
      <QuadraticEquationCalculator />

      <ArticleLayoutDefault title={t("definitionSection.title")}>
        <ParagraphSection paragraphs={[
          t("definitionSection.intro")
        ]}/>

        <FormulaCard equations={[t("definitionSection.formula")]} />

        <SymbolLegend symbols={{
          "a, b, c": t.rich("definitionSection.symbolAB", { strong: (children) => <strong>{children}</strong> }),
          "x": t.rich("definitionSection.symbolX", { strong: (children) => <strong>{children}</strong> })
        }}/>

        <ParagraphSection paragraphs={[
          t.rich("definitionSection.explanation", { strong: (children) => <strong>{children}</strong> })
        ]}/>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("rootsSection.title")}>
        <ParagraphSection paragraphs={[
            t("rootsSection.intro")
        ]}/>

        <HighlightSection>
          <ParagraphSection paragraphs={[
            t.rich("rootsSection.example", { strong: (children) => <strong>{children}</strong> })
          ]}/>
        </HighlightSection>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("resolutionGuide.title")}>
          <ParagraphSection
            paragraphs={[
              t("resolutionGuide.intro")
            ]}
          />

          <HighlightSection>
            <StepsList
              steps={[
                {
                  content: t.rich("resolutionGuide.step1"),
                },
                {
                  content: t.rich("stepByStep.step2", {
                    strong: (c) => <strong>{c}</strong>,
                  }),
                },
                {
                  content: t.rich("stepByStep.step3", {
                    strong: (c) => <strong>{c}</strong>,
                  }),
                  subSteps: [
                    t("resolutionGuide.step3a"),
                    t("resolutionGuide.step3b"),
                    t("resolutionGuide.step3c"),
                  ],
                },
                {
                  content: t.rich("stepByStep.step4", {
                    strong: (c) => <strong>{c}</strong>,
                  }),
                  equations: [
                    `\\mathbf{x =\\frac{-b ± \\sqrt{Δ}}{2a}}`,
                  ],
                },
              ]}/>
        </HighlightSection>

          <ParagraphSection paragraphs={[
            t("resolutionGuide.conclusion")
          ]}/>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("usageTutorial.title")}>
        <div className={tStyle.textSection}>
          <ParagraphSection paragraphs={[
            t("usageTutorial.intro")
          ]}/>

          <HighlightSection>
            <StepsList steps={[
              {
                content: t.rich("usageTutorial.step1", { strong: (children) => <strong>{children}</strong> }),
              },
              {
                content: t.rich("usageTutorial.step2", { strong: (children) => <strong>{children}</strong> }),
              },
              {
                content: t.rich("usageTutorial.step3", { strong: (children) => <strong>{children}</strong> }),
              },
              {
                content: t.rich("usageTutorial.step4", { strong: (children) => <strong>{children}</strong> }),
              }
            ]}/>
          </HighlightSection>

          <ParagraphSection paragraphs={[
            t("usageTutorial.conclusion")
          ]}/>
          
          {/* Seção com imagens */}
          <ExampleSection title={t("exampleCalculation.title")}>
            <ParagraphSection paragraphs={[
              t("exampleCalculation.scenario")
            ]}/>
            <img
              src={locale === "pt" ? quadraticEquationExamplePt.src : quadraticEquationExampleEn.src}
              alt={t("exampleCalculation.imageAlt1")}
              className={style.imageAttribution}
            />
            <ParagraphSection paragraphs={[
              t("exampleCalculation.description")
            ]}/>
            <img
              src={locale === "pt" ? quadraticEquationResultExample01Pt.src : quadraticEquationResultExample01En.src}
              alt={t("exampleCalculation.imageAlt2")}
              className={style.imageAttribution}
            />
            <img
              src={locale === "pt" ? quadraticEquationResultExample02Pt.src : quadraticEquationResultExample02En.src}
              alt={t("exampleCalculation.imageAlt2")}
              className={style.imageAttribution}
            />
          </ExampleSection>
        </div>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("graphSection.title")}>
        <ParagraphSection paragraphs={[
          t("graphSection.intro"),
          t("graphSection.symmetry"),
          t("graphSection.vertex")
        ]}/>

        <FormulaCard equations={[`\\mathbf{Vx =\\frac{-b}{2a}}`, `\\mathbf{Vy =\\frac{-\\Delta}{4a}}`]} />

        <SymbolLegend 
          symbols={{
            "a, b, c": t.rich("graphSection.symbolAB", { strong: (children) => <strong>{children}</strong> }),
            "Δ": t.rich("graphSection.symbolDelta", { strong: (children) => <strong>{children}</strong> })
          }}
        />
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("factorization.title")}>
        <ParagraphSection paragraphs={[
          t("factorization.intro")
        ]}/>
        
        <FormulaCard equations={[`\\mathbf{${t("factorization.formula")}}`]} />

        <SymbolLegend 
          symbols={{
            "a, b, c": t.rich("factorization.symbolABC", { strong: (children) => <strong>{children}</strong> }),
            "x₁, x₂": t.rich("factorization.symbolRoots", { strong: (children) => <strong>{children}</strong> })
          }}
        />

        <HighlightSection>
          <ParagraphSection paragraphs={[
            t.rich("factorization.example01", { strong: (children) => <strong>{children}</strong> })
          ]}/>
        </HighlightSection>

        <HighlightSection>
          <ParagraphSection paragraphs={[
            t.rich("factorization.example02", { strong: (children) => <strong>{children}</strong> })
          ]}/>
        </HighlightSection>
        
        <ParagraphSection paragraphs={[
          t("factorization.conclusion")
        ]}/>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("realWorld.title")}>
        <ParagraphSection paragraphs={[
          t("realWorld.intro"),
          t("realWorld.examples")
        ]}/>
      </ArticleLayoutDefault>

      <FAQ questions={t.raw("faqSection").map((_, index) => ({
        question: t(`faqSection.${index}.question`),
        answer: t(`faqSection.${index}.answer`),
      }))} />
    </div>
  );
}