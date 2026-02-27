"use client"
import JsonLd from "@/components/JsonLd";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import React from "react";
import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";

import { useTranslations } from "next-intl";
import Link from 'next/link';
import { useParams } from 'next/navigation'; 

{/* Utils */}
import { formatMoneyInput, formatMoneyValue } from "@/utils/formatters";

// Styles
import HighlightSection from '@/components/TextComponents/HighlightSection';
import ParagraphSection from '@/components/TextComponents/ParagraphSection';
import StepsList from '@/components/TextComponents/StepsList';
import ExampleSection from "@/components/TextComponents/ExampleSection";
import SymbolLegend from '@/components/TextComponents/SymbolLegend';
import FormulaCard from '@/components/TextComponents/FormulaCard';
import ArticleLayoutDefault from "@/components/TextComponents/ArticleLayouts/ArticleLayoutDefault";
import TextGenericDesigns from '@/components/TextComponents/TextGenericDesigns.module.css';


{/* Imagens */}
import compoundInterestExampleEn from "@/assets/financial/compound_interest/example_en.png";
import compoundInterestResultExampleEn from "@/assets/financial/compound_interest/result_example_en.png";
import compoundInterestExample from "@/assets/financial/compound_interest/example_pt.png";
import compoundInterestResultExample from "@/assets/financial/compound_interest/result_example_pt.png";


function toNumber(value) {
  {/* Remove todos os caracteres que não sejam dígitos */}

  if (!value) return "";
  return value.toString().replace(/\D/g, "");
}

function generateChartData(C, i, n, PMT) {
  const history = [];
    
  for (let month = 0; month <= n; month++) {
    const capitalAmount = C * Math.pow((1 + i), month);
      
    // CORREÇÃO DE ESCOPO: Declarar a variável fora do if/else
    var contributionAmount = 0;

    if (i > 0) {
      contributionAmount = PMT * ((Math.pow((1 + i), month) - 1) / i);
    } else {
      contributionAmount = PMT * month;
    }

    const total = capitalAmount + contributionAmount; 

    history.push({
      monthIndex: month,       // X
      capitalAmount: Number(capitalAmount.toFixed(2)),  // Y
      contributionAmount: Number(contributionAmount.toFixed(2)), // Y  
      totalAmount: Number(total.toFixed(2)) // Y
    });
  }

  return history;
}

