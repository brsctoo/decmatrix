"use client";
import JsonLd from "@/components/JsonLd";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";
import React from "react";
import Article from "@/components/Article";
import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from 'next/navigation'; 

{/* Utils */}
import { formatMoneyValue, formatMoneyInput } from "@/utils/formatters";

{/* Images */}
import simpleInterestExample from "@/assets/simple_interest_example.png";
import simpleInterestResultExample from "@/assets/simple_interest_result_example.png";
import simpleInterestExampleEn from "@/assets/simple_interest_example_en.png";
import simpleInterestResultExampleEn from "@/assets/simple_interest_result_example_en.png";

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
      <h1 className={tStyle.mainTitle}>{t("mainTitle")}</h1>
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

        <div className={style.resultContainer}>
          {results && (
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
          )}
        </div> 
      </div>

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

    <Article title={t("usageTutorial.title")}>
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          {t("usageTutorial.intro")}
        </p>

        <div className={tStyle.infoHighlight}>
          <ol className={tStyle.stepList}>
            <li>{t("usageTutorial.step1")}</li>
            <li>{t("usageTutorial.step2")}</li>
            <li>{t("usageTutorial.step3")}</li>
            <li>{t("usageTutorial.step4")}</li>
          </ol>
        </div>

        <p className={tStyle.textParagraph}>
          {t("usageTutorial.conclusion")}
        </p>

        <h2 className={tStyle.sectionHeading}>{t("exampleCalculation.title")}</h2>

        <div className={tStyle.exampleCard}>
          <p className={tStyle.textParagraph}>
            {t("exampleCalculation.intro")}
          </p>
          <img
            src={locale === 'pt' ? simpleInterestExample.src : simpleInterestExampleEn.src}
            alt={t("exampleCalculation.imageAlt1")}
            className={style.imageAttribution}
          />
          <p className={tStyle.textParagraph}>
            {t("exampleCalculation.description")}
          </p>
          <img
            src={locale === 'pt' ? simpleInterestResultExample.src : simpleInterestResultExampleEn.src}
            alt={t("exampleCalculation.imageAlt2")}
            className={style.imageAttribution}
          />
        </div>
      </div>
    </Article>

    <Article title={t("definitionSection.title")}>
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          {t("definitionSection.intro")}
        </p>

        <div className={tStyle.infoHighlight}>
          <p className={tStyle.textParagraph}>
            {t.rich("definitionSection.example", {
              strong: (children) => <strong>{children}</strong> 
            })}
          </p>
        </div>

        <p className={tStyle.textParagraph}>
          {t("definitionSection.limitations")}
        </p>

        <p className={tStyle.textParagraph}>
          {t.rich("definitionSection.compareLink", {
            link: (children) => <Link href={`/${locale}/compound-interest-calculator`} className={tStyle.inlineLink}>{children}</Link>
          })}
        </p>

        <h2 className={tStyle.sectionHeading}>{t("comparativeSection.title")}</h2>

        <p className={tStyle.textParagraph}>
          {t("comparativeSection.intro")}
        </p>

        <div className={tStyle.comparisonCard}>
          <p className={tStyle.textParagraph}>
            {t.rich("comparativeSection.example" , {
              strong: (children) => <strong>{children}</strong> 
            })}
          </p>
        </div>
      </div>
    </Article>

    <Article title={t("formularySection.title")}>
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          {t("formularySection.intro")}
        </p>

        <h2 className={tStyle.sectionHeading}>{t("formularySection.basicFormulaTitle")}</h2>
        <div className={tStyle.formulaCard}>
          <span>
            {t("formularySection.basicFormula")}
          </span>
        </div>

        <ul className={tStyle.symbolLegend}>
          <li>{t.rich("formularySection.symbolM", { strong: (children) => <strong>{children}</strong> })}</li>
          <li>{t.rich("formularySection.symbolC", { strong: (children) => <strong>{children}</strong> })}</li>
          <li>{t.rich("formularySection.symbolI", { strong: (children) => <strong>{children}</strong> })}</li>
          <li>{t.rich("formularySection.symbolT", { strong: (children) => <strong>{children}</strong> })}</li>
        </ul>

        <p className={tStyle.textParagraph}>
          {t("formularySection.formulaExplanation")}
        </p>

        <p className={tStyle.textParagraph}>
          {t("formularySection.interestCalculation")}
        </p>

         <div className={tStyle.formulaCard}>
          <span>
            {t("formularySection.interestFormula")}
          </span>
        </div>
      </div>
    </Article>
    </div>
  );
}

export default interest_calculator;