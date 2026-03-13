"use client"
import { sortCodes } from '@/../constants/algorithmCodes';
import { useLocale } from 'next-intl';

import { useTranslations } from 'next-intl';
import InputField from '@/components/InputField';
import ReactiveButton from '@/components/ReactiveButton';
import { useEffect, useState, useRef } from 'react'; 
import SortSelection from '../SortSelection';

import { bubbleSort, bubbleSortOtimized, insertionSort, selectionSort } from '@/utils/sortAlgorithms'; 

import style from './SortAlgorithms.module.css';
import { motion } from 'framer-motion';
import CodeViewer from '../../CodeViewer';

import ArticleLayoutSplit from '../../TextComponents/ArticleLayouts/ArticleLayoutSplit';
import HighlightSection from '../../TextComponents/HighlightSection';
import ParagraphSection from '../../TextComponents/ParagraphSection';

// Transforma a string de entrada em um array de objetos com IDs únicos
function getNumbersFromInput(input) {
    return input
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num))
        .map(num => ({ id: crypto.randomUUID(), value: num })); 
}

const DEFAULT_INPUT = "5, -3, 8, 2, -2, 2"; 
const DEFAULT_ARRAY = getNumbersFromInput(DEFAULT_INPUT);

const ALGORITHMS_MAP = {
    "bubble": bubbleSort,
    "insertion": insertionSort,
    "selection": selectionSort
};


