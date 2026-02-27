"use client";
import JsonLd from "@/components/JsonLd";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import React from "react";

import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from 'next/navigation'; 

{/* Styles */}
import HighlightSection from '@/components/TextComponents/HighlightSection';
import ParagraphSection from '@/components/TextComponents/ParagraphSection';
import StepsList from '@/components/TextComponents/StepsList';
import ExampleSection from '@/components/TextComponents/ExampleSection';
import SymbolLegend from '@/components/TextComponents/SymbolLegend';
import FormulaCard from '@/components/TextComponents/FormulaCard';
import TextGenericDesigns from '@/components/TextComponents/TextGenericDesigns.module.css';

{/* Layouts */}
import ArticleLayoutDefault from "@/components/TextComponents/ArticleLayouts/ArticleLayoutDefault";

{/* Utils */}
import { formatMoneyValue, formatMoneyInput } from "@/utils/formatters";

{/* Images */}
import simpleInterestExample from "@/assets/financial/simple_interest/example_pt.png";
import simpleInterestResultExample from "@/assets/financial/simple_interest/result_example_pt.png";
import simpleInterestExampleEn from "@/assets/financial/simple_interest/example_en.png";
import simpleInterestResultExampleEn from "@/assets/financial/simple_interest/result_example_en.png";

function generateChartData(C, i, n) {
  const history = [];
    
  for (let month = 0; month <= n; month++) {
    const capitalAmount = C * (1 + i * month);
    const investedAmount = C;
    const interestAmount = C * i * month;
    
    history.push({
      monthIndex: month,       // X
      investedAmount: Number(investedAmount.toFixed(2)), // Y
      capitalAmount: Number(capitalAmount.toFixed(2)),  // Y
      interestAmount: Number(interestAmount.toFixed(2)) // Y
    });
  }

  return history;
}

function toNumber(value) {
  {/* Remove todos os caracteres que não sejam dígitos
    -> Usado na hora de organizar o input do usuário
  */}

  if (!value) return "";
  return value.toString().replace(/\D/g, "");
}

