"use client";

import React from "react";
import { useTranslations } from "next-intl";        

import InputField from "@/components/ui/InputField/InputField";
import ReactiveButton from "@/components/ui/ReactiveButton/ReactiveButton";
import GenericChart from "@/components/GenericChart/GenericChart";
import { formatMoneyInput, formatMoneyValue } from "@/utils/formatters";
import TextGenericDesigns from "@/components/text/TextGenericDesigns.module.css";
import style from "./CompoundInterest.module.css";

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

function generateChartData(C, i, n, PMT) {
  const history = [];
  for (let month = 0; month <= n; month++) {
    const capitalAmount      = C * Math.pow(1 + i, month);
    const contributionAmount =
      i > 0
        ? PMT * ((Math.pow(1 + i, month) - 1) / i)
        : PMT * month;
    const total = capitalAmount + contributionAmount;
    history.push({
      monthIndex: month,
      capitalAmount: Number(capitalAmount.toFixed(2)),
      contributionAmount: Number(contributionAmount.toFixed(2)),
      totalAmount: Number(total.toFixed(2)),
    });
  }
  return history;
}

// ---------- constantes ----------

const MAX_SAFE   = Number.MAX_SAFE_INTEGER;
const MAX_MONTHS = 600;

// ---------- componente ----------

export default function CompoundInterest({ locale }) {
  const t = useTranslations("CompoundInterestCalculator");

  const currencySymbol  = locale === "pt" ? "R$" : "$";
  const decimalSeparator = locale === "pt" ? "," : ".";

  const unitLabels = {
    monthlyLabel: t("unitLabels.monthly"),
    yearlyLabel:  t("unitLabels.yearly"),
  };

  // ---- estado ----
  const [value, setValue] = React.useState({
    capital:              "",
    interestRate:         "",
    period:               "",
    periodicContribution: "",
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

  function calculateCompoundInterest() {
    const C   = parseLocalNum(value.capital,              locale);
    const PMT = parseLocalNum(value.periodicContribution, locale);
    const interestRateParsed = parseLocalNum(value.interestRate, locale);
    const period_value       = parseFloat(value.period);

    if (isNaN(C) || isNaN(interestRateParsed) || isNaN(period_value)) {
      alert(t("alertWrongValues"));
      return;
    }

    // 1. Taxa → mensal
    let monthlyRate = interestRateParsed;
    if (unit.interestRate_select === "yearly") {
      monthlyRate = (Math.pow(1 + interestRateParsed / 100, 1 / 12) - 1) * 100;
    }

    // 2. Período → meses
    let totalMonths = period_value;
    if (unit.period_select === "years") {
      totalMonths = period_value * 12;
    }

    if (totalMonths > MAX_MONTHS) {
      alert(t("alertPeriodTooLong"));
      return;
    }

    const i = monthlyRate / 100;
    const n = totalMonths;

    // 3. Montante
    let capitalAmount;
    let contributionAmount;

    if (i === 0) {
      capitalAmount      = C;
      contributionAmount = PMT * n;
    } else {
      const growthFactor = Math.pow(1 + i, n);
      capitalAmount      = C * growthFactor;
      contributionAmount = PMT * ((growthFactor - 1) / i);
    }

    const finalAmount = capitalAmount + contributionAmount;

    if (!Number.isFinite(finalAmount) || finalAmount > MAX_SAFE) {
      alert(finalAmount > MAX_SAFE ? t("alertValueTooHigh") : t("alertWrongValues"));
      setResults(null);
      return;
    }

    const totalInvested = C + PMT * n;
    const totalInterest = finalAmount - totalInvested;

    setChartData(generateChartData(C, i, n, PMT));
    setResults({
      invested: totalInvested,
      interest: totalInterest,
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
            { label: unitLabels.monthlyLabel, value: "months" },
            { label: unitLabels.yearlyLabel,  value: "years"  },
          ]}
        />

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
          <div className={locale === "pt" ? style.moneyIconReal : style.moneyIconDolar}>
            {currencySymbol}
          </div>
        </InputField>

        <div className={style.buttonContainer}>
          <ReactiveButton
            label={t("result.buttonLabel")}
            onClick={calculateCompoundInterest}   // ✅ sem parâmetros inline — usa estado diretamente
          />
        </div>
      </div>

      {/* Resultados */}
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

      {/* Gráficos */}
      {results && chartData.length > 0 && (
        <div className={style.chartsContainer}>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>{t("result.pieGraph")}</h3>
            <GenericChart chartType="pie" data={chartData} />
          </div>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>{t("result.barGraph")}</h3>
            <GenericChart chartType="area" data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}