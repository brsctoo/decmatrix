"use client";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";
import React from "react";
import Article from "@/components/Article";
import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";
import quadraticEquationExample from "@/assets/quadratic_equation_example.png";
import quadraticEquationResultExample01 from "@/assets/quadratic_equation_result_example01.png";
import quadraticEquationResultExample02 from "@/assets/quadratic_equation_result_example02.png";

import { ReferenceDot } from "recharts";

import MathDisplay from '@/components/MathDisplay';

function generateChartData(a, b, c, root1 = null, root2 = null, delta, rangeSize = 6) {

  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const numC = parseFloat(c);

  if (isNaN(numA) || isNaN(numB) || isNaN(numC)) return [];

  const history = [];

  // 2. Achar o Vértice (O centro da curva) para centralizar a visão
  // X do Vértice = -b / 2a
  // Se a for 0 (reta), centralizamos no 0 mesmo.
  const vx = numA !== 0 ? -numB / (2 * numA) : 0;
  let zoomFixer = 0;

  // 3. Definir o "Zoom" (Range)

  if (root1 !== null && root2 !== null) {
    zoomFixer = Math.abs(vx - root1) + 4;
  } else {
    // Quando não há raízes reais, usa um range baseado no vértice
    zoomFixer = Math.abs(vx) + 4;
  }

  // Limitar o zoom para não gerar muitos pontos
  zoomFixer = Math.min(Math.max(zoomFixer, 4), 20);

  const range = zoomFixer;
  const start = Math.floor(vx - range);
  const end = Math.ceil(vx + range);
  const step = 0.1;

  for (let x = start; x <= end; x += step) {
    const y = numA * (x ** 2) + numB * x + numC;

    history.push({
      x: x,
      y: Number(y.toFixed(2))
    });

  }

  if (root1 !== null && root1 >= start && root1 <= end) {
    history.push({
      x: root1,
      y: 0
    });
  }

  if (root2 !== null && root2 >= start && root2 <= end) {
    history.push({
      x: root2,
      y: 0
    });
  }

  history.sort((a, b) => a.x - b.x); // Garantir que os pontos estejam ordenados pelo eixo x

  return history;
}


