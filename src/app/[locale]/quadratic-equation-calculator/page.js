"use client";
import JsonLd from "@/components/JsonLd";
import { useParams } from "next/navigation";

import ReactiveButton from "@/components/ReactiveButton";
import style from "./page.module.css";
import tStyle from "@/components/GenericTextDesign.module.css";
import React from "react";

import InputField from "@/components/InputField";
import GenericChart from "@/components/GenericChart";
import { useTranslations } from "next-intl";

// Images
import quadraticEquationExamplePt from "@/assets/precalculus/quadratic_equation/example_pt.png";
import quadraticEquationResultExample01Pt from "@/assets/precalculus/quadratic_equation/result_example01_pt.png";
import quadraticEquationResultExample02Pt from "@/assets/precalculus/quadratic_equation/result_example02_pt.png";

import quadraticEquationExampleEn from "@/assets/precalculus/quadratic_equation/example_en.png";
import quadraticEquationResultExample01En from "@/assets/precalculus/quadratic_equation/result_example01_en.png";
import quadraticEquationResultExample02En from "@/assets/precalculus/quadratic_equation/result_example02_en.png";

// Styles
import FAQ from "@/components/TextComponents/FAQ";
import HighlightSection from '@/components/TextComponents/HighlightSection';
import ParagraphSection from '@/components/TextComponents/ParagraphSection';
import StepsList from '@/components/TextComponents/StepsList';
import ExampleSection from "@/components/TextComponents/ExampleSection";
import SymbolLegend from '@/components/TextComponents/SymbolLegend';
import FormulaCard from '@/components/TextComponents/FormulaCard';
import ArticleLayoutDefault from "@/components/TextComponents/ArticleLayouts/ArticleLayoutDefault";
import TextGenericDesigns from '@/components/TextComponents/TextGenericDesigns.module.css';

import { useIsMobile } from "@/context/ViewportContext";

import { ReferenceDot } from "recharts";

import { MathDisplayEquation, FractionDisplay } from '@/components/MathDisplay';

function generateChartData(a, b, c, root1 = null, root2 = null, delta, rangeSize = 6) {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  const numC = parseFloat(c);

  if (isNaN(numA) || isNaN(numB) || isNaN(numC)) return [];

  const history = [];

  // 1. O Vértice é o centro absoluto da simetria da parábola
  const vx = numA !== 0 ? -numB / (2 * numA) : 0;
  
  // 2. Definir um "distanciamento" (offset) simétrico
  let offset = 5; // Valor padrão de visualização

  if (root1 !== null && root2 !== null) {
    // Calcula a distância do vértice até a raiz mais distante
    const dist1 = Math.abs(vx - root1);
    const dist2 = Math.abs(vx - root2);
    // O offset será a maior distância + uma margem de respiro (ex: 3)
    offset = Math.max(dist1, dist2) + 3;
  }

  // Limitar o offset para evitar processamento excessivo, mas manter simetria
  offset = Math.min(Math.max(offset, 5), 50);

  // 3. O intervalo é RIGOROSAMENTE simétrico em relação a vx
  const start = vx - offset;
  const end = vx + offset;
  
  // Ajustamos o step dinamicamente para manter a performance em ranges grandes
  const step = offset > 20 ? 0.5 : 0.1;

  for (let x = start; x <= end; x += step) {
    const y = numA * (x ** 2) + numB * x + numC;
    history.push({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2))
    });
  }

  // Adicionar raízes para garantir precisão visual nos pontos zero
  if (root1 !== null) history.push({ x: Number(root1.toFixed(4)), y: 0 });
  if (root2 !== null) history.push({ x: Number(root2.toFixed(4)), y: 0 });

  history.sort((a, b) => a.x - b.x);

  return history;
}

