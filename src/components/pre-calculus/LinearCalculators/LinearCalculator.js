"use client";
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ReferenceLine, ReferenceDot } from 'recharts';
import JsonLd from '@/components/JsonLd';
import InputField from '@/components/ui/InputField/InputField';
import ReactiveButton from '@/components/ui/ReactiveButton/ReactiveButton';
import GenericChart from '@/components/GenericChart/GenericChart';
import { MathDisplayEquation } from '@/components/MathDisplay';
import ArticleLayoutDefault from '@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault';
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import StepsList from '@/components/text/StepsList/StepsList';
import text from '@/components/text/TextGenericDesigns.module.css';
import style from '@/app/[locale]/quadratic-equation-calculator/page.module.css';
import local from './LinearCalculators.module.css';
import { solveFunction, solveSystem, graphModel, functionChartData, tex, paren, expression, equation, numericText, num } from '@/utils/precalculus/linear';

export default function LinearCalculator({ system = false }) {
    const locale = useLocale();
    const t = useTranslations(system ? 'LinearSystemCalculator' : 'LinearFunctionCalculator');
    const keys = system ? ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'] : ['a', 'b'];
    const [values, setValues] = useState(Object.fromEntries(keys.map(key => [key, ''])));
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const v = value => tex(value, locale);
    const p = value => paren(value, locale);
    function calculate(event) {
        event.preventDefault();
        try {
            setResult(system ? solveSystem(values) : solveFunction(values));
            setError(null);
        } catch (issue) {
            setResult(null);
            setError(['invalidValue', 'numericLimit', 'unstable'].includes(issue.message) ? issue.message : 'numericLimit');
        }
    }
    let preview = system ? ['a_1x+b_1y=c_1', 'a_2x+b_2y=c_2'] : ['f(x)=ax+b'];
    try {
        const current = system ? solveSystem(values) : solveFunction(values);
        preview = system ? current.rows.map(row => equation(row, locale)) : [`f(x)=${expression([current.a, current.b], ['x', ''], locale)}`];
    } catch { /* Never turn a blank or invalid coefficient into zero. */ }
    const graph = result ? graphModel(result, !system) : null;
    const formulas = equations => <div className={local.scroll}>{equations.map((equation, index) => <MathDisplayEquation key={index} equation={equation} />)}</div>;
    const step = (key, equations = []) => ({ content: <><strong>{t(`steps.${key}`)}</strong>{equations.length > 0 && formulas(equations)}</> });
    let steps = [];
    if (result && !system) {
        steps = [step('identify', [`f(x)=${expression([result.a, result.b], ['x', ''], locale)}`]), step('intercept', [`f(0)=${v(result.b)}`])];
        if (result.root) steps.push(step('root', [`${v(result.a)}x=${v({ ...result.b, n: -result.b.n })}`, `x=\\frac{-${p(result.b)}}{${v(result.a)}}=${v(result.root)}`]));
        else steps.push(step(result.kind));
        steps.push(step('behavior'), step('graph'));
    }
    if (result && system) {
        steps = [step('identify', result.rows.map(row => equation(row, locale)))];
        if (result.kind === 'unique') {
            if (result.swapped) steps.push(step('swap', ['E_1 \\leftrightarrow E_2']));
            steps.push(step('eliminate', [`E_2 \\leftarrow E_2-${p(result.factor)}E_1`, equation(result.eliminated, locale)]));
            steps.push(step('solveY', [`y=\\frac{${v(result.eliminated[2])}}{${v(result.eliminated[1])}}=${v(result.y)}`]));
            steps.push(step('solveX', [`x=\\frac{${v(result.first[2])}-${p(result.first[1])}\\times${p(result.y)}}{${v(result.first[0])}}=${v(result.x)}`]));
            steps.push(step('verify', result.rows.map(row => `${p(row[0])}\\times${p(result.x)}+${p(row[1])}\\times${p(result.y)}=${v(row[2])}`)));
        } else {
            if (result.eliminated) steps.push(step('eliminate', [`E_2 \\leftarrow E_2-${p(result.factor)}E_1`, equation(result.eliminated, locale)]));
            steps.push(step(result.reason), step('set', [result.kind === 'plane' ? 'S=\\mathbb{R}^2' : result.kind === 'none' ? 'S=\\varnothing' : `S=\\{(x,y)\\in\\mathbb{R}^2:${equation(result.line, locale)}\\}`]));
        }
    }
    return <div className={local.scope}>
        <JsonLd dataName={system ? 'linearSystemCalculator' : 'linearFunctionCalculator'} />
        <h1 className={text.pagesMainTitle}>{t('mainTitle')}</h1>
        <form className={style.inputFieldsContainer} onSubmit={calculate} noValidate>
            {keys.map(key => <InputField key={key} name={key} label={t('coefficient', { name: key })}
                value={values[key]} type="text" inputMode="decimal" placeholder="0" maxLength={41}
                info={t('coefficientInfo', { name: key })}
                onChange={event => { setValues(previous => ({ ...previous, [key]: event.target.value })); setResult(null); setError(null); }} />)}
            <div className={`${style.interativeFormulaCard} ${local.preview}`}>
                <span>{t('equationBuilt')}</span>
                <div className={local.previewEquations}>{preview.map((equation, index) => <MathDisplayEquation key={index} equation={equation} />)}</div>
            </div>
            <div className={style.buttonContainer}><ReactiveButton label={t('calculate')} onClick={calculate} /></div>
            <p className={local.note}>{t('inputNote')}</p>
            {error && <p role="alert">{t(`errors.${error}`)}</p>}
        </form>
        <div aria-live="polite" aria-atomic="true">
        {result && <div className={style.resultContainer}><div className={style.resultsCard}>
            <h3 className={style.cardTitle}>{t('resultTitle')}</h3>
            <div className={`${style.resultRow} ${local.row}`}><span className={style.resultLabel}>{t('classification')}</span><span className={style.resultValue}>{t(`kinds.${result.kind}`)}</span></div>
            {!system && <>
                <div className={`${style.resultRow} ${local.row}`}><span className={style.resultLabel}>{t('root')}</span><span className={style.resultValue}>{result.root ? formulas([`x=${v(result.root)}`]) : t(result.kind === 'null' ? 'allRoots' : 'noRoot')}</span></div>
                <div className={`${style.resultRow} ${local.row}`}><span className={style.resultLabel}>{t('intercept')}</span><span className={style.resultValue}>{formulas([`(0,${v(result.b)})`])}</span></div>
                <p className={local.note}>{t('degreeNote')}</p>
            </>}
            {system && formulas([result.kind === 'unique' ? `S=\\{(${v(result.x)},${v(result.y)})\\}` : result.kind === 'plane' ? 'S=\\mathbb{R}^2' : result.kind === 'none' ? 'S=\\varnothing' : `S=\\{(x,y)\\in\\mathbb{R}^2:${equation(result.line, locale)}\\}`])}
            <p className={local.note}>{t('precisionNote')}</p>
            {result.root && formulas([`x\\approx ${v(num(result.root))}`])}
            {system && result.kind === 'unique' && formulas([`x\\approx ${v(num(result.x))},\\quad y\\approx ${v(num(result.y))}`])}
            {system && result.residuals && <p className={local.note}>{t('residualNote', { value: numericText(Math.max(...result.residuals.map(r => r.floating)), locale) })}</p>}
        </div></div>}
        </div>
        {graph && <div className={style.chartSection}><div className={style.chartWrapper}>
            <h3 className={style.cardTitle}>{t('graphTitle')}</h3>
            <div className={local.legend}>{graph.segments.map((segment, i) => <span key={i} style={{ color: i ? '#f59e0b' : '#00b947' }}>{t(system ? 'equationLabel' : 'functionLabel', { number: i + 1 })}: {segment.length ? t('visibleLine') : t('noVisibleLine')}</span>)}</div>
            <GenericChart chartType="line" referenceOnly={system} clipDomain
                data={system ? [{ x: -graph.extent, y: -graph.extent }, { x: graph.extent, y: graph.extent }] : functionChartData(result, graph)}
                xDomain={[-graph.extent, graph.extent]} yDomain={[-graph.extent, graph.extent]}
                numberFormatter={value => numericText(value, locale)}>
                {system && graph.segments.map((segment, i) => segment.length ? <ReferenceLine key={i} segment={segment} stroke={i ? '#f59e0b' : '#00b947'} strokeWidth={3} strokeDasharray={i ? '6 4' : undefined} /> : null)}
                {graph.point && <ReferenceDot x={graph.point[0]} y={graph.point[1]} r={6} fill="red" stroke="white" />}
            </GenericChart>
            <p className={local.note}>{t('graphNote')}</p>
            {(graph.outside || graph.clipped) && <p role="status">{t('graphLimited')}</p>}
            {system && result.kind !== 'unique' && <p className={local.note}>{t(`graphCases.${result.kind}`)}</p>}
        </div></div>}
        {result && <ArticleLayoutDefault title={t('stepsTitle')}><HighlightSection><StepsList steps={steps} /></HighlightSection></ArticleLayoutDefault>}
    </div>;
}
