"use client";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";
import React from "react";
import Article from "@/components/Article";
import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("QuadraticEquationCalculator");

  const [chartData, setChartData] = React.useState([]);
  const [results, setResults] = React.useState(null);

  const [value, setValue] = React.useState({
    a: "",
    b: "",
    c: "",
  });

  const equationText = `${value.a}x² + ${value.b}x + ${value.c} = 0`;
  
  function handleChange(event) {
    var newValue = event.target.value;
    const inputName = event.target.name;

    if (newValue.length > 9) {
      alert(t("alertMaxCharacters"));
      return; // Limita o tamanho do input para 9 caracteres
    }

    if (inputName === "a" && newValue === "0") {
      alert(t("alertACannotBeZero"));
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
      alert(t("alertWrongValues"));
      return;
    }

    if (b === "" || c === "") { 
      alert(t("alertBCEmpty"));
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
      <h1 className={tStyle.mainTitle}>{t("mainTitle")}</h1>
      <div className={style.inputFieldsContainer}>
        <InputField 
          label={t("inputCoefficientA.label")}
          name="a"
          value={value.a}
          onChange={handleChange}
          type="number"
          placeholder={"0"}
          info={t("inputCoefficientA.info")}
        >
        </InputField>

        <InputField
          label={t("inputCoefficientB.label")}
          name="b"
          value={value.b}
          onChange={handleChange}
          type="number"
          placeholder={"0"}
          info={t("inputCoefficientB.info")}
        >
        </InputField>

        <InputField
          label={t("inputCoefficientC.label")}
          name="c"
          value={value.c}
          onChange={handleChange}
          placeholder={"0"}
          type="number"
          info={t("inputCoefficientC.info")}
        >
        </InputField>

        <div className={tStyle.interativeFormulaCard}>
          {t("equationBuilt")}

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
            label={t("result.buttonLabel")} 
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
            <h3 className={style.cardTitle}>{t("result.rootsTitle")}</h3>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.root1")}</span>
              <span className={style.resultValue}>{results.roots.root1}</span>
              <span className={style.quadraticFraction}>
                {results.roots.root1_fraction}
              </span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.root2")}</span>
              <span className={style.resultValue}>{results.roots.root2}</span>
              <span className={style.quadraticFraction}>
                {results.roots.root2_fraction}
              </span>
            </div>
            <div className={style.resultRow}>
              <span className={style.resultLabel}>{t("result.delta")}</span>
              <span className={style.resultValue}>{results.delta}</span>
            </div>
          </div>
          )}
        </div> 
      </div>

      {chartData.length > 0 && (
        <div className={style.chartSection}>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>{t("result.equationGraph")}</h3>
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
        <Article title={t("stepByStep.title")}>
          <div className={tStyle.textSection}>
            <div className={tStyle.infoHighlight}>
              <ol className={tStyle.stepList}>
                <li>
                  <strong>{t("stepByStep.step1")}</strong> {t("stepByStep.step1Content", { equation: equationText, a: value.a, b: value.b, c: value.c })}
                </li>
                <li>
                  <strong>{t("stepByStep.step2")}</strong> {t("stepByStep.step2Content")}
                  <div className={style.quadraticDeltaFormulaCard}>
                      <MathDisplay equation={`\\mathbf{\\Delta = (${value.b})^2 - 4 \\times (${value.a}) \\times (${value.c})}`} />
                      <MathDisplay equation={`\\mathbf{\\Delta = ${value.b ** 2} - ${4 * value.a * value.c}}`} />
                      <MathDisplay equation={`\\mathbf{\\Delta = ${results.delta}}`} />
                  </div>
                  </li>
                <li><strong>{t("stepByStep.step3")}</strong>
                  <ul className={tStyle.subStepList}>
                    {results.delta > 0 && (
                      <p>{t("stepByStep.deltaPositive")}</p>
                    )}
                    {results.delta === 0 && (
                      <li>{t("stepByStep.deltaZero")}</li>
                    )}
                    {results.delta < 0 && (
                      <li>{t("stepByStep.deltaNegative")}</li>
                    )}
                  </ul>
                </li>
                <li><strong>{t("stepByStep.step4")}</strong> {t("stepByStep.step4Content")}
                  <div className={style.quadraticFormulaCard}>
                      <MathDisplay equation={`\\mathbf{x =\\frac{-b ± \\sqrt{Δ}}{2a}}`} />
                      
                      {/* Resultado em forma de fração */}
                      <div className={style.quadraticResultsFormulaCard}>
                        <MathDisplay equation={`\\mathbf{x₁ =\\frac{-(${value.b}) + \\sqrt{${results.delta}}}{${2 * value.a}}}`} />
                        <MathDisplay equation={`\\mathbf{x₂ =\\frac{-(${value.b}) - \\sqrt{${results.delta}}}{${2 * value.a}}}`} />
                      </div>
                      
                      {results.delta >= 0 ? (
                        <div>
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
                <li><strong>{t("stepByStep.step5")}</strong> {t("stepByStep.step5Content")}</li>
              </ol>
            </div>
            <p className={tStyle.textParagraph}>
              {t("stepByStep.conclusion")}
            </p>
          </div>
        </Article>)}      
    
      <Article title={t("definitionSection.title")}>
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            {t("definitionSection.intro")}
          </p>

          <div className={tStyle.formulaCard}>
            <span>
              {t("definitionSection.formula")}
            </span>
          </div>

          <ul className={tStyle.symbolLegend}>
            <li>{t.rich("definitionSection.symbolAB", { strong: (children) => <strong>{children}</strong> })}</li>
            <li>{t.rich("definitionSection.symbolX", { strong: (children) => <strong>{children}</strong> })}</li>
          </ul>

          <p className={tStyle.textParagraph}>
            {t.rich("definitionSection.explanation", { strong: (children) => <strong>{children}</strong> })}
          </p>
        </div>
      </Article>

      <Article title={t("rootsSection.title")}>
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            {t("rootsSection.intro")}
          </p>

          <div className={tStyle.infoHighlight}>
            <p className={tStyle.textParagraph}>
              {t.rich("rootsSection.example", { strong: (children) => <strong>{children}</strong> })}
            </p>
          </div>
        </div>
      </Article>

      <Article title={t("resolutionGuide.title")}>
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            {t("resolutionGuide.intro")}
          </p>
          <div className={tStyle.infoHighlight}>
            <ol className={tStyle.stepList}>
              <li><strong>{t("stepByStep.step1")}</strong> {t("resolutionGuide.step1")}</li>
              <li><strong>{t("stepByStep.step2")}</strong> {t("resolutionGuide.step2")}</li>
              <li><strong>{t("stepByStep.step3")}</strong>
                <ul className={tStyle.subStepList}>
                  <li>{t("resolutionGuide.step3a")}</li>
                  <li>{t("resolutionGuide.step3b")}</li>
                  <li>{t("resolutionGuide.step3c")}</li>
                </ul>
              </li>
              <li><strong>{t("stepByStep.step4")}</strong> {t("resolutionGuide.step4")}
                <div className={style.quadraticFormulaCard}>
                  <span>
                    <MathDisplay equation={`\\mathbf{x =\\frac{-b ± \\sqrt{Δ}}{2a}}`} />
                  </span>
                </div>
              </li>
              <li><strong>{t("stepByStep.step5")}</strong> {t("resolutionGuide.step5")}</li>
            </ol>
          </div>
          <p className={tStyle.textParagraph}>
            {t("resolutionGuide.conclusion")}
          </p>
        </div>
      </Article>

      <Article title={t("usageTutorial.title")}>
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            {t("usageTutorial.intro")}
          </p>

          <div className={tStyle.infoHighlight}>
            <ol className={tStyle.stepList}>
              <li>{t.rich("usageTutorial.step1", { strong: (children) => <strong>{children}</strong> })}</li>
              <li>{t.rich("usageTutorial.step2", { strong: (children) => <strong>{children}</strong> })}</li>
              <li>{t.rich("usageTutorial.step3", { strong: (children) => <strong>{children}</strong> })}</li>
              <li>{t.rich("usageTutorial.step4", { strong: (children) => <strong>{children}</strong> })}</li>
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
              src={quadraticEquationExample.src}
              alt={t("exampleCalculation.imageAlt1")}
              className={style.imageAttribution}
            />
            <p className={tStyle.textParagraph}>
              {t("exampleCalculation.description")}
            </p>
            <img
              src={quadraticEquationResultExample01.src}
              alt={t("exampleCalculation.imageAlt2")}
              className={style.imageAttribution}
            />
            <img
              src={quadraticEquationResultExample02.src}
              alt={t("exampleCalculation.imageAlt2")}
              className={style.imageAttribution}
            />
          </div>
        </div>
      </Article>

      <Article title={t("graphSection.title")}>
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            {t("graphSection.intro")}
          </p>

          <p className={tStyle.textParagraph}>
            {t("graphSection.symmetry")}
          </p>

          <p className={tStyle.textParagraph}>
            {t("graphSection.vertex")}
          </p>
          
          <div className={tStyle.formulaCard}>
            <span>
              <MathDisplay equation={`\\mathbf{Vx =\\frac{-b}{2a}} \\qquad \\mathbf{Vy =\\frac{-\\Delta}{4a}}`} />
            </span>
          </div>

          <ul className={tStyle.symbolLegend}>
            <li>{t.rich("graphSection.symbolAB", { strong: (children) => <strong>{children}</strong> })}</li>
            <li>{t.rich("graphSection.symbolDelta", { strong: (children) => <strong>{children}</strong> })}</li>
          </ul>
        </div>
      </Article>

      <Article title={t("factorization.title")}>
        <p className={tStyle.textParagraph}>
          {t("factorization.intro")}
        </p>

        <div className={tStyle.formulaCard}>
          <span>
            {t("factorization.formula")}
          </span>
        </div>

        <ul className={tStyle.symbolLegend}>
          <li>{t.rich("factorization.symbolABC", { strong: (children) => <strong>{children}</strong> })}</li>
          <li>{t.rich("factorization.symbolRoots", { strong: (children) => <strong>{children}</strong> })}</li>
        </ul>

        <div className={tStyle.infoHighlight}>
          <p className={tStyle.textParagraph}>
            {t.rich("factorization.example01", { strong: (children) => <strong>{children}</strong> })}
          </p>
        </div>

        <div className={tStyle.infoHighlight}>
          <p className={tStyle.textParagraph}>
            {t.rich("factorization.example02", { strong: (children) => <strong>{children}</strong> })}
          </p>
        </div>
        
        <p className={tStyle.textParagraph}>
          {t("factorization.conclusion")}
        </p>
      </Article>

      <Article title={t("realWorld.title")}>
        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            {t("realWorld.intro")}
          </p>
        </div>

        <div className={tStyle.textSection}>
          <p className={tStyle.textParagraph}>
            {t("realWorld.examples")}
          </p>
        </div>
      </Article>
    </div>
  );
}

export default quadratic_equation_calculator;