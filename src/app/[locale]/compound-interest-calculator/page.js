"use client"
import JsonLd from "@/components/JsonLd";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";
import React from "react";
import Article from "@/components/Article";
import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";

import { useTranslations } from "next-intl";
import Link from 'next/link';
import { useParams } from 'next/navigation'; 

{/* Utils */}
import { formatMoneyInput, formatMoneyValue } from "@/utils/formatters";

{/* Imagens */}
import compoundInterestExampleEn from "@/assets/compound_interest_example_en.png";
import compoundInterestResultExampleEn from "@/assets/compound_interest_result_example_en.png";
import compoundInterestExample from "@/assets/compound_interest_example.png";
import compoundInterestResultExample from "@/assets/compound_interest_result_example.png";


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

        <div className={style.resultContainer}>
          {results && (
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
          )}
        </div> 
      </div>

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
    
    <Article title={t("usageTutorial.title")}>
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          {t("usageTutorial.intro")}
        </p>

        <div className={tStyle.infoHighlight}>
          <ol className={tStyle.stepList}>
            <li>{t.rich("usageTutorial.step01", {
              strong: (children) => <strong>{children}</strong>
            })}</li>
            <li>{t.rich("usageTutorial.step02", {
              strong: (children) => <strong>{children}</strong>
            })}</li>
            <li>{t.rich("usageTutorial.step03", {
              strong: (children) => <strong>{children}</strong>
            })}</li>
            <li>{t.rich("usageTutorial.step04", {
              strong: (children) => <strong>{children}</strong>
            })}</li>
            <li>{t.rich("usageTutorial.step05", {
              strong: (children) => <strong>{children}</strong>
            })}</li>
          </ol>
        </div>

        <p className={tStyle.textParagraph}>
          {t("usageTutorial.conclusion")}
        </p>

        <h2 className={tStyle.sectionHeading}>{t("exampleCalculation.title")}</h2>

        <div className={tStyle.exampleCard}>
          <p className={tStyle.textParagraph}>
            {t("exampleCalculation.scenario")}
          </p>
          <img
            src={locale === 'pt' ? compoundInterestExample.src : compoundInterestExampleEn.src}
            alt={t("exampleCalculation.imageAlt")}
            className={style.imageAttribution}
          />
          <p className={tStyle.textParagraph}>
            {t.rich("exampleCalculation.calculationStep", {
              strong: (children) => <strong>{children}</strong>
            })}
          </p>
          <img
            src={locale === 'pt' ? compoundInterestResultExample.src : compoundInterestResultExampleEn.src}
            alt={t("exampleCalculation.resultImageAlt")}
            className={style.imageAttribution}
          />
          <p className={tStyle.textParagraph}>
            {t("exampleCalculation.conclusion")}
          </p>
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
          {t("definitionSection.importance")}
        </p>

        <p className={tStyle.textParagraph}>
          {t.rich("definitionSection.compareLink", {
            link: (children) => <Link href={`/${locale}/simple-interest-calculator`} className={tStyle.inlineLink}>{children}</Link>
          })}
        </p>

        <h2 className={tStyle.sectionHeading}>{t("comparativeSection.title")}</h2>

        <p className={tStyle.textParagraph}>
          {t("comparativeSection.intro")}
        </p>

        <div className={tStyle.comparisonCard}>
          <p className={tStyle.textParagraph}>
            {t.rich("comparativeSection.example", {
              strong: (children) => <strong>{children}</strong>
            })}
          </p>
          <p>
            {t("comparativeSection.conclusion")}
          </p>
        </div>
      </div>
    </Article>

    <Article title={t("formularySection.title")}>
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          {t("formularySection.intro")}
        </p>

        <h2 className={tStyle.sectionHeading}>{t("formularySection.formula01Title")}</h2>
        <p className={tStyle.textParagraph}>
          {t("formularySection.formula01Intro")}
        </p>

        <div className={tStyle.formulaCard}>
          <span>
            M = C &times; (1 + i)<sup>t</sup>
          </span>
        </div>

        <ul className={tStyle.symbolLegend}>
          <li>{t.rich("formularySection.formula01List01", {
            strong: (children) => <strong>{children}</strong>
          })}</li>
          <li>{t.rich("formularySection.formula01List02", {
            strong: (children) => <strong>{children}</strong>
          })}</li>
          <li>{t.rich("formularySection.formula01List03", {
            strong: (children) => <strong>{children}</strong>
          })}</li>
          <li>{t.rich("formularySection.formula01List04", {
            strong: (children) => <strong>{children}</strong>
          })}</li>
        </ul>

        <h2 className={tStyle.sectionHeading}>{t("formularySection.formula02Title")}</h2>
        <p className={tStyle.textParagraph}>
          {t("formularySection.formula02Intro")}
        </p>

        <div className={tStyle.formulaCard}>
          <span>
            M = C &times; (1 + i)<sup>t</sup> + PMT &times;
          </span>
          <span className={tStyle.fraction}>
            <span className={tStyle.numerator}>(1 + i)<sup>t</sup> - 1</span>
            <span className={tStyle.denominator}>i</span>
          </span>
        </div>

        <ul className={tStyle.symbolLegend}>
          <li>{t.rich("formularySection.formula02List01", {
            strong: (children) => <strong>{children}</strong>
          })}</li>
          <li>{t("formularySection.formula02List02")}</li>
        </ul>
        <p className={tStyle.textParagraph}>
          {t("formularySection.interestFormulaIntro")}
        </p>

        <div className={tStyle.formulaCard}>
          <span>
            J = M - (C + PMT &times; t)
          </span>
        </div>

      </div>
    </Article>
    </div>
  );
}

export default interest_calculator;