export default function SortAlgorithms({ type = "bubble" }) {
    const locale = useLocale(); // Retorna 'pt', 'en', etc.

    const CODES_MAP = {
        "bubble": sortCodes.bubbleSort[locale] || sortCodes.bubbleSort.en,
        "bubbleOptimized": sortCodes.bubbleSortOptimized[locale] || sortCodes.bubbleSortOptimized.en,
        "insertion": sortCodes.insertionSort[locale] || sortCodes.insertionSort.en,
        "selection": sortCodes.selectionSort[locale] || sortCodes.selectionSort.en
    };

    const [bubbleVariant, setBubbleVariant] = useState("bubble"); // Só é utlizado para o type bubble

    const t = useTranslations("sortAlgorithmsComponent");
    const tUi = useTranslations("sortAlgorithmsComponent.ui");
    const tSteps = useTranslations("sortAlgorithmsSteps");

    const tCode = (key, components) => {
        let baseKey;
        if (type === "bubble") {
            baseKey = bubbleVariant === "bubble" ? `bubbleSort.${key}` : `bubbleSortOtimized.${key}`;
        } else {
            baseKey = `${type}.${key}`;
        }

        if (components) {
            return t.rich(baseKey, components);
        }

        return t(baseKey);
    };

    const [userInput, setUserInput] = useState(DEFAULT_ARRAY); 
    const [inputValue, setInputValue] = useState(DEFAULT_INPUT);

    // O estado inicial agora usa a estrutura blindada de objetos com os mesmos valores do input padrão
    const [arrayState, setArrayState] = useState(DEFAULT_ARRAY); 
    
    const [activeMotion, setActiveMotion] = useState(false);
    const [activeIndices, setActiveIndices] = useState([]); 
    const [canInsert, setCanInsert] = useState(true); 

    const [errorMsg, setErrorMsg] = useState(""); 
    const [infoMsg, setInfoMsg] = useState(""); 

    // Linhas de código ativas no CodeViewer para o passo atual
    const [activeCodeLines, setActiveCodeLines] = useState([]);

    const [animSpeed, setAnimSpeed] = useState(1);

    const isPlayingRef = useRef(false);
    
    // sortSteps será uma array de dicionários do tipo { array: [...], activeIndices: [...], infoMsg: [...] }, representando cada passo do algoritmo.
    const [stepsAmount, setStepsAmount] = useState(0); // Quantidade total de passos 
    const [stepsCounter, setStepsCounter] = useState(0); // Contador para acompanhar o passo atual da animação
    const sortStepsRef = useRef([]);

    const speedRef = useRef(350); // Valor inicial de 350ms

    useEffect(() => {
        applyAlgorithmWithVariant(DEFAULT_ARRAY, { type, variant: bubbleVariant });

        if (sortStepsRef.current.length > 0) {
            const firstStep = sortStepsRef.current[0];
            setArrayState(firstStep.array);
            setActiveIndices(firstStep.activeIndices || []);
            setInfoMsg(firstStep.infoMsg || "");
            setActiveCodeLines(firstStep.activeLines || []);
        }
    }, []); // atualiza só no começo

    useEffect(() => {
        speedRef.current = 600 - (Math.min(Math.max(animSpeed, 0), 10) / 10) * 500; // speedRef vai de 600ms (lento) a 100ms (rápido)
    }, [animSpeed]);

    // -------- Pega o maior valor para normalizar os tamanhos das barras --------

    function getMaxAbsValue(arr) {
        if (arr.length === 0) return 1;
        return Math.max(...arr.map(item => Math.abs(item.value)));
    }
    const maxAbsValue = getMaxAbsValue(arrayState);

    // ------------------------------------------------------------------------------

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms)); //resolve a promise depois do setTimeout
    }

    function applyAlgorithmWithVariant(array, options = {}) {
        const currentType = options.type ?? type;
        const currentVariant = options.variant ?? bubbleVariant;

        let algorithmFunc;

        if (currentType === "bubble") {
            algorithmFunc = currentVariant === "bubble" ? bubbleSort : bubbleSortOtimized;
        } else {
            algorithmFunc = ALGORITHMS_MAP[currentType];
        }

        if (!algorithmFunc) {
            console.error(`Nenhum algoritmo configurado para o tipo: ${currentType}`);
            return;
        }

        algorithmFunc(array, sortStepsRef, setStepsCounter, setStepsAmount, tSteps);

        if (sortStepsRef.current.length > 0) {
            const firstStep = sortStepsRef.current[0];
            setArrayState(firstStep.array);
            setActiveIndices(firstStep.activeIndices || []);
            setInfoMsg(firstStep.infoMsg || "");
            setActiveCodeLines(firstStep.activeLines || []);
            setStepsCounter(0);
        }
    }

    async function runSortAnimation() {
        // Pega de onde ta (stepsCounter) e vai até o final da lista de passos (stepsAmount)

        // Se já está no último passo, não há mais o que animar pra frente
        if (isPlayingRef.current || stepsAmount === 0 || stepsCounter >= stepsAmount - 1) return;

        isPlayingRef.current = true;
        setActiveMotion(true); // Bloqueia as interações durante a animação

        // Começa a partir do próximo passo em relação ao atual
        for (let i = stepsCounter + 1; i < stepsAmount; i++) {
            if (!isPlayingRef.current) break;

            const step = sortStepsRef.current[i];
            setArrayState(step.array);
            setActiveIndices(step.activeIndices);
            setInfoMsg(step.infoMsg);
            setActiveCodeLines(step.activeLines || []);
            // stepsCounter passa a ser o índice atual (0-based)
            setStepsCounter(i); // Atualiza o contador para mostrar o progresso da animação
            await sleep(speedRef.current); // Espera o tempo definido antes de ir para o próximo passo
        }
        
        // Quando acaba (ou pausa), desliga tudo
        isPlayingRef.current = false;
        setActiveMotion(false); // Libera as interações após a animação
    }

    async function runBackSortAnimation() {
        // Só volta se não estiver já no passo inicial (0)
        if (isPlayingRef.current || stepsAmount === 0 || stepsCounter <= 0) return;

        isPlayingRef.current = true;
        setActiveMotion(true); // Bloqueia as interações durante a animação

        // Começa a voltar a partir do passo imediatamente anterior ao atual
        for (let i = stepsCounter - 1; i >= 0; i--) {
            if (!isPlayingRef.current) break;

            const step = sortStepsRef.current[i];
            setArrayState(step.array);
            setActiveIndices(step.activeIndices);
            setInfoMsg(step.infoMsg);
            setActiveCodeLines(step.activeLines || []);
            // i é índice 0-based, stepsCounter também representa o índice atual
            setStepsCounter(i); // Atualiza o contador para mostrar o progresso da animação
            await sleep(speedRef.current); // Espera o tempo definido antes de ir para o próximo passo
        }

        isPlayingRef.current = false;
        setActiveMotion(false); // Libera as interações após a animação
    }
    
    // Avança 1 Passo
    async function runNextSortSteps() {
        // stepsCounter representa o índice atual (0..stepsAmount-1)
        // Se já está no último, não há próximo passo
        if (stepsCounter >= stepsAmount - 1) return; 

        const nextIndex = stepsCounter + 1; // Próximo índice 0-based a ser mostrado
        const step = sortStepsRef.current[nextIndex]; 
        
        // Atualiza a tela
        setArrayState(step.array);
        setActiveIndices(step.activeIndices);
        setInfoMsg(step.infoMsg);
        setActiveCodeLines(step.activeLines || []);
        
        // Atualiza o contador para ficar igual à tela
        setStepsCounter(nextIndex); 
    }

    // Volta 1 Passo
    async function runPrevSortSteps() {
        // Se está no passo inicial (0), não tem como voltar mais
        if (stepsCounter <= 0) return; 

        const prevIndex = stepsCounter - 1; // Índice do passo anterior
        const step = sortStepsRef.current[prevIndex]; // Puxa a página 0 do livro
        
        // Atualiza a tela
        setArrayState(step.array);
        setActiveIndices(step.activeIndices);
        setInfoMsg(step.infoMsg);
        setActiveCodeLines(step.activeLines || []);
        
        // Atualiza o contador para ficar igual à tela
        setStepsCounter(prevIndex); 
    }

    function handlePause() {
        if (!isPlayingRef.current) return;
        isPlayingRef.current = false;
        setActiveMotion(false);
    }

    function handleInputChange(event) {
        const newRawInput = event.target.value;
        const cleanInput = newRawInput.replace(/[^0-9,\s-]/g, '');
        setInputValue(cleanInput);
 
        let localError = "";
        let localCanInsert = true;

        // vírgulas duplicadas, ex: "50,,30" ou "50, ,30"
        if (/\s*,\s*,/.test(cleanInput)) {
            localError = tUi("errorDuplicateComma");
            localCanInsert = false;
        }
        // dois ou mais '-' seguidos, ex: "--3" ou "---3"
        else if (/--+/.test(cleanInput)) {
            localError = tUi("errorInvalidNegative");
            localCanInsert = false;
        }

        const newArray = getNumbersFromInput(cleanInput);

        if (!localError) {
            if (newArray.length > 21) {
                localError = tUi("errorTooManyNumbers");
                localCanInsert = false;
            } else if (newArray.some(item => item.value < -999 || item.value > 999)) {
                localError = tUi("errorOutOfRange");
                localCanInsert = false;
            } else if (newArray.length === 0 && cleanInput.trim() !== "") {
                localError = tUi("errorAtLeastOneNumber");
                localCanInsert = false;
            }
        }

        setErrorMsg(localError);
        setCanInsert(localCanInsert);
        setUserInput(newArray);
    }

    function handlePlay() {
        if (!canInsert) return;

        console.log("Executando algoritmo:", type, "variant:", bubbleVariant);

        // Garante pelo menos 1 número antes de inserir
        if (userInput.length < 1) {
            setErrorMsg(tUi("errorAtLeastOneNumber"));
            setCanInsert(false);
            return;
        }

        setArrayState(userInput);
        applyAlgorithmWithVariant(userInput, { type: type });
    }

    function handleVariantChange(option) {
        const newVariant = option.value;

        if (isPlayingRef.current) {
            isPlayingRef.current = false;
            setActiveMotion(false);
        }

        const baseArray =
            userInput && userInput.length > 0 ? userInput : arrayState;

        if (!baseArray || baseArray.length === 0) return;

        // Atualiza o estado e já recalcula usando a nova variante
        setBubbleVariant(newVariant);
        applyAlgorithmWithVariant(baseArray, { variant: newVariant });
    }

    // Cálculos auxiliares para exibir o status dos passos começando em 0
    const maxIndex = Math.max(stepsAmount - 1, 0);
    const executedSteps = Math.min(stepsCounter, maxIndex);
    const remainingSteps = Math.max(maxIndex - executedSteps, 0);

    return ( 
        <div className={style.container}>
            <div className={style.inputRow}>
                <div className={style.inputWrapper}>
                    <InputField 
                        label={tUi("inputLabel")}
                        name="values"
                        value={inputValue}
                        onChange={handleInputChange}
                        type="text"
                        placeholder={tUi("inputPlaceholder")}
                        info={tUi("inputInfo")}
                    />
                </div>
                <div className={style.errorMessageWrapper}>
                    {errorMsg && (
                        <span className={style.errorMessage}>
                            {errorMsg}
                        </span>
                    )}
                </div>
            </div>
            
            <div className={style.controlsContainer}>
                <div className={style.buttonsContainer}>
                    <ReactiveButton 
                        onClick={() => {handlePlay(), console.log("Steps registrados:", sortStepsRef.current)}} 
                        blocked={!canInsert || activeMotion}
                        label={tUi("playButtonLabel")}
                    />
                </div>
                {type === "bubble" && (
                    <div className={style.sortContainer}>
                        <SortSelection
                            options={[
                                { value: "bubble", label: tUi("variantBubbleLabel") },
                                { value: "bubbleOptimized", label: tUi("variantBubbleOptimizedLabel") },
                            ]}
                            defaultLabel={tUi("variantSelectLabel")}
                            initialValue="bubble"
                            onSelect={handleVariantChange}
                        />
                    </div>
                )}
            </div>

            <div className={style.arrayContainer}>
                {infoMsg && (
                    <motion.div
                        key={infoMsg}
                        className={style.infoOverlay}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {infoMsg}
                    </motion.div>
                )}

                {arrayState != null && arrayState.map((item, index) => {
                    const isActive = activeIndices.includes(index); // Ativa se activeIndices tiver o index atual dentro dele
                    
                    // Altura travada em no mínimo 4px para sempre aparecer uma "tampinha" na tela
                    const barHeight = Math.max((Math.abs(item.value) / maxAbsValue) * 120, 1);

                    return (
                        <motion.div
                            key={item.id}
                            layout       
                            animate={{ y: isActive ? -15 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={style.columnWrapper}
                        >
                            {/* 1. Cresce para cima */}
                            <div className={style.positiveZone}>
                                {item.value >= 0 && (
                                    <div 
                                        className={style.barPositive}
                                        style={{ 
                                            height: `${barHeight}px`, 
                                            backgroundColor: isActive ? "#00b94767" : "#00b947"
                                        }} 
                                    >
                                        <span className={style.itemValuePositive}>{item.value}</span>
                                    </div>
                                )}
                            </div>

                            {/* 2. Eixo */}
                            <div className={style.indexAxis}>
                                {index}
                            </div>

                            {/* 3. Cresce para baixo */}
                            <div className={style.negativeZone}>
                                {item.value < 0 && (
                                    <div 
                                        className={style.barNegative}
                                        style={{ 
                                            height: `${barHeight}px`, 
                                            backgroundColor: isActive ? "#ef444465" : "#ef4444" // Vermelho!
                                        }} 
                                    >
                                        <span className={style.itemValueNegative}>{item.value}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            
            {/* Bellow section  */}
            <div className={style.bottomRow}>
                <HighlightSection>
                    <div className={style.stepsHeaderRow}>
                        <div>
                            <p className={style.stepsTitle}>{tUi("stepsTitle")}</p>
                            <p className={style.stepsMessage}>
                                {infoMsg || tUi("stepsFallbackMessage")}
                            </p>
                        </div>
                    </div>

                    
                    <div className={style.stepsFooterRow}>
                        <div className={style.stepsCounterInfo}>
                            {stepsAmount > 0 ? (
                                <>
                                    <span>
                                        {tUi("stepsExecuted", { value: executedSteps })}
                                    </span>
                                    <span>
                                        {tUi("stepsRemaining", { value: remainingSteps })}
                                    </span>
                                    <span>
                                        {tUi("stepsTotal", { value: stepsAmount })}
                                    </span>
                                </>
                            ) : (
                                <span>{tUi("noStepsMessage")}</span>
                            )}
                        </div>

                        <div className={style.stepsPlayButtons}>
                            <ReactiveButton 
                                onClick={() => runPrevSortSteps()} 
                                blocked={activeMotion || stepsCounter <= 0}
                                label={tUi("prevStepLabel")} 
                            />

                            <ReactiveButton 
                                onClick={() => runNextSortSteps()} 
                                blocked={activeMotion || stepsCounter >= Math.max(stepsAmount - 1, 0)}
                                label={tUi("nextStepLabel")} 
                            />

                            <div className={style.stepsPlayGroup}>
                                <ReactiveButton
                                    onClick={() => runSortAnimation()}
                                    blocked={activeMotion || stepsAmount === 0 || stepsCounter >= stepsAmount - 1}
                                    label={tUi("playForwardLabel")}
                                />
                                <ReactiveButton
                                    onClick={handlePause}
                                    blocked={!activeMotion}
                                    label={tUi("pauseLabel")}
                                />
                                <ReactiveButton
                                    onClick={() => runBackSortAnimation()}
                                    blocked={activeMotion || stepsAmount === 0 || stepsCounter <= 0}
                                    label={tUi("playBackwardLabel")}
                                />
                            </div>
                        </div>

                        <div className={style.slider}>
                            <label className={style.sliderLabel}>
                                {tUi("animationSpeedLabel")}
                            </label>
                                                    
                            <input 
                                type="range" 
                                min="0"   
                                max="10"   
                                step="0.1"
                                value={animSpeed}
                                onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
                                className={style.sliderTrack}
                            />
                            <div className={style.sliderScale}>
                                <span>{tUi("animationSpeedSlow")}</span>
                                <span>{tUi("animationSpeedFast")}</span>
                            </div>
                        </div>
                    </div>
                </HighlightSection>
            </div>

            <ArticleLayoutSplit title={tUi("codeSectionTitle")} type={"codeSplit"} extraContent={
                <CodeViewer 
                    code={
                        type === "bubble"
                            ? (bubbleVariant === "bubble"
                                ? CODES_MAP.bubble
                                : CODES_MAP.bubbleOptimized)
                            : CODES_MAP[type]
                    }
                    language={"javascript"}
                    activeLines={activeCodeLines} // Destaca as linhas ativas do passo atual
                />
            }>
                <ParagraphSection paragraphs={[
                    tCode("description"),
                ]}/>

                <HighlightSection>
                    <ParagraphSection paragraphs={[
                        tCode("complexity", {
                            strong: (children) => <strong>{children}</strong>,
                        }),
                    ]}/>
                </HighlightSection>
                        
            </ArticleLayoutSplit>   
        </div>
    );
}