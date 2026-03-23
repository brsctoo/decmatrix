"use client";

import React from "react";
import { useTranslations } from "next-intl";

import InputField from "@/components/ui/InputField/InputField";
import ReactiveButton from "@/components/ui/ReactiveButton/ReactiveButton";
import GenericChart from "@/components/GenericChart/GenericChart";
import { formatMoneyInput, formatMoneyValue } from "@/utils/formatters";
import TextGenericDesigns from "@/components/text/TextGenericDesigns.module.css";
import style from "./SimpleInterest.module.css";

// ---------- helpers puros ----------

function toNumber(value) {
  if (!value) return "";
  return value.toString().replace(/\D/g, "");
}

function parseLocalNum(val, locale) {
  if (!val) return 0;
  const decimalSep   = locale === "pt" ? "," : ".";
  const thousandsSep = locale === "pt" ? "." : ",";
  let clean = val
    .toString()
    .replace(new RegExp(`\\${thousandsSep}`, "g"), "")
    .replace(new RegExp(`[^\\d${decimalSep}]`, "g"), "");
  clean = clean.replace(decimalSep, ".");
  return parseFloat(clean);
}

function generateChartData(C, i, n) {
  const history = [];
  for (let month = 0; month <= n; month++) {
    history.push({
      monthIndex:     month,
      investedAmount: Number(C.toFixed(2)),
      capitalAmount:  Number((C * (1 + i * month)).toFixed(2)),
      interestAmount: Number((C * i * month).toFixed(2)),
    });
  }
  return history;
}

// ---------- constantes ----------

const MAX_SAFE   = Number.MAX_SAFE_INTEGER;
const MAX_MONTHS = 600;

// ---------- componente ----------

export default function SimpleInterest({ locale }) {
  const t = useTranslations("SimpleInterestCalculator");

  const currencySymbol   = locale === "pt" ? "R$" : "$";
  const decimalSeparator = locale === "pt" ? "," : ".";

  const unitLabels = {
    monthlyLabel: t("unitLabels.monthly"),
    yearlyLabel:  t("unitLabels.yearly"),
    monthsLabel:  t("unitLabels.months"),
    yearsLabel:   t("unitLabels.years"),
  };

  // ---- estado ----

  const [value, setValue] = React.useState({
    capital:      "",
    interestRate: "",
    period:       "",
  });

  const [unit, setUnit] = React.useState({
    period_select:       "months",
    interestRate_select: "monthly",
  });

  const [results,   setResults]   = React.useState(null);
  const [chartData, setChartData] = React.useState([]);

  // ---- handlers ----

  function handleUnitChange(fieldName, newValue) {
    setUnit((prev) => ({ ...prev, [fieldName]: newValue }));
  }

  function handleChange(event) {
    const { name, value: rawValue, dataset } = event.target;
    let processedValue = rawValue;

    if (dataset.kind === "money" || dataset.kind === "percentage") {
      const digitsOnly = toNumber(rawValue);
      processedValue = digitsOnly !== "" ? formatMoneyInput(digitsOnly, locale) : "";
    }

    setValue((prev) => ({ ...prev, [name]: processedValue }));
  }

  // ---- cálculo principal ----

  function calculateSimpleInterest() {
    const C                  = parseLocalNum(value.capital,      locale);
    const interestRateParsed = parseLocalNum(value.interestRate, locale);
    const periodValue        = parseFloat(value.period);

    if (isNaN(C) || isNaN(interestRateParsed) || isNaN(periodValue)) {
      alert(t("alertWrongValues"));
      return;
    }

    // 1. Taxa → mensal (juros simples: divisão direta, sem taxa equivalente)
    let monthlyRatePercent = interestRateParsed;
    if (unit.interestRate_select === "yearly") {
      monthlyRatePercent = interestRateParsed / 12;
    }

    // 2. Período → meses
    let totalMonths = periodValue;
    if (unit.period_select === "years") {
      totalMonths = periodValue * 12;
    }

    if (totalMonths > MAX_MONTHS) {
      alert(t("alertPeriodTooLong"));
      return;
    }

    const i = monthlyRatePercent / 100;
    const n = totalMonths;

    const finalAmount = C * (1 + i * n);

    if (finalAmount > MAX_SAFE) {
      alert(t("alertValueTooHigh"));
      setResults(null);
      return;
    }

    if (!Number.isFinite(finalAmount)) {
      alert(t("alertWrongValues"));
      setResults(null);
      return;
    }

    setChartData(generateChartData(C, i, n));
    setResults({
      invested: C,
      interest: C * i * n,
      final:    finalAmount,
    });
  }

  // ---- render ----

  return (
    <div>
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
          <div className={locale === "pt" ? style.moneyIconReal : style.moneyIconDolar}>
            {currencySymbol}
          </div>
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
          onSelectChange={(val) => handleUnitChange("interestRate_select", val)}
          selectOptions={[
            { label: unitLabels.monthlyLabel, value: "monthly" },
            { label: unitLabels.yearlyLabel,  value: "yearly"  },
          ]}
        >
          <div className={style.percentageIcon}>%</div>
        </InputField>

        <InputField
          label={t("inputPeriod.label")}
          name="period"
          value={value.period}
          onChange={handleChange}
          placeholder="00"
          type="text"
          info={t("inputPeriod.info")}
          selectValue={unit.period_select}
          onSelectChange={(val) => handleUnitChange("period_select", val)}
          selectOptions={[
            { label: unitLabels.monthsLabel, value: "months" },
            { label: unitLabels.yearsLabel,  value: "years"  },
          ]}
        />

        <div className={style.buttonContainer}>
          <ReactiveButton
            label={t("result.buttonLabel")}
            onClick={calculateSimpleInterest}
          />
        </div>
      </div>

      {/* Resultados */}
      {results && (
        <div className={style.resultContainer}>
          <div className={style.resultsCard}>
            <h3 className={style.cardTitle}>{t("result.summaryTitle")}</h3>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.investedLabel")}</span>
              <span className={style.resultValue}>{formatMoneyValue(results.invested, locale)}</span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.interestLabel")}</span>
              <span className={style.resultValue}>{formatMoneyValue(results.interest, locale)}</span>
            </div>
            <div className={style.resultRowHighlight}>
              <span className={style.resultLabel}>{t("result.finalLabel")}</span>
              <span className={style.resultValue}>{formatMoneyValue(results.final, locale)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico */}
      {results && chartData.length > 0 && (
        <div className={style.chartSection}>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>{t("result.evolutionGraph")}</h3>
            <GenericChart chartType="area" data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}