function interest_calculator() {
  const t = useTranslations("SimpleInterestCalculator");
  const { locale } = useParams();
  
  // Exemplo: Estado para controlar se é Mensal ou Anual
  const [unit, setUnit] = React.useState({
    period_select: "months",
    interestRate_select: "monthly"
  });

  const [chartData, setChartData] = React.useState([]);
  const [results, setResults] = React.useState(null);

  const [value, setValue] = React.useState({
    capital: "",
    interestRate: "",
    period: "",
  });

  function handleUnitChange(fieldName, newValue) {
    setUnit(prevUnit => ({
      ...prevUnit,
      [fieldName]: newValue
    }));
  }

  function handleChange(event) {
    const {name, value: rawValue, dataset} = event.target;
    let processedValue = rawValue;

    if (dataset.kind === "money" || dataset.kind === "percentage") {
      // Pega apenas os números digitados
      const digitsOnly = toNumber(rawValue);

      if (digitsOnly !== "") {
        processedValue = formatMoneyInput(digitsOnly, locale);
      } else {
        processedValue = "";
      }
    }

    setValue(prevValue => {
      return {
        ...prevValue,
        [name]: processedValue
      }
    });
  }

  function calculateSimpleInterest(capital, interestRate, period, interestRateUnit, periodUnit) {
    const parseLocalNum = (val) => {
      {/* Função auxiliar de limpeza, converte tudo para número padrão JS 
        -> Usado na hora dos cálculos, para garantir que os valores estejam no formato correto, 
        independente do formato de input do usuário
      */}

      if (!val) return 0;

      // 1. Remove tudo que não for número ou separador decimal
      const decimalSep = locale === 'pt' ? ',' : '.';
      const thousandsSep = locale === 'pt' ? '.' : ',';
      let clean = val.toString().replace(new RegExp(`\\${thousandsSep}`, 'g'), '').replace(new RegExp(`[^\\d${decimalSep}]`, 'g'), '');

      // 2. Converte para padrão JS
      clean = clean.replace(decimalSep, '.');
      return parseFloat(clean);
    };

    const MAX_SAFE = Number.MAX_SAFE_INTEGER; // Constante onde o js trava -> 2^53 - 1
    const MAX_MONTHS = 600;

    const C = parseLocalNum(capital);
    const interestRateParsed = parseLocalNum(interestRate);
    let periodValue = parseFloat(period);

    // Verifica se os valores são válidos
    if (isNaN(C) || isNaN(interestRateParsed) || isNaN(periodValue)) {
      alert(t("alertWrongValues"));
      return 0;
    }

    // 1. Converter a taxa para mensal
    let monthlyRatePercent = interestRateParsed;
    if (interestRateUnit === "yearly") {
      monthlyRatePercent = interestRateParsed / 12;
    }

    // 2. Converter o período para meses (garante consistência com a taxa mensal)
    let totalMonths = periodValue;
    if (periodUnit === "years") {
      totalMonths = periodValue * 12;
    }

    if (totalMonths > MAX_MONTHS) {
      alert(t("alertPeriodTooLong"));
      return 0;
    }

    // 3. Calcular
    const i = monthlyRatePercent / 100;
    const n = totalMonths;

    const chartHistory = generateChartData(C, i, n);
    setChartData(chartHistory);

    const capitalAmount = C * (1 + i * n);
    const finalAmount = capitalAmount;

    // A trava de segurança
    if (finalAmount > MAX_SAFE) {
      alert(t("alertValueTooHigh"));
      setResults(null);
      return 0;
    }

    const totalInvested = C;
    const totalInterest = C * i * n;

    if (!Number.isFinite(finalAmount)) {
      setResults(null);
      alert(t("alertWrongValues"));
      return 0;
    }

    setResults({
      invested: totalInvested,
      interest: totalInterest,
      final: finalAmount,
    });

    return finalAmount;
  } 

  const decimalSeparator = locale === 'pt' ? ',' : '.';
  const currencySymbol = locale === 'pt' ? 'R$' : '$'; 
  const unitLabels = {
    monthlyLabel: locale === 'pt' ? 'Mensal' : 'Monthly',
    yearlyLabel: locale === 'pt' ? 'Anual' : 'Yearly',
    monthsLabel: locale === 'pt' ? 'Meses' : 'Months',
    yearsLabel: locale === 'pt' ? 'Anos' : 'Years'
  };

  return (
    <div>
      <JsonLd dataName="simpleInterestCalculator" locale={locale} />
      <h1 className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</h1>
      <div className={style.inputFieldsContainer}>
        <InputField 
          label={t("inputCapital.label")}
          name="capital"
          value={value.capital}
          onChange={handleChange}
          type="text"
          kind="money"
          placeholder={`0${decimalSeparator}00`}
          info={t("inputCapital.info")}
        >
          <div className={locale === 'pt' ? style.moneyIconReal : style.moneyIconDolar}>{currencySymbol}</div>
        </InputField>

        <InputField
          label={t("inputInterest.label")}
          name="interestRate"
          value={value.interestRate}
          onChange={handleChange}
          type="text"
          kind="percentage"
          placeholder={`0${decimalSeparator}00`}
          info={t("inputInterest.info")}
          selectValue={unit.interestRate_select}                 
          onSelectChange={(val) => handleUnitChange('interestRate_select', val)}          
          selectOptions={[                                
            { label: unitLabels.monthlyLabel, value: 'monthly' },
            { label: unitLabels.yearlyLabel, value: 'yearly' }
          ]}
        >
          <div className={style.percentageIcon}> % </div>
        </InputField>

        <InputField
          label={t("inputPeriod.label")}
          name="period"
          value={value.period}
          onChange={handleChange}
          placeholder={"00"}
          type="text"
          info={t("inputPeriod.info")}
          selectValue={unit.period_select}
          onSelectChange={(val) => handleUnitChange('period_select', val)}
          selectOptions={[
            { label: unitLabels.monthsLabel, value: 'months' },
            { label: unitLabels.yearsLabel, value: 'years' }
          ]}
        >
        </InputField>

        <div className={style.buttonContainer}>
          <ReactiveButton 
            label={t("result.buttonLabel")} 
            onClick={() => calculateSimpleInterest(
              value.capital,
              value.interestRate,
              value.period,
              unit.interestRate_select,
              unit.period_select
            )}
          />
        </div>
      </div>

      {results && (
        <div className={style.resultContainer}>
          <div className={style.resultsCard}>
            <h3 className={style.cardTitle}>{t("result.summaryTitle")}</h3>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.investedLabel")}</span>
              <span className={style.resultValue}>{`${formatMoneyValue(results.invested, locale)}`}</span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.interestLabel")}</span>
              <span className={style.resultValue}>{`${formatMoneyValue(results.interest, locale)}`}</span>
            </div>
            <div className={style.resultRowHighlight}>
              <span className={style.resultLabel}>{t("result.finalLabel")}</span>
              <span className={style.resultValue}>{`${formatMoneyValue(results.final, locale)}`}</span>
            </div>
          </div>
        </div>
      )}

      {chartData.length > 0 && results && (
        <div className={style.chartSection}>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>{t("result.evolutionGraph")}</h3>
            <GenericChart 
              chartType="area"
              data={chartData}
            />
          </div>
        </div>
      )}
    <ArticleLayoutDefault title={t("usageTutorial.title")}>
      <ParagraphSection
        paragraphs={[
          t("usageTutorial.intro"),
        ]}
      />
      <HighlightSection>
        <StepsList 
          steps={t.raw("usageTutorial.steps").map((_, index) => ({
            content: t.rich(`usageTutorial.steps.${index}`, { 
              strong: (children) => <strong>{children}</strong> 
            })
          }))}
        />
      </HighlightSection>

      <ParagraphSection
        paragraphs={[
          t("usageTutorial.conclusion"),
        ]}
      />

      <ExampleSection title={t("exampleCalculation.title")}>
        <ParagraphSection
          paragraphs={[
            t("exampleCalculation.intro"),
          ]}
        />

        <img
          src={locale === 'pt' ? simpleInterestExample.src : simpleInterestExampleEn.src}
          alt={t("exampleCalculation.imageAlt1")}
          className={style.imageAttribution}
        />

        <ParagraphSection
          paragraphs={[
            t("exampleCalculation.description"),
          ]}
        />

        <img
          src={locale === 'pt' ? simpleInterestResultExample.src : simpleInterestResultExampleEn.src}
          alt={t("exampleCalculation.imageAlt2")}
          className={style.imageAttribution}
        />
      </ExampleSection>
    </ArticleLayoutDefault>

    <ArticleLayoutDefault title={t("definitionSection.title")}>
      <ParagraphSection
        paragraphs={[
          t("definitionSection.intro"),
        ]}
      />

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

      <h2 className={TextGenericDesigns.pagesSubTitle}>{t("comparativeSection.title")}</h2>

      <ParagraphSection
        paragraphs={[
          t("comparativeSection.intro"),
        ]}
      />

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
      <ParagraphSection
        paragraphs={[
          t("formularySection.intro"),
        ]}
      />

      <h2 className={TextGenericDesigns.pagesSubTitle}>{t("formularySection.basicFormulaTitle")}</h2>

      <ParagraphSection
        paragraphs={[
          t("formularySection.basicFormula"),
          t("formularySection.formulaExplanation"),
        ]}
      />

      <FormulaCard equations={["\\mathbf{M = C \\times (1 + i \\times t)}"]} />

      <SymbolLegend
        symbols={{
          M: t.rich("formularySection.symbolM", {
            strong: (children) => <strong>{children}</strong>,
          }),
          C: t.rich("formularySection.symbolC", {
            strong: (children) => <strong>{children}</strong>,
          }),
          i: t.rich("formularySection.symbolI", {
            strong: (children) => <strong>{children}</strong>,
          }),
          t: t.rich("formularySection.symbolT", {
            strong: (children) => <strong>{children}</strong>,
          }),
        }}
      />

      <ParagraphSection
        paragraphs={[
          t("formularySection.interestCalculation"),
        ]}
      />

      <FormulaCard equations={[t("formularySection.interestFormula")]} />
    </ArticleLayoutDefault>
    </div>
  );
}

export default interest_calculator;