function quadratic_equation_calculator() {

  const [chartData, setChartData] = React.useState([]);
  const [results, setResults] = React.useState(null);

  const [value, setValue] = React.useState({
    a: "",
    b: "",
    c: "",
  });
  
  function handleChange(event) {
    var newValue = event.target.value;
    const inputName = event.target.name;

    if (newValue.length > 9) {
      alert("O valor máximo permitido é de 9 caracteres.");
      return; // Limita o tamanho do input para 9 caracteres
    }

    if (inputName === "a" && newValue === "0") {
      alert("O coeficiente 'a' não pode ser zero em uma equação do segundo grau.");
      return; // Impede que 'a' seja zero
    }

    setValue(prevValue => {
        return {
          ...prevValue,
          [inputName]: newValue
        }
    });
  }

  function calculateQuadraticRoots(a, b, c) {  

    const numA = Number(a);
    const numB = Number(b);
    const numC = Number(c);

    if (numA === 0 || Number.isNaN(numA) || Number.isNaN(numB) || Number.isNaN(numC)) {
      alert("Por favor, insira valores numéricos válidos para os coeficientes, e certifique-se de que 'a' não seja zero.");
      return;
    }

    if (b === "" || c === "") { 
      alert("Por favor, insira valores numéricos válidos para os coeficientes 'b' e 'c'.");
      return; 
    }

    const delta = (numB ** 2) - (4 * numA * numC);

    const roots = {
      root1_fraction: null,
      root2_fraction: null,
      root1: null,
      root2: null,
    };

    if (delta < 0) {
      const sqrtDelta = Math.sqrt(Math.abs(delta));
      // Frações na forma: (-b ± √(-Δ) i) / 2a
      if (numB < 0) {
        roots.root1_fraction = <MathDisplay equation={`\\mathbf{\\frac{-(${numB}) + \\sqrt{${-delta}}\\,i}{${2 * numA}}}`} />;
        roots.root2_fraction = <MathDisplay equation={`\\mathbf{\\frac{-(${numB}) - \\sqrt{${-delta}}\\,i}{${2 * numA}}}`} />;
      } else {
        roots.root1_fraction = <MathDisplay equation={`\\mathbf{\\frac{-${numB} + \\sqrt{${-delta}}\\,i}{${2 * numA}}}`} />;
        roots.root2_fraction = <MathDisplay equation={`\\mathbf{\\frac{-${numB} - \\sqrt{${-delta}}\\,i}{${2 * numA}}}`} />;
      }

      const realPart = -numB / (2 * numA);
      const imaginaryPart = sqrtDelta / (2 * numA);

      // Forma simplificada: x = real ± imag i
      roots.root1 = <MathDisplay equation={`\\mathbf{${realPart} + ${imaginaryPart}i}`} />;
      roots.root2 = <MathDisplay equation={`\\mathbf{${realPart} - ${imaginaryPart}i}`} />; 

      setChartData(generateChartData(numA, numB, numC, null, null, delta));
    }

    if (delta >= 0) {
      const sqrtDelta = Math.sqrt(delta);
      // Coloca parenteses apenas se b for menor que 0
      if (numB < 0) {
        roots.root1_fraction = <MathDisplay equation={`\\mathbf{\\frac{-(${numB}) + \\sqrt{${delta}}}{${2 * numA}}}`} />;
        roots.root2_fraction = <MathDisplay equation={`\\mathbf{\\frac{-(${numB}) - \\sqrt{${delta}}}{${2 * numA}}}`} />;
      } else {
        roots.root1_fraction = <MathDisplay equation={`\\mathbf{\\frac{-${numB} + \\sqrt{${delta}}}{${2 * numA}}}`} />;
        roots.root2_fraction = <MathDisplay equation={`\\mathbf{\\frac{-${numB} - \\sqrt{${delta}}}{${2 * numA}}}`} />;
      }
      roots.root1 = (-numB + sqrtDelta) / (2 * numA);
      roots.root2 = (-numB - sqrtDelta) / (2 * numA);  

      setChartData(generateChartData(numA, numB, numC, roots.root1, roots.root2, delta));
    }

    setResults({
      roots: roots,
      delta: delta
    });

    return roots;
  } 

  return (
    <div>
      <h1 className={tStyle.mainTitle}>Equação do Segundo Grau</h1>
      <div className={style.inputFieldsContainer}>
        <InputField 
          label="Coeficiente a"
          name="a"
          value={value.a}
          onChange={handleChange}
          type="number"
          placeholder={"0"}
          info="O coeficiente 'a' é o valor que multiplica o termo quadrático (x²) na equação do 
          segundo grau. Ele determina a concavidade da parábola representada pela equação."
        >
        </InputField>

        <InputField
          label="Coeficiente b"
          name="b"
          value={value.b}
          onChange={handleChange}
          type="number"
          placeholder={"0"}
          info="O coeficiente 'b' é o valor que multiplica o termo linear (x) na equação do segundo grau. 
          Ele influencia a inclinação da parábola representada pela equação."
        >
        </InputField>

        <InputField
          label="Coeficiente c"
          name="c"
          value={value.c}
          onChange={handleChange}
          placeholder={"0"}
          type="number"
          info="O coeficiente 'c' é o termo constante na equação do segundo grau. Ele determina o ponto 
          onde a parábola intercepta o eixo y."
        >
        </InputField>

        <div className={tStyle.interativeFormulaCard}>
          Equação montada

          <p style={{ fontSize: '1.5rem', fontFamily: 'serif' }}>
  
            {(Number(value.a) !== 0 || value.a === "") && (
              <>
                {value.a < 0 ? " - " : " "}
                
                <span style={{color: 'rgb(156, 109, 60)'}}>
                  {value.a !== "" ? Math.abs(value.a) : "a"}
                </span>
                x²
              </>
            )}

            {(Number(value.b) !== 0 || value.b === "") && (
              <>
                {value.b < 0 ? " - " : " "}
                {/* + aparece somente se a existir */}
                {(Number(value.a) !== 0 || value.a === "") && (value.b > 0 || value.b === "") && (
                  <>
                    {"+ "}
                  </>
                )}
                
                <span style={{color: 'rgb(156, 109, 60)'}}>
                  {value.b !== "" ? Math.abs(value.b) : "b"}
                </span>
                x
              </>
            )}

            {(Number(value.c) !== 0 || value.c === "") && (
              <>
                {value.c < 0 ? " - " : " "}

                {/* + aparece somente se a ou b existirem */}
                {(Number(value.a) !== 0 || value.a === "" || Number(value.b) !== 0 || value.b === "") 
                && (value.c > 0 || value.c === "") && (
                  <>
                    {"+ "}
                  </>
                )}
                
                <span style={{color: 'rgb(156, 109, 60)'}}>
                  {value.c !== "" ? Math.abs(value.c) : "c"}
                </span>
              </>
            )}
          </p>
        </div>

        <div className={style.buttonContainer}>
          <ReactiveButton 
            label="Calcular Raízes" 
            onClick={() => calculateQuadraticRoots(
              value.a,
              value.b,
              value.c,
            )}
          />
        </div>

        <div className={style.resultContainer}>
          {results && (
          <div className={style.resultsCard}>
            <h3 className={style.cardTitle}>Raízes da equação</h3>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>Raíz 1</span>
              <span className={style.resultValue}>{results.roots.root1}</span>
              <span className={style.quadraticFraction}>
                {results.roots.root1_fraction}
              </span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>Raíz 2</span>
              <span className={style.resultValue}>{results.roots.root2}</span>
              <span className={style.quadraticFraction}>
                {results.roots.root2_fraction}
              </span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>Delta</span>
              <span className={style.resultValue}>{results.delta}</span>
            </div>
          </div>
          )}
        </div> 
      </div>

      {chartData.length > 0 && (
        <div className={style.chartSection}>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>Gráfico da equação</h3>
            <GenericChart 
              chartType="line"
              data={chartData}
            >
              {/* Raiz 1 */}
              {results?.roots?.root1 !== null && results?.delta >= 0 && (
                <ReferenceDot 
                  x={results.roots.root1} 
                  y={0} 
                  r={6} 
                  fill="red" 
                  stroke="white" 
                  strokeWidth={2}
                  label={{ position: 'top', value: 'x1', fill: 'red', fontSize: 12 }} 
                />
              )}

              {/* Raiz 2 */}
              {results?.roots?.root2 !== null && results?.delta >= 0 && (
                <ReferenceDot 
                  x={results.roots.root2} 
                  y={0} 
                  r={6} 
                  fill="red" 
                  stroke="white" 
                  strokeWidth={2}
                  label={{ position: 'top', value: 'x2', fill: 'red', fontSize: 12 }} 
                />
              )}
            </GenericChart>
          </div>
        </div>
      )}

      {results && (
        <Article title="Passo a passo da resolução">
          <div className={tStyle.textSection}>
            <div className={tStyle.infoHighlight}>
              <ol className={tStyle.stepList}>
                <li>
                  <strong>Identifique os coeficientes:</strong> Na equação {value.a}x² + {value.b}x + {value.c} = 0, 
                  nós temos que o a = {value.a}, b = {value.b} e c = {value.c}.
                </li>
                <li>
                  <strong>Calcule o discriminante (delta) (Δ):</strong> Usando a fórmula Δ = b² - 4ac
                  para calcular o valor do delta, temos:
                  <div className={style.quadraticDeltaFormulaCard}>
                      <MathDisplay equation={`\\mathbf{\\Delta = (${value.b})^2 - 4 \\times (${value.a}) \\times (${value.c})}`} />
                      <MathDisplay equation={`\\mathbf{\\Delta = ${value.b ** 2} - ${4 * value.a * value.c}}`} />
                      <MathDisplay equation={`\\mathbf{\\Delta = ${results.delta}}`} />
                  </div>
                  </li>
                <li><strong>Determine o número de raízes:</strong>
                  <ul className={tStyle.subStepList}>
                    {results.delta > 0 && (
                      <p>Como Δ {'>'} 0, já que delta = {results.delta}, a equação tem duas raízes reais e distintas.</p>
                    )}
                    {results.delta === 0 && (
                      <li>Como Δ = 0, já que delta = {results.delta}, a equação tem uma raiz real dupla.</li>
                    )}
                    {results.delta < 0 && (
                      <li>Como Δ {'<'} 0, já que delta = {results.delta}, a equação não tem raízes reais (as raízes são complexas).</li>
                    )}
                  </ul>
                </li>
                <li><strong>Calcule as raízes:</strong> Usando a fórmula de Bhaskara para encontrar as raízes:
                  <div className={style.quadraticFormulaCard}>
                      <MathDisplay equation={`\\mathbf{x =\\frac{-b ± \\sqrt{Δ}}{2a}}`} />
                      
                      {/* Resultado em forma de fração */}
                      <div className={style.quadraticResultsFormulaCard}>
                        <MathDisplay equation={`\\mathbf{x₁ =\\frac{-(${value.b}) + \\sqrt{${results.delta}}}{${2 * value.a}}}`} />
                        <MathDisplay equation={`\\mathbf{x₂ =\\frac{-(${value.b}) - \\sqrt{${results.delta}}}{${2 * value.a}}}`} />
                      </div>
                      
                      {results.delta >= 0 ? (
                        // Resultado em forma simplificada (número)
                        <div>
                          <div className={style.quadraticResultsFormulaCard}>
                            <MathDisplay equation={`\\mathbf{x₁ =\\frac{${-value.b} + {${Math.sqrt(results.delta)}}}{${2 * value.a}}}`} />
                            <MathDisplay equation={`\\mathbf{x₂ =\\frac{${-value.b} - {${Math.sqrt(results.delta)}}}{${2 * value.a}}}`} />
                          </div>

                          <div className={style.quadraticResultsFormulaCard}>
                            <MathDisplay equation={`\\mathbf{x₁ =\\frac{${(-value.b + Math.sqrt(results.delta))}}{${2 * value.a}}}`} />
                            <MathDisplay equation={`\\mathbf{x₂ =\\frac{${(-value.b - Math.sqrt(results.delta))}}{${2 * value.a}}}`} />
                          </div>

                          <div className={style.quadraticResultsFormulaCard}>
                            <MathDisplay equation={`\\mathbf{x₁ = ${results.roots.root1}}`} />
                            <MathDisplay equation={`\\mathbf{x₂ = ${results.roots.root2}}`} />
                          </div>
                        </div>
                      ) :
                        // Resultado em forma simplificada (número complexo)
                        <div className={style.quadraticResultsFormulaCard}>
                          <MathDisplay equation={`\\mathbf{x₁ = ${-value.b/(2 * value.a)} + ${Math.sqrt(Math.abs(results.delta)) / (2 * value.a)}i}`} />
                          <MathDisplay equation={`\\mathbf{x₂ = ${-value.b/(2 * value.a)} - ${Math.sqrt(Math.abs(results.delta)) / (2 * value.a)}i}`} />
                        </div>
                      }

                        
                      
                  </div>
                </li>
                <li><strong>Interprete os resultados:</strong> Analise as raízes encontradas e interprete seu significado no contexto do problema.</li>
              </ol>
            </div>
            <p className={tStyle.textParagraph}>
              Seguindo esses passos, você poderá resolver qualquer equação do segundo grau e encontrar suas raízes.
            </p>
          </div>
        </Article>)}      
    
      <Article title="O que é uma Equação do Segundo Grau?">
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            Uma equação do segundo grau, também conhecida como equação quadrática, é uma equação polinomial de grau 
            dois que pode ser expressa na forma padrão:
          </p>

          <div className={tStyle.formulaCard}>
            <span>
              ax² + bx + c = 0
            </span>
          </div>

          <ul className={tStyle.symbolLegend}>
            <li><strong>a</strong>, <strong>b</strong> e <strong>c</strong> são coeficientes reais, 
              com <strong>a ≠ 0</strong>;
              </li>
            <li><strong>x</strong> representa a variável ou incógnita que queremos encontrar.</li>
          </ul>

          <p className={tStyle.textParagraph}>
            Perceba que o coeficiente <strong>a</strong> não pode ser zero, pois, caso contrário, a equação polinomial
            deixaria de ser do segundo grau e se tornaria uma equação do primeiro grau (linear). 
          </p>

          
        </div>
      </Article>

      <Article title="Como funciona as raízes de uma Equação do Segundo Grau?">
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            As raízes de uma equação do segundo grau são os valores de x que satisfazem a equação ax² + bx + c = 0.
          </p>

          <div className={tStyle.infoHighlight}>
            <p className={tStyle.textParagraph}>
              <strong>Exemplo rápido:</strong> Na equação x² - 5x + 6 = 0, as raízes são x₁ = 2 e x₂ = 3,
              pois substituindo esses valores na equação, obtemos 0.
            </p>
          </div>
        </div>
      </Article>

      <Article title="Passo a passo de como achar as raízes de uma Equação do Segundo Grau">
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            Resolver uma equação do segundo grau envolve encontrar os valores de x que satisfazem a equação na forma padrão 
            ax² + bx + c = 0. Aqui está um passo a passo para resolver esse tipo de equação:
          </p>
          <div className={tStyle.infoHighlight}>
            <ol className={tStyle.stepList}>
              <li><strong>Identifique os coeficientes:</strong> Na equação ax² + bx + c = 0, identifique os valores de a, b e c.</li>
              <li><strong>Calcule o delta (Δ):</strong> Use a fórmula Δ = b² - 4ac para calcular o valor do delta.</li>
              <li><strong>Determine o número de raízes:</strong>
                <ul className={tStyle.subStepList}>
                  <li>Se Δ {'>'} 0, a equação tem duas raízes reais e distintas.</li>
                  <li>Se Δ = 0, a equação tem uma raiz real dupla.</li>
                  <li>Se Δ {'<'} 0, a equação não tem raízes reais (as raízes são complexas).</li>
                </ul>
              </li>
              <li><strong>Calcule as raízes:</strong> Use a fórmula de Bhaskara para encontrar as raízes:
                <div className={style.quadraticFormulaCard}>
                  <span>
                    <MathDisplay equation={`\\mathbf{x =\\frac{-b ± \\sqrt{Δ}}{2a}}`} />
                  </span>
                </div>
              </li>
              <li><strong>Interprete os resultados:</strong> Analise as raízes encontradas e interprete seu significado no contexto do problema.</li>
            </ol>
          </div>
          <p className={tStyle.textParagraph}>
            Seguindo esses passos, você poderá resolver qualquer equação do segundo grau e encontrar suas raízes.
          </p>
        </div>
      </Article>

      <Article title="Como utilizar o resolvedor de Equações do Segundo Grau?">
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            Para utilizar o resolvedor de Equações do Segundo Grau, siga os passos abaixo:
          </p>

          <div className={tStyle.infoHighlight}>
            <ol className={tStyle.stepList}>
              <li>Informe qual o coeficiente <strong>a</strong> da equação.</li>
              <li>Informe qual o coeficiente <strong>b</strong> da equação. O coeficiente b é o responsável pelo termo linear.</li>
              <li>Informe qual o coeficiente <strong>c</strong> da equação. O coeficiente c é o termo constante.</li>
              <li>Clique no botão "Calcular" para ver os resultados.</li>
            </ol>
          </div>

          <p className={tStyle.textParagraph}>
            Após clicar no botão, a calculadora exibirá resultados da equação inserida, incluindo as raízes da equação, o gráfico e outras 
            informações relevantes. Além disso, serão apresentados gráficos que ilustram a forma da parábola representada pela equação do 
            segundo grau.
          </p>

          <h2 className={tStyle.sectionHeading}>Exemplo</h2>

          <div className={tStyle.exampleCard}>
            <p className={tStyle.textParagraph}>
              Suponha que você tenha a equação do segundo grau x² - 5x + 6 = 0.
            </p>
            <img
              src={quadraticEquationExample.src}
              alt="Exemplo de equação do segundo grau"
              className={style.imageAttribution}
            />
            <p className={tStyle.textParagraph}>
              Ao inserir esses valores no resolvedor e clicar em "Calcular Raízes", você obterá as raízes x₁ = 2 e x₂ = 3, e o delta (Δ) = 1. 
              Além disso, também será exibido o gráfico da parábola correspondente à equação.
            </p>
            <img
              src={quadraticEquationResultExample01.src}
              alt="Exemplo de resultado do cálculo da equação do segundo grau"
              className={style.imageAttribution}
            />
            <img
              src={quadraticEquationResultExample02.src}
              alt="Exemplo de resultado do cálculo da equação do segundo grau"
              className={style.imageAttribution}
            />
          </div>
        </div>
      </Article>

      <Article title="Gráfico de uma Equação do Segundo Grau">
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            O gráfico de uma equação do segundo grau é uma parábola, que pode abrir para cima ou para baixo dependendo do 
            valor do coeficiente 'a'. Se 'a' for positivo, a parábola abre para cima; se 'a' for negativo, a parábola abre 
            para baixo.
          </p>

          <p className={tStyle.textParagraph}>
            A parábola é simétrica em relação a uma linha vertical chamada de eixo de simetria, que passa pelo vértice da parábola.
            Isso significa que os pontos equidistantes do eixo de simetria têm o mesmo valor de y. 
          </p>

          <p className={tStyle.textParagraph}>
            Além disso, também é possível identificar pontos importantes no gráfico, como o vértice, que é o ponto mais alto 
            ou mais baixo da parábola. O vértice pode ser calculado usando as fórmulas:
          </p>
          
          <div className={tStyle.formulaCard}>
            <span>
              <MathDisplay equation={`\\mathbf{Vx =\\frac{-b}{2a}} \\qquad \\mathbf{Vy =\\frac{-\\Delta}{4a}}`} />
            </span>
          </div>

          <ul className={tStyle.symbolLegend}>
            <li><strong>a, b</strong> — coeficientes da equação do segundo grau.</li>
            <li><strong>Δ</strong> — delta da equação do segundo grau.</li>
          </ul>
        </div>
      </Article>

      <Article title="Fatoração de Equações do Segundo Grau">
        <p className={tStyle.textParagraph}>
          A fatoração de uma equação do segundo grau é um método utilizado para expressar a equação na forma de um produto de dois 
          binômios. A fatoração é da forma:
        </p>

        <div className={tStyle.formulaCard}>
          <span>
            ax² + bx + c = a(x - x₁)(x - x₂)
          </span>
        </div>

        <ul className={tStyle.symbolLegend}>
          <li><strong>a, b, c</strong> — coeficientes da equação do segundo grau.</li>
          <li><strong>x₁, x₂</strong> — raízes da equação do segundo grau.</li>
        </ul>

        <div className={tStyle.infoHighlight}>
          <p className={tStyle.textParagraph}>
            <strong>Exemplo rápido:</strong> A equação x² - 5x + 6 = 0, fatora-se como (x - 2)(x - 3) = 0.
            Veja que o produto (x - 2)(x - 3) resulta em 0 tanto se (x - 2) = 0 quanto se (x - 3) = 0,
            o que torna fácil de perceber que as raízes são x₁ = 2 e x₂ = 3.
          </p>
        </div>

        <div className={tStyle.infoHighlight}>
          <p className={tStyle.textParagraph}>
            <strong>Mais um exemplo rápido:</strong> Além de ser fácil achar as raízes na forma fatorada, também
            é possível acharmos a forma fatorada a partir das raízes. Por exemplo, se temos as raízes x₁ = 4 e x₂ = -1,
            podemos montar a forma fatorada como (x - 4)(x + 1) = 0. Por curiosidade, expandindo esse produto, obtemos a equação
            x² - 3x - 4 = 0.
          </p>
        </div>
        
        <p className={tStyle.textParagraph}>
          A fatoração é uma ferramenta útil para resolver equações do segundo grau, especialmente quando as raízes são 
          números racionais. Também é interessante notar que se as raízes forem complexas, a fatoração pode ser expressa
          em termos de números complexos. Além disso, se o delta (Δ) for 0, a fatoração resultará em um binômio ao quadrado.
        </p>
      </Article>

      <Article title="Equações do segundo grau na vida real">
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            As equações do segundo grau são amplamente utilizadas em diversas áreas da vida real, incluindo física, engenharia, 
            economia e biologia. Elas são particularmente úteis para modelar situações que envolvem movimento, crescimento e 
            otimização.
          </p>
        </div>

        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            Alguns exemplos práticos incluem: trajetórias de objetos em queda livre, cálculo de áreas máximas, análise de lucros e perdas,
            e modelagem de populações biológicas. As equações do segundo grau ajudam a descrever e prever comportamentos complexos 
            em sistemas naturais e artificiais.
          </p>
        </div>
      </Article>
    </div>
  );
}

export default quadratic_equation_calculator;