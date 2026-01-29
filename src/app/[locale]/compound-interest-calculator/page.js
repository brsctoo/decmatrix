"use client";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";
import React from "react";
import Article from "@/components/Article";
import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";
import compoundInterestExample from "@/assets/compound_interest_example.png";
import compoundInterestResultExample from "@/assets/compound_interest_result_example.png";

import { useTranslations } from "use-intl";
import Link from 'next/link';
import { useParams } from 'next/navigation'; 


function toNumber(value, locale) {
  const decimalSeparator = locale === "pt" ? "," : ".";
  const thousandsSeparator = locale === "pt" ? "." : ",";

  const cleaned = (value || "")
    .replace(new RegExp(`\\${thousandsSeparator}`, "g"), "")
    .replace(new RegExp(`[^\\d${decimalSeparator}]`, "g"), "");

  if (!cleaned) return 0;
  return cleaned.replace(decimalSeparator, ".");
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

function formatCurrency(value, locale) {
  const number = Number(value) / 100;

  return number.toLocaleString(locale === "pt" ? "pt-BR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const formatCurrencyDisplay = (value, locale) =>
  Number(value || 0).toLocaleString(locale === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });


function interest_calculator() {
  const t = useTranslations("CompoundInterestCalculator");
  const { locale } = useParams(); // Pega o locale da URL

  const decimalSeparator = locale === "pt" ? "," : ".";

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
    var newValue = event.target.value;
    const inputName = event.target.name;

    if (event.target.dataset.kind === "money") {
      newValue = toNumber(newValue, locale);

      // Se o newValue não for vazio ou igual a "00", formata como moeda. 
      // Caso contrário, define como string vazia.
      if (newValue !== "" && newValue !== "00") {
        newValue = formatCurrency(newValue, locale)
      }
      else newValue = "" ;
    }

    if (event.target.dataset.kind === "percentage") {
      newValue = toNumber(newValue, locale);

      if (newValue !== "" && newValue !== "00") {
        newValue =  formatCurrency(newValue, locale);
      }
      else newValue = "" ;
    }

    setValue(prevValue => {
      return {
        ...prevValue,
        [inputName]: newValue
      }
    });
  }

  function calculateCompoundInterest(capital, interestRate, period, periodicContribution, interestRateUnit, periodUnit) {
    // --- FUNÇÃO AUXILIAR DE LIMPEZA ---
    const parseLocalNum = (val) => {
        if (!val) return 0;
      const decimalSep = locale === "pt" ? "," : ".";
      const thousandsSep = locale === "pt" ? "." : ",";
      let clean = val
        .toString()
        .replace(new RegExp(`\\${thousandsSep}`, "g"), "")
        .replace(new RegExp(`[^\\d${decimalSep}]`, "g"), "");
      clean = clean.replace(decimalSep, ".");
        return parseFloat(clean);
    };

    const C = parseLocalNum(capital);
    const interestRateParsed = parseLocalNum(interestRate);
    const PMT = parseLocalNum(periodicContribution);
    let t = parseFloat(period);

    // Verifica se os valores são válidos
    if (isNaN(C) || isNaN(interestRateParsed) || isNaN(t)) {
        alert(t("alertWrongValues"));
        return 0;
    }

    // 1. Converter a TAXA para MENSAL (Usando Taxa Equivalente)
    let monthlyRate = interestRateParsed;
    if (interestRateUnit === 'yearly') {
        // (1 + 0.10)^(1/12) - 1
        monthlyRate = (Math.pow(1 + (interestRateParsed / 100), 1 / 12) - 1) * 100;
    }

    // 2. Converter o PERÍODO para MESES (se estiver em anos)
    let totalMonths = t;
    if (periodUnit === 'years') {
      totalMonths = t * 12;
    }

    // 4. Calcular
    const i = monthlyRate / 100;
    const n = totalMonths; // Usando 'n' que é padrão financeiro (ou 't')

    const chartHistory = generateChartData(C, i, n, PMT);
    setChartData(chartHistory);

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

  return (
    <div>
      {/* 
        A calculadora deve ser dividida em 2 partes -> calculadora de juros simples e calculadora de juros compostos 
        Juros Simples -> Fórmula: J = C * i * t, ou seja, depende do capital inicial, da taxa de juros e do tempo.

        Juros Compostos -> Fórmula: M = C * (1 + i)^t, ou seja, depende do capital inicial, da taxa de juros e do tempo.
        No Juros compostos, também será possível colocar uma contribuisão periódica (mensal, anual, etc) para o cálculo do montante final.
      */}
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
          <div className={style.moneyIcon}> R$ </div>
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
            { label: t("inputInterest.selectMonthly"), value: 'monthly' },
            { label: t("inputInterest.selectYearly"), value: 'yearly' }
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
            { label: t("inputPeriod.selectMonths"), value: 'months' },
            { label: t("inputPeriod.selectYears"), value: 'years' }
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
          <div className={style.moneyIcon}> R$ </div>
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
              <span className={style.resultValue}>{formatCurrencyDisplay(results.invested, locale)}</span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.totalInterest")}</span>
              <span className={style.resultValue}>{formatCurrencyDisplay(results.interest, locale)}</span>
            </div>
            <div className={style.resultRowHighlight}>
              <span className={style.resultLabel}>{t("result.finalAmount")}</span>
              <span className={style.resultValue}>{formatCurrencyDisplay(results.final, locale)}</span>
            </div>
          </div>
          )}
        </div> 
      </div>

      {chartData.length > 0 && (
        <div className={style.chartsContainer}>
          {chartData.length > 0 && (
            <div className={style.chartWrapper}>
              <h3 className={style.cardTitle}>{t("result.pieGraph")}</h3>
              <GenericChart 
                chartType="pie"
                data={chartData}
              />
            </div>
          )}

          {chartData.length > 0 && (
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
            src={compoundInterestExample.src}
            alt={t("exampleCalculation.imageAlt")}
            className={style.imageAttribution}
          />
          <p className={tStyle.textParagraph}>
            {t.rich("exampleCalculation.calculationStep", {
              strong: (children) => <strong>{children}</strong>
            })}
          </p>
          <img
            src={compoundInterestResultExample.src}
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
            {/* AQUI TEM HTML DENTRO DO JSON */}
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
            linkSimpleCalc: (children) => (
              <Link href={`/${locale}/simple-interest-calculator`} className={tStyle.inlineLink}>
                {children}
              </Link>
            )
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