function interest_calculator() {
  const t = useTranslations("CompoundInterestCalculator");
  const { locale } = useParams(); // Pega o locale da URL

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
    periodicContribution: ""
  });

  function handleUnitChange(fieldName, newValue) {
    setUnit(prevUnit => ({
      ...prevUnit,
      [fieldName]: newValue
    }));
  }

  function handleChange(event) {
    // Desestruturação do evento para pegar name, value e dataset
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

  function calculateCompoundInterest(capital, interestRate, period, periodicContribution, interestRateUnit, periodUnit) {
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
    const PMT = parseLocalNum(periodicContribution);
    let period_value = parseFloat(period);

    // Verifica se os valores são válidos
    if (isNaN(C) || isNaN(interestRateParsed) || isNaN(period_value)) {
        alert(t("alertWrongValues"));
        return 0;
    }

    // 1. Converter a taxa para mensal (Usando Taxa Equivalente)
    let monthlyRate = interestRateParsed;
    if (interestRateUnit === 'yearly') {
        // (1 + 0.10)^(1/12) - 1
        monthlyRate = (Math.pow(1 + (interestRateParsed / 100), 1 / 12) - 1) * 100;
    }

    // 2. Converter o período para meses 
    let totalMonths = period_value;
    if (periodUnit === 'years') {
      totalMonths = period_value * 12;
    }

    if (totalMonths > MAX_MONTHS) {
      alert(t("alertPeriodTooLong"));
      return 0;
    }

    // 4. Calcular
    const i = monthlyRate / 100;
    const n = totalMonths; // Usando 'n' que é padrão financeiro (ou 't')

    let capitalAmount;
    let contributionAmount;

    if (i === 0) {
      capitalAmount = C;
      contributionAmount = PMT * n;
    } else {
      const growthFactor = Math.pow(1 + i, n);
      capitalAmount = C * growthFactor;
      contributionAmount = PMT * ((growthFactor - 1) / i);
    }

    const finalAmount = capitalAmount + contributionAmount;

    // A trava de segurança
    if (finalAmount > MAX_SAFE) {
      alert(t("alertValueTooHigh"));
      setResults(null);
      return 0;
    }

    const chartHistory = generateChartData(C, i, n, PMT);
    setChartData(chartHistory);

    const totalInvested = C + PMT * n;
    const totalInterest = finalAmount - totalInvested;

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

  const decimalSeparator = locale === "pt" ? "," : ".";
  const currencySymbol = locale === 'pt' ? 'R$' : '$'; 
  const unitLabels = {
    monthlyLabel: locale === 'pt' ? 'Mensal' : 'Monthly',
    yearlyLabel: locale === 'pt' ? 'Anual' : 'Yearly',
    monthsLabel: locale === 'pt' ? 'Meses' : 'Months',
    yearsLabel: locale === 'pt' ? 'Anos' : 'Years'
  };

  return (
    <div>
      {/* 
        Juros Compostos -> Fórmula: M = C * (1 + i)^t, ou seja, depende do capital inicial, da taxa de juros e do tempo.
        No Juros compostos, também será possível colocar uma contribuisão periódica (mensal, anual, etc) para o cálculo do montante final.
      */}
      <JsonLd dataName="compoundInterestCalculator" locale={locale} />
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

          // Select dinâmico
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
            { label: unitLabels.monthlyLabel, value: 'months' },
            { label: unitLabels.yearlyLabel, value: 'years' }
          ]}
        >
        </InputField>
    
        <InputField
          label={t("inputContribution.label")}
          name="periodicContribution"
          value={value.periodicContribution}
          onChange={handleChange}
          type="text"
          kind="money"
          placeholder={`0${decimalSeparator}00`}
          info={t("inputContribution.info")}
        >
          <div className={locale === 'pt' ? style.moneyIconReal : style.moneyIconDolar}>{currencySymbol}</div>
        </InputField>

        <div className={style.buttonContainer}>
          <ReactiveButton 
            label={t("result.buttonLabel")}
            onClick={() => calculateCompoundInterest(
              value.capital,
              value.interestRate,
              value.period,
              value.periodicContribution,
              unit.interestRate_select,
              unit.period_select
            )}
          />
        </div>
      </div>

      {results && (
        <div className={style.resultContainer}>
          <div className={style.resultsCard}>
            <h3 className={style.cardTitle}>{t("result.resume")}</h3>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.totalInvested")}</span>
              <span className={style.resultValue}>{formatMoneyValue(results.invested, locale)}</span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.totalInterest")}</span>
              <span className={style.resultValue}>{formatMoneyValue(results.interest, locale)}</span>
            </div>
            <div className={style.resultRowHighlight}>
              <span className={style.resultLabel}>{t("result.finalAmount")}</span>
              <span className={style.resultValue}>{formatMoneyValue(results.final, locale)}</span>
            </div>
          </div>
        </div>
      )}

      {chartData.length > 0 && results && (
        <div className={style.chartsContainer}>
          {chartData.length > 0 && results && (
            <div className={style.chartWrapper}>
              <h3 className={style.cardTitle}>{t("result.pieGraph")}</h3>
              <GenericChart 
                chartType="pie"
                data={chartData}
              />
            </div>
          )}

          {chartData.length > 0 && results && (
            <div className={style.chartWrapper}>
              <h3 className={style.cardTitle}>{t("result.barGraph")}</h3>
              <GenericChart 
                chartType="area"
                data={chartData}
              />
            </div>
          )}
        </div>
      )}
    
    <ArticleLayoutDefault title={t("usageTutorial.title")}>
      <ParagraphSection paragraphs={[
        t("usageTutorial.intro")
      ]}/>

      <HighlightSection>
        <StepsList 
            steps={t.raw("usageTutorial.steps").map((_, index) => ({
                content: t.rich(`usageTutorial.steps.${index}`, { 
                    strong: (children) => <strong>{children}</strong> 
                })
            }))}
        />
      </HighlightSection>

      <ParagraphSection paragraphs={[
        t("usageTutorial.conclusion")
      ]}/>

      <ExampleSection title={t("exampleCalculation.title")}>
        <ParagraphSection paragraphs={[
          t("exampleCalculation.scenario")
        ]}/>

        <img
          src={locale === 'pt' ? compoundInterestExample.src : compoundInterestExampleEn.src}
          alt={t("exampleCalculation.imageAlt")}
          className={style.imageAttribution}
        />

        <ParagraphSection paragraphs={[
          t.rich("exampleCalculation.calculationStep", { strong: (children) => <strong>{children}</strong> })
        ]}/>

        <img
          src={locale === 'pt' ? compoundInterestResultExample.src : compoundInterestResultExampleEn.src}
          alt={t("exampleCalculation.resultImageAlt")}
          className={style.imageAttribution}
        />
        <ParagraphSection paragraphs={[
          t("exampleCalculation.conclusion")
        ]}/>
      </ExampleSection>
    </ArticleLayoutDefault>

    <ArticleLayoutDefault title={t("definitionSection.title")}>
      <ParagraphSection paragraphs={[
        t("definitionSection.intro")
      ]}/>

      <HighlightSection>
        <ParagraphSection paragraphs={[
          t.rich("definitionSection.example", { strong: (children) => <strong>{children}</strong> })
        ]}/>
      </HighlightSection>
          
        
      <ParagraphSection paragraphs={[
        t("definitionSection.importance"),

        t.rich("definitionSection.compareLink", {
          link: (children) => <Link href={`/${locale}/simple-interest-calculator`} className={TextGenericDesigns.inlineLink}>{children}</Link>
        })
      ]}/>

      <h2 className={TextGenericDesigns.pagesSubTitle}>{t("comparativeSection.title")}</h2>

      <ParagraphSection paragraphs={[
        t("comparativeSection.intro")
      ]} />

      <HighlightSection>
        <ParagraphSection paragraphs={[
          t.rich("comparativeSection.example", {strong: (children) => <strong>{children}</strong>}),
          t("comparativeSection.conclusion"),
        ]} />
      </HighlightSection>
    </ArticleLayoutDefault>

    <ArticleLayoutDefault title={t("formularySection.title")}>
      <ParagraphSection paragraphs={[
        t("formularySection.intro")
      ]}/>

      <h2 className={TextGenericDesigns.pagesSubTitle}>{t("formularySection.formula01Title")}</h2>
      <ParagraphSection paragraphs={[
        t("formularySection.formula01Intro")
      ]}/>

      <FormulaCard equations={['\\mathbf{M = C \\times (1 + i)^{t}}']} />

      <SymbolLegend symbols={{
          "M": t.rich("formularySection.formula01List01", {strong: (children) => <strong>{children}</strong>}),
          "C": t.rich("formularySection.formula01List02", {strong: (children) => <strong>{children}</strong>}),
          "i": t.rich("formularySection.formula01List03", {strong: (children) => <strong>{children}</strong>}),
          "t": t.rich("formularySection.formula01List04", {strong: (children) => <strong>{children}</strong>}),
        }}
      />

      <h2 className={TextGenericDesigns.pagesSubTitle}>{t("formularySection.formula02Title")}</h2>
      <ParagraphSection paragraphs={[
        t("formularySection.formula02Intro")
      ]}/>

      <FormulaCard equations={['\\mathbf{M = C \\times (1 + i)^{t} + PMT \\times \\frac{(1 + i)^{t} - 1}{i}}']} />

      <SymbolLegend symbols={{
          "PMT": t.rich("formularySection.formula02List01", {strong: (children) => <strong>{children}</strong>}),
        }}
      />

      <ParagraphSection paragraphs={[
        t("formularySection.interestFormulaIntro")
      ]} />

      <FormulaCard
        equations={[`\\mathbf{J = M - (C + PMT \\times t)}`]}
      />
    </ArticleLayoutDefault>
    </div>
  );
}

export default interest_calculator;