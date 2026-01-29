"use client";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";
import React from "react";
import Article from "@/components/Article";
import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";
import simpleInterestExample from "@/assets/simple_interest_example.png";
import simpleInterestResultExample from "@/assets/simple_interest_result_example.png";


function toNumber(value) {
  // Remove tudo que não for dígito ou vírgula
  const cleaned = (value || "").replace(/[^\d,]/g, "");
  if (!cleaned) return 0;
  else return cleaned.replace(",", "");
}

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

function formatCurrency(value) {
  // Converte para número e divide por 100 para considerar os centavos
  const number = Number(value) / 100;

  // Formata o número como moeda brasileira
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const formatCurrencyDisplay = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

function interest_calculator() {
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
    var newValue = event.target.value;
    const inputName = event.target.name;

    if (event.target.dataset.kind === "money") {
      newValue = toNumber(newValue);

      // Se o newValue não for vazio ou igual a "00", formata como moeda. 
      // Caso contrário, define como string vazia.
      if (newValue !== "" && newValue !== "00") {
        newValue = formatCurrency(newValue)
      }
      else newValue = "" ;
    }

    if (event.target.dataset.kind === "percentage") {
      newValue = toNumber(newValue);

      if (newValue !== "" && newValue !== "00") {
        newValue =  formatCurrency(newValue);
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

  function calculateSimpleInterest(capital, interestRate, period, interestRateUnit, periodUnit) {
    // Implementar o cálculo de juros compostos aqui

    // --- FUNÇÃO AUXILIAR DE LIMPEZA ---
    const parseLocalNum = (val) => {
        if (!val) return 0;
        // 1. Remove tudo que NÃO for número ou vírgula (tira R$, pontos, espaços)
        let clean = val.toString().replace(/[^\d,]/g, ''); 
        // 2. Troca a vírgula por ponto (Padrão JS)
        clean = clean.replace(',', '.');
        return parseFloat(clean);
    };

    const C = parseLocalNum(capital);
    const interestRateParsed = parseLocalNum(interestRate);
    let t = parseFloat(period);

    // Verifica se os valores são válidos
    if (isNaN(C) || isNaN(interestRateParsed) || isNaN(t)) {
        alert("Por favor, preencha os campos corretamente.");
        return 0;
    }

    // 1. Converter a TAXA para MENSAL (juros simples → divisão direta)
    let monthlyRatePercent = interestRateParsed;
    if (interestRateUnit === "yearly") {
      monthlyRatePercent = interestRateParsed / 12;
    }

    // 2. Converter o PERÍODO para MESES (garante consistência com a taxa mensal)
    let totalMonths = t;
    if (periodUnit === "years") {
      totalMonths = t * 12;
    }

    // 3. Calcular
    const i = monthlyRatePercent / 100;
    const n = totalMonths;

    const chartHistory = generateChartData(C, i, n);
    setChartData(chartHistory);

    const capitalAmount = C * (1 + i * n);
    const finalAmount = capitalAmount;
    const totalInvested = C;
    const totalInterest = C * i * n;

    if (!Number.isFinite(finalAmount)) {
      setResults(null);
      alert("Por favor, preencha os campos corretamente.");
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
      <h1 className={tStyle.mainTitle}>Calculadora de Juros Simples</h1>
      <div className={style.inputFieldsContainer}>
        <InputField 
          label="Capital Inicial (R$)"
          name="capital"
          value={value.capital}
          onChange={handleChange}
          type="text"
          kind="money"
          placeholder={"0,00"}
          info="O capital inicial é o valor que você vai investir ou emprestar no início do período."
        >
          <div className={style.moneyIcon}> R$ </div>
        </InputField>

        <InputField
          label="Taxa de juros (%)"
          name="interestRate"
          value={value.interestRate}
          onChange={handleChange}
          type="text"
          kind="percentage"
          placeholder={"0,00"}
          info="A taxa de juros é o percentual que será aplicado sobre o capital inicial durante o período. Pode ser mensal ou anual."

          // Select dinâmico
          selectValue={unit.interestRate_select}                 
          onSelectChange={(val) => handleUnitChange('interestRate_select', val)}          
          selectOptions={[                                
            { label: 'Mensal', value: 'monthly' },
            { label: 'Anual', value: 'yearly' }
          ]}
        >
          <div className={style.percentageIcon}> % </div>
        </InputField>

        <InputField
          label="Periodo (t)"
          name="period"
          value={value.period}
          onChange={handleChange}
          placeholder={"00"}
          type="text"
          info="O tempo é o período durante o qual os juros serão aplicados. Pode ser em meses ou anos."
          selectValue={unit.period_select}
          onSelectChange={(val) => handleUnitChange('period_select', val)}
          selectOptions={[
            { label: 'Meses', value: 'months' },
            { label: 'Anos', value: 'years' }
          ]}
        >
        </InputField>

        <div className={style.buttonContainer}>
          <ReactiveButton 
            label="Calcular Juros Simples" 
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
            <h3 className={style.cardTitle}>Resumo do investimento</h3>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>Total investido</span>
              <span className={style.resultValue}>{formatCurrencyDisplay(results.invested)}</span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>Total de juros</span>
              <span className={style.resultValue}>{formatCurrencyDisplay(results.interest)}</span>
            </div>
            <div className={style.resultRowHighlight}>
              <span className={style.resultLabel}>Montante final</span>
              <span className={style.resultValue}>{formatCurrencyDisplay(results.final)}</span>
            </div>
          </div>
          )}
        </div> 
      </div>

      {chartData.length > 0 && (
        <div className={style.chartSection}>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>Gráfico de evolução</h3>
            <GenericChart 
              chartType="area"
              data={chartData}
            />
          </div>
        </div>
      )}

    <Article title="Como utilizar a calculadora de juros simples">
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          Para utilizar a calculadora de juros simples, siga os passos abaixo:
        </p>

        <div className={tStyle.infoHighlight}>
          <ol className={tStyle.stepList}>
            <li>Insira o capital inicial que você deseja investir ou emprestar no campo "Capital Inicial (R$)".</li>
            <li>Informe a taxa de juros no campo "Taxa de juros (%)". Selecione se a taxa é mensal ou anual no menu suspenso ao lado.</li>
            <li>Defina o período durante o qual os juros serão aplicados no campo "Periodo (t)". Escolha se o período está em meses ou anos no menu suspenso correspondente.</li>
            <li>Clique no botão "Calcular Juros Simples" para ver os resultados.</li>
          </ol>
        </div>

        <p className={tStyle.textParagraph}>
          Após clicar no botão, a calculadora exibirá um resumo do investimento, incluindo o total investido, o total de juros e o montante final. Além disso, serão apresentados gráficos que ilustram a distribuição do montante e a evolução do investimento ao longo do tempo.
        </p>

        <h2 className={tStyle.sectionHeading}>Exemplo</h2>

        <div className={tStyle.exampleCard}>
          <p className={tStyle.textParagraph}>
            Suponha que você invista R$ 1.000,00 com uma taxa de juros anual de 12% por um período de 2 anos.
          </p>
          <img
            src={simpleInterestExample.src}
            alt="Exemplo de cálculo de juros simples"
            className={style.imageAttribution}
          />
          <p className={tStyle.textParagraph}>
            Ao inserir esses valores na calculadora e clicar em "Calcular Juros Simples", você verá o resumo do investimento e os gráficos correspondentes, permitindo visualizar claramente como seu investimento cresce ao longo do tempo graças aos juros simples. Como a imagem abaixo:
          </p>
          <img
            src={simpleInterestResultExample.src}
            alt="Exemplo de resultado do cálculo de juros simples"
            className={style.imageAttribution}
          />
        </div>
      </div>
    </Article>
    <Article title="O que são Juros Simples?">
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          Juros simples calculam ganhos apenas sobre o capital inicial, sem acumular os juros ao longo do tempo.
        </p>

        <div className={tStyle.infoHighlight}>
          <p className={tStyle.textParagraph}>
            <strong>Exemplo rápido:</strong> investindo R$ 100,00 a 10% ao ano, você encerra o primeiro ano com 
            R$ 110,00. No segundo, os juros incidem sobre R$ 100,00 e geram R$ 10,00, fechando o período com R$ 120,00.
          </p>
        </div>

        <p className={tStyle.textParagraph}>
          Esse mecanismo não é o mais usado em investimentos, empréstimos e financiamentos, pois não aproveita o potencial 
          de crescimento dos juros compostos. Além disso, não reflete a realidade de muitos mercados financeiros, onde os juros
          são capitalizados periodicamente.
        </p>

        <p className={tStyle.textParagraph}>
          Precisa comparar com juros compostos? Visite a <a href="/compound-interest-calculator" className={tStyle.inlineLink}>
          nossa calculadora de juros compostos</a> para ver os resultados lado a lado.
        </p>

        <h2 className={tStyle.sectionHeading}>Diferença entre juros simples e compostos</h2>

        <p className={tStyle.textParagraph}>
          Juros simples sempre miram apenas o capital inicial. Juros compostos acumulam cada ganho e o reinvestem, 
          crescendo em ritmo acelerado a cada período.
        </p>

        <div className={tStyle.comparisonCard}>
          <p className={tStyle.textParagraph}>
            <strong>Comparando:</strong> com 10% ao ano, os juros compostos vão render mais conforme o tempo passa.
            Enquanto isso, os juros simples vão render sempre o mesmo tanto anualmente. Ou seja, se investirmos R$ 100,00 a
            10% ao ano, em 10 anos teremos: R$ 200,00 totais em juros simples versus R$ 259,37 totais em juros compostos.
          </p>
        </div>
      </div>
    </Article>

    <Article title="Fórmulas dos Juros Simples">
      <div className={tStyle.textSection}>
        <p className={tStyle.textParagraph}>
          Diferente dos juros compostos, temos fórmulas mais diretas para calcular o montante final em juros simples. E a
        </p>

        <h2 className={tStyle.sectionHeading}>Fórmula básica dos Juros Simples</h2>
        <div className={tStyle.formulaCard}>
          <span>
            M = C × (1 + i × t)
          </span>
        </div>

        <ul className={tStyle.symbolLegend}>
          <li><strong>M</strong> — montante final (capital + juros).</li>
          <li><strong>C</strong> — capital inicial aplicado.</li>
          <li><strong>i</strong> — taxa de juros por período (decimal: 5% = 0.05).</li>
          <li><strong>t</strong> — quantidade de períodos de capitalização.</li>
        </ul>

        <p className={tStyle.textParagraph}>
          Com essa fórmula, você pode calcular o montante final (M) ao investir um capital inicial (C) a uma taxa de juros 
          (i) por um determinado número de períodos (t).
        </p>

        <p className={tStyle.textParagraph}>
          Assim como nos juros compostos, o juros é calculado por M - C, ou seja, o montante menos o capital inicial.
        </p>

         <div className={tStyle.formulaCard}>
          <span>
            J = C × i × t = M - C
          </span>
        </div>
      </div>
    </Article>
    </div>
  );
}

export default interest_calculator;