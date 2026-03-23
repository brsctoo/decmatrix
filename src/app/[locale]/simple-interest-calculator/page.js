import JsonLd from "@/components/JsonLd";
import SimpleInterest from "@/components/financial-calculators/SimpleInterest/SimpleInterest";
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
import simpleInterestExample from "@/assets/financial/simple_interest/example_pt.png";
import simpleInterestResultExample from "@/assets/financial/simple_interest/result_example_pt.png";
import simpleInterestExampleEn from "@/assets/financial/simple_interest/example_en.png";
import simpleInterestResultExampleEn from "@/assets/financial/simple_interest/result_example_en.png";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return await generateSeo(locale, "SimpleInterestCalculator");
}

export default async function SimpleInterestPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("SimpleInterestCalculator");

  return (
    <div>
      <JsonLd dataName="simpleInterestCalculator" locale={locale} />

      {/* ✅ Client component isolado — gerencia todo o estado interativo */}
      <SimpleInterest locale={locale} />

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
          <ParagraphSection paragraphs={[t("exampleCalculation.intro")]} />

          <img
            src={locale === "pt" ? simpleInterestExample.src : simpleInterestExampleEn.src}
            alt={t("exampleCalculation.imageAlt1")}
          />

          <ParagraphSection paragraphs={[t("exampleCalculation.description")]} />

          <img
            src={locale === "pt" ? simpleInterestResultExample.src : simpleInterestResultExampleEn.src}
            alt={t("exampleCalculation.imageAlt2")}
          />
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
            t("definitionSection.limitations"),
            t.rich("definitionSection.compareLink", {
              link: (children) => (
                <Link
                  href={`/${locale}/compound-interest-calculator`}
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
          {t("formularySection.basicFormulaTitle")}
        </h2>

        <ParagraphSection
          paragraphs={[
            t("formularySection.basicFormula"),
            t("formularySection.formulaExplanation"),
          ]}
        />

        <FormulaCard equations={["\\mathbf{M = C \\times (1 + i \\times t)}"]} />

        <SymbolLegend
          symbols={{
            M: t.rich("formularySection.symbolM", { strong: (children) => <strong>{children}</strong> }),
            C: t.rich("formularySection.symbolC", { strong: (children) => <strong>{children}</strong> }),
            i: t.rich("formularySection.symbolI", { strong: (children) => <strong>{children}</strong> }),
            t: t.rich("formularySection.symbolT", { strong: (children) => <strong>{children}</strong> }),
          }}
        />

        <ParagraphSection paragraphs={[t("formularySection.interestCalculation")]} />

        <FormulaCard equations={[t("formularySection.interestFormula")]} />
      </ArticleLayoutDefault>

      <FAQ
        questions={t.raw("faqSection").map((_, index) => ({
          question: t(`faqSection.${index}.question`),
          answer:   t(`faqSection.${index}.answer`),
        }))}
      />
    </div>
  );
}