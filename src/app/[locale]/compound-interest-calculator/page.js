import JsonLd from "@/components/JsonLd";
import CompoundInterest from "@/components/financial-calculators/CompoundInterest/CompoundInterest";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { generateSeo } from "@/utils/Seo";

// Text components
import HighlightSection from "@/components/text/HighlightSection/HighlightSection";
import ParagraphSection from "@/components/text/ParagraphSection/ParagraphSection";
import StepsList from "@/components/text/StepsList/StepsList";
import ExampleSection from "@/components/text/ExampleSection/ExampleSection";
import SymbolLegend from "@/components/text/SymbolLegend/SymbolLegend";
import FormulaCard from "@/components/text/FormulaCard/FormulaCard";
import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import FAQ from "@/components/text/FAQ/FAQ";
import TextGenericDesigns from "@/components/text/TextGenericDesigns.module.css";

// Images
import compoundInterestExampleEn from "@/assets/financial/compound_interest/example_en.png";
import compoundInterestResultExampleEn from "@/assets/financial/compound_interest/result_example_en.png";
import compoundInterestExample from "@/assets/financial/compound_interest/example_pt.png";
import compoundInterestResultExample from "@/assets/financial/compound_interest/result_example_pt.png";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return await generateSeo(locale, "CompoundInterestCalculator");
}

export default async function CompoundInterestPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("CompoundInterestCalculator");

  return (
    <div>
      <JsonLd dataName="compoundInterestCalculator" locale={locale} />

      {/* ✅ Client component isolado — gerencia todo o estado interativo */}
      <CompoundInterest locale={locale} />

      {/* ✅ Conteúdo estático do artigo — renderizado no servidor */}
      <ArticleLayoutDefault title={t("usageTutorial.title")}>
        <ParagraphSection paragraphs={[t("usageTutorial.intro")]} />

        <HighlightSection>
          <StepsList
            steps={t.raw("usageTutorial.steps").map((_, index) => ({
              content: t.rich(`usageTutorial.steps.${index}`, {
                strong: (children) => <strong>{children}</strong>,
              }),
            }))}
          />
        </HighlightSection>

        <ParagraphSection paragraphs={[t("usageTutorial.conclusion")]} />

        <ExampleSection title={t("exampleCalculation.title")}>
          <ParagraphSection paragraphs={[t("exampleCalculation.scenario")]} />

          <img
            src={locale === "pt" ? compoundInterestExample.src : compoundInterestExampleEn.src}
            alt={t("exampleCalculation.imageAlt")}
          />

          <ParagraphSection
            paragraphs={[
              t.rich("exampleCalculation.calculationStep", {
                strong: (children) => <strong>{children}</strong>,
              }),
            ]}
          />

          <img
            src={locale === "pt" ? compoundInterestResultExample.src : compoundInterestResultExampleEn.src}
            alt={t("exampleCalculation.resultImageAlt")}
          />

          <ParagraphSection paragraphs={[t("exampleCalculation.conclusion")]} />
        </ExampleSection>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("definitionSection.title")}>
        <ParagraphSection paragraphs={[t("definitionSection.intro")]} />

        <HighlightSection>
          <ParagraphSection
            paragraphs={[
              t.rich("definitionSection.example", {
                strong: (children) => <strong>{children}</strong>,
              }),
            ]}
          />
        </HighlightSection>

        <ParagraphSection
          paragraphs={[
            t("definitionSection.importance"),
            t.rich("definitionSection.compareLink", {
              link: (children) => (
                <Link
                  href={`/${locale}/simple-interest-calculator`}
                  className={TextGenericDesigns.inlineLink}
                >
                  {children}
                </Link>
              ),
            }),
          ]}
        />

        <h2 className={TextGenericDesigns.pagesSubTitle}>
          {t("comparativeSection.title")}
        </h2>

        <ParagraphSection paragraphs={[t("comparativeSection.intro")]} />

        <HighlightSection>
          <ParagraphSection
            paragraphs={[
              t.rich("comparativeSection.example", {
                strong: (children) => <strong>{children}</strong>,
              }),
              t("comparativeSection.conclusion"),
            ]}
          />
        </HighlightSection>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("formularySection.title")}>
        <ParagraphSection paragraphs={[t("formularySection.intro")]} />

        <h2 className={TextGenericDesigns.pagesSubTitle}>
          {t("formularySection.formula01Title")}
        </h2>
        <ParagraphSection paragraphs={[t("formularySection.formula01Intro")]} />

        <FormulaCard equations={["\\mathbf{M = C \\times (1 + i)^{t}}"]} />

        <SymbolLegend
          symbols={{
            M: t.rich("formularySection.formula01List01", { strong: (children) => <strong>{children}</strong> }),
            C: t.rich("formularySection.formula01List02", { strong: (children) => <strong>{children}</strong> }),
            i: t.rich("formularySection.formula01List03", { strong: (children) => <strong>{children}</strong> }),
            t: t.rich("formularySection.formula01List04", { strong: (children) => <strong>{children}</strong> }),
          }}
        />

        <h2 className={TextGenericDesigns.pagesSubTitle}>
          {t("formularySection.formula02Title")}
        </h2>
        <ParagraphSection paragraphs={[t("formularySection.formula02Intro")]} />

        <FormulaCard
          equations={[
            "\\mathbf{M = C \\times (1 + i)^{t} + PMT \\times \\frac{(1 + i)^{t} - 1}{i}}",
          ]}
        />

        <SymbolLegend
          symbols={{
            PMT: t.rich("formularySection.formula02List01", {
              strong: (children) => <strong>{children}</strong>,
            }),
          }}
        />

        <ParagraphSection paragraphs={[t("formularySection.interestFormulaIntro")]} />

        <FormulaCard equations={["\\mathbf{J = M - (C + PMT \\times t)}"]} />
      </ArticleLayoutDefault>

      <FAQ
        questions={t.raw("faqSection").map((_, index) => ({
          question: t(`faqSection.${index}.question`),
          answer: t(`faqSection.${index}.answer`),
        }))}
      />
    </div>
  );
}