function quadratic_equation_calculator() {
  const { locale } = useParams();

  const t = useTranslations("QuadraticEquationCalculator");

  const [chartData, setChartData] = React.useState([]);
  const [results, setResults] = React.useState(null);

  const isMobile = useIsMobile();

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
  
  function fixNum(num) {
    const decimals = num.toString().split(".")[1]; 
    if (decimals && decimals.length > 4) {
      return num.toFixed(4) + "...";
    }
    return num;
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
      root1_raw: null, // Adicionado para cálculos do gráfico
      root2_raw: null, // Adicionado para cálculos do gráfico
    };

    if (delta < 0) {
      const sqrtDelta = Math.sqrt(Math.abs(delta));
      // Frações na forma: (-b ± √(-Δ) i) / 2a
      if (numB < 0) {
        roots.root1_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-(${fixNum(numB)}) + \\sqrt{${fixNum(-delta)}}\\,i}{${fixNum(2 * numA)}}}`} />;
        roots.root2_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-(${fixNum(numB)}) - \\sqrt{${fixNum(-delta)}}\\,i}{${fixNum(2 * numA)}}}`} />;
      } else {
        roots.root1_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-${fixNum(numB)} + \\sqrt{${fixNum(-delta)}}\\,i}{${fixNum(2 * numA)}}}`} />;
        roots.root2_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-${fixNum(numB)} - \\sqrt{${fixNum(-delta)}}\\,i}{${fixNum(2 * numA)}}}`} />;
      }

      const realPart = fixNum(-numB / (2 * numA));
      const imaginaryPart = fixNum(sqrtDelta / (2 * numA));

      // Forma simplificada: x = real ± imag i
      roots.root1 = <MathDisplayEquation equation={`\\mathbf{${realPart} + ${imaginaryPart}i}`} />;
      roots.root2 = <MathDisplayEquation equation={`\\mathbf{${realPart} - ${imaginaryPart}i}`} />; 

      setChartData(generateChartData(numA, numB, numC, null, null, delta));
    }

    if (delta >= 0) {
      const sqrtDelta = Math.sqrt(delta);
      // Coloca parenteses apenas se b for menor que 0
      if (numB < 0) {
        roots.root1_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-(${fixNum(numB)}) + \\sqrt{${fixNum(delta)}}}{${fixNum(2 * numA)}}}`} />;
        roots.root2_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-(${fixNum(numB)}) - \\sqrt{${fixNum(delta)}}}{${fixNum(2 * numA)}}}`} />;
      } else {
        roots.root1_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-${fixNum(numB)} + \\sqrt{${fixNum(delta)}}}{${fixNum(2 * numA)}}}`} />;
        roots.root2_fraction = <MathDisplayEquation equation={`\\mathbf{\\frac{-${fixNum(numB)} - \\sqrt{${fixNum(delta)}}}{${fixNum(2 * numA)}}}`} />;
      }

      // Calcula os valores reais crus
      const rawRoot1 = (-numB + sqrtDelta) / (2 * numA);
      const rawRoot2 = (-numB - sqrtDelta) / (2 * numA);

      // Salva os valores formatados para exibição
      roots.root1 = fixNum(rawRoot1);
      roots.root2 = fixNum(rawRoot2);  
      
      // Salva os valores crus para o gráfico e para o ReferenceDot
      roots.root1_raw = rawRoot1;
      roots.root2_raw = rawRoot2;

      setChartData(generateChartData(numA, numB, numC, rawRoot1, rawRoot2, delta));
    }

    setResults({
      roots: roots,
      delta: delta
    });

    return roots;
  } 

  return (
    <div>
      <JsonLd dataName="quadraticEquationCalculator" locale={locale} />
      <h1 className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</h1>
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

        <div className={style.interativeFormulaCard}>
          {t("equationBuilt")}

          <p style={{ fontSize: '1.5rem', fontFamily: 'serif' }}>
  
            {(Number(value.a) !== 0 || value.a === "") && (
              <>
                {value.a < 0 ? " - " : " "}
                
                <span style={{color: '#00b947'}}>
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
                
                <span style={{color: '#00b947'}}>
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
                
                <span style={{color: '#00b947'}}>
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
      </div>
      
      {/* Seção de resultados */}
      {results && (
        <div className={style.resultContainer}>
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
        </div>
      )}

      {chartData.length > 0 && (
        <div className={style.chartSection}>
          <div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>{t("result.equationGraph")}</h3>
            <GenericChart 
              chartType="line"
              data={chartData}
            >
              {/* Raiz 1 - Usando os valores RAW */}
              {results?.roots?.root1_raw !== null && results?.delta >= 0 && (
                <ReferenceDot 
                  x={Number(results.roots.root1_raw.toFixed(4))} 
                  y={0} 
                  r={6} 
                  fill="red" 
                  stroke="white" 
                  strokeWidth={2}
                  label={{ position: 'top', value: 'x1', fill: 'red', fontSize: 12 }} 
                />
              )}
              {/* Raiz 2 - Usando os valores RAW */}
              {results?.roots?.root2_raw !== null && results?.delta >= 0 && (
                <ReferenceDot 
                  x={Number(results.roots.root2_raw.toFixed(4))} 
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

      {/* Seção do passo a paso */}
      {results && (
        <ArticleLayoutDefault title={t("stepByStep.title")}>
            <HighlightSection>
              <StepsList steps={[
                {
                  content: <div><strong>{t("stepByStep.step1")}</strong> {t("stepByStep.step1Content", { equation: equationText, a: value.a, b: value.b, c: value.c })}</div>
                },
                {
                  content: <div>
                              <strong>{t("stepByStep.step2")}</strong> {t("stepByStep.step2Content")}
                              <div className={style.quadraticRowFormulaCard}>
                                  {!isMobile && (
                                  <MathDisplayEquation equation={`\\mathbf{\\Delta = (${value.b})^2 - 4 \\times (${value.a}) \\times (${value.c})}`} />
                                  )}
                                  <MathDisplayEquation equation={`\\mathbf{\\Delta = ${value.b ** 2} - ${4 * value.a * value.c}}`} /> 
                                  <MathDisplayEquation equation={`\\mathbf{\\Delta = ${results.delta}}`} />
                              </div>
                  </div>
                },
                {
                  content: <div>
                              <strong>{t("stepByStep.step3")}</strong>
                              {results.delta > 0 && (
                                t("stepByStep.deltaPositive")
                              )}
                              {results.delta === 0 && (
                                t("stepByStep.deltaZero")
                              )}
                              {results.delta < 0 && (
                                t("stepByStep.deltaNegative")
                              )}
                  </div>
                },
                {
                  content: <div>
                            <strong>{t("stepByStep.step4")}</strong> {t("stepByStep.step4Content")}
                            <div className={style.quadraticFormulaCard}>
                              <div className={style.quadraticRowFormulaCard}>
                                <MathDisplayEquation equation={`\\mathbf{x =\\frac{-b ± \\sqrt{Δ}}{2a}}`} />
                              </div>

                              {/* Resultado em forma de fração */}
                              <div className={style.quadraticResultsFormulaCard}>
                                <MathDisplayEquation equation={`\\mathbf{\\therefore \\quad  x₁ =\\frac{-(${value.b}) + \\sqrt{${results.delta}}}{${2 * value.a}}}`} />
                                <MathDisplayEquation equation={`\\mathbf{x₂ =\\frac{-(${value.b}) - \\sqrt{${results.delta}}}{${2 * value.a}}}`} />
                              </div>
                                
                              {results.delta >= 0 ? (
                                <div>
                                  <div className={style.quadraticResultsFormulaCard}>
                                    <MathDisplayEquation equation={`\\mathbf{\\therefore \\quad x₁ =\\frac{${(-value.b + Math.sqrt(results.delta))}}{${2 * value.a}}}`} />
                                    <MathDisplayEquation equation={`\\mathbf{x₂ =\\frac{${(-value.b - Math.sqrt(results.delta))}}{${2 * value.a}}}`} />
                                  </div>

                                  <div className={style.quadraticResultsFormulaCard}>
                                    <MathDisplayEquation equation={`\\mathbf{\\therefore \\quad x₁ = ${results.roots.root1}}`} />
                                    <MathDisplayEquation equation={`\\mathbf{x₂ = ${results.roots.root2}}`} />
                                  </div>
                                </div>
                              ) :
                                // Resultado em forma simplificada (número complexo)
                                <div className={style.quadraticResultsFormulaCard}>
                                  <MathDisplayEquation equation={`\\mathbf{\\therefore \\quad x₁ = ${fixNum(-value.b / (2 * value.a))} + ${fixNum(Math.sqrt(Math.abs(results.delta)) / (2 * value.a))}i }`} />
                                  <MathDisplayEquation equation={`\\mathbf{x₂ = ${fixNum(-value.b / (2 * value.a))} - ${fixNum(Math.sqrt(Math.abs(results.delta)) / (2 * value.a))}i}`} />
                                </div>
                              }
                            </div>
                  </div>
                },
                {
                  content: <div><strong>{t("stepByStep.step5")}</strong> {t("stepByStep.step5Content")}</div>
                }
              ]}/>
            </HighlightSection>
            
            <ParagraphSection paragraphs={[
              t("stepByStep.conclusion")
            ]}/>
      </ArticleLayoutDefault>)}      
    
      <ArticleLayoutDefault title={t("definitionSection.title")}>
        <ParagraphSection paragraphs={[
          t("definitionSection.intro")
        ]}/>

        <FormulaCard equations={[t("definitionSection.formula")]} />

        <SymbolLegend symbols={{
          "a, b, c": t.rich("definitionSection.symbolAB", { strong: (children) => <strong>{children}</strong> }),
          "x": t.rich("definitionSection.symbolX", { strong: (children) => <strong>{children}</strong> })
        }}/>

        <ParagraphSection paragraphs={[
          t.rich("definitionSection.explanation", { strong: (children) => <strong>{children}</strong> })
        ]}/>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("rootsSection.title")}>
        <ParagraphSection paragraphs={[
            t("rootsSection.intro")
        ]}/>

        <HighlightSection>
          <ParagraphSection paragraphs={[
            t.rich("rootsSection.example", { strong: (children) => <strong>{children}</strong> })
          ]}/>
        </HighlightSection>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("resolutionGuide.title")}>
          <ParagraphSection paragraphs={[
            t("resolutionGuide.intro")
          ]}/>

          <HighlightSection>
            <StepsList
              steps={[
                {
                  content: t.rich("resolutionGuide.step1"),
                },
                {
                  content: t.rich("stepByStep.step2", {
                    strong: (c) => <strong>{c}</strong>,
                  }),
                },
                {
                  content: t.rich("stepByStep.step3", {
                    strong: (c) => <strong>{c}</strong>,
                  }),
                  subSteps: [
                    t("resolutionGuide.step3a"),
                    t("resolutionGuide.step3b"),
                    t("resolutionGuide.step3c"),
                  ],
                },
                {
                  content: t.rich("stepByStep.step4", {
                    strong: (c) => <strong>{c}</strong>,
                  }),
                  equations: [
                    `\\mathbf{x =\\frac{-b ± \\sqrt{Δ}}{2a}}`,
                  ],
                },
              ]}/>
        </HighlightSection>

          <ParagraphSection paragraphs={[
            t("resolutionGuide.conclusion")
          ]}/>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("usageTutorial.title")}>
        <div className={tStyle.textSection}>
          <ParagraphSection paragraphs={[
            t("usageTutorial.intro")
          ]}/>

          <HighlightSection>
            <StepsList steps={[
              {
                content: t.rich("usageTutorial.step1", { strong: (children) => <strong>{children}</strong> }),
              },
              {
                content: t.rich("usageTutorial.step2", { strong: (children) => <strong>{children}</strong> }),
              },
              {
                content: t.rich("usageTutorial.step3", { strong: (children) => <strong>{children}</strong> }),
              },
              {
                content: t.rich("usageTutorial.step4", { strong: (children) => <strong>{children}</strong> }),
              }
            ]}/>
          </HighlightSection>

          <ParagraphSection paragraphs={[
            t("usageTutorial.conclusion")
          ]}/>
          
          {/* Seção com imagens */}
          <ExampleSection title={t("exampleCalculation.title")}>
            <ParagraphSection paragraphs={[
              t("exampleCalculation.scenario")
            ]}/>
            <img
              src={locale === "pt" ? quadraticEquationExamplePt.src : quadraticEquationExampleEn.src}
              alt={t("exampleCalculation.imageAlt1")}
              className={style.imageAttribution}
            />
            <ParagraphSection paragraphs={[
              t("exampleCalculation.description")
            ]}/>
            <img
              src={locale === "pt" ? quadraticEquationResultExample01Pt.src : quadraticEquationResultExample01En.src}
              alt={t("exampleCalculation.imageAlt2")}
              className={style.imageAttribution}
            />
            <img
              src={locale === "pt" ? quadraticEquationResultExample02Pt.src : quadraticEquationResultExample02En.src}
              alt={t("exampleCalculation.imageAlt2")}
              className={style.imageAttribution}
            />
          </ExampleSection>
        </div>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("graphSection.title")}>
        <ParagraphSection paragraphs={[
          t("graphSection.intro"),
          t("graphSection.symmetry"),
          t("graphSection.vertex")
        ]}/>

        <FormulaCard equations={[`\\mathbf{Vx =\\frac{-b}{2a}}`, `\\mathbf{Vy =\\frac{-\\Delta}{4a}}`]} />

        <SymbolLegend 
          symbols={{
            "a, b, c": t.rich("graphSection.symbolAB", { strong: (children) => <strong>{children}</strong> }),
            "Δ": t.rich("graphSection.symbolDelta", { strong: (children) => <strong>{children}</strong> })
          }}
        />
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("factorization.title")}>
        <ParagraphSection paragraphs={[
          t("factorization.intro")
        ]}/>
        
        <FormulaCard equations={[`\\mathbf{${t("factorization.formula")}}`]} />

        <SymbolLegend 
          symbols={{
            "a, b, c": t.rich("factorization.symbolABC", { strong: (children) => <strong>{children}</strong> }),
            "x₁, x₂": t.rich("factorization.symbolRoots", { strong: (children) => <strong>{children}</strong> })
          }}
        />

        <HighlightSection>
          <ParagraphSection paragraphs={[
            t.rich("factorization.example01", { strong: (children) => <strong>{children}</strong> })
          ]}/>
        </HighlightSection>

        <HighlightSection>
          <ParagraphSection paragraphs={[
            t.rich("factorization.example02", { strong: (children) => <strong>{children}</strong> })
          ]}/>
        </HighlightSection>
        
        <ParagraphSection paragraphs={[
          t("factorization.conclusion")
        ]}/>
      </ArticleLayoutDefault>

      <ArticleLayoutDefault title={t("realWorld.title")}>
        <ParagraphSection paragraphs={[
          t("realWorld.intro"),
          t("realWorld.examples")
        ]}/>
      </ArticleLayoutDefault>

      <FAQ questions={t.raw("faqSection").map((_, index) => ({
        question: t(`faqSection.${index}.question`),
        answer: t(`faqSection.${index}.answer`),
      }))} />
    </div>
  );
}

export default quadratic_equation_calculator;