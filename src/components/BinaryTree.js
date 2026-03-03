// React e Hooks
import React, { useRef, useState, useEffect, useMemo, useLayoutEffect } from "react";

// Componentes
import InputField from './InputField';
import ReactiveButton from './ReactiveButton';

// Animações
import { useAnimate, motion, color } from 'framer-motion';

// Utilidades e contextos
import ScrollContainer from 'react-indiana-drag-scroll';
import { useIsMobile } from '@/context/ViewportContext';
import { useTranslations } from 'use-intl';

// Árvores
import AvlTree, { setNodesCoordinates as avl_SetNodesCoordinates } from "../utils/AvlTree.js";
import BinarySearchTree, { setNodesCoordinates as bst_setNodesCoordinates } from "../utils/BinarySearchTree.js";

// Estilos
import style from './BinaryTree.module.css';
import TextGenericDesigns from './TextComponents/TextGenericDesigns.module.css';

// ---- FUNÇÕES DE RENDERIZAÇÃO

function drawTree(tree, treeType = "BST", hoveredNodeId, setHoveredNodeId) {
    // Desenha a árvore Nó a Nó
    const nodes = tree.nodes;

  return nodes.map((node) => (
    <div
        key={node.id}
        style={{
            position: "absolute",
            left: node.x,
            top: node.y,
            transform: "translate(-50%, -50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#050505",
            color: "#00b947",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            border: hoveredNodeId === node.id
              ? "2px solid #00b947"
              : "1px solid rgba(0, 185, 71, 0.6)",
            boxShadow: "0 0 0 1px rgba(0, 185, 71, 0.35), 0 10px 25px rgba(0,0,0,0.85)",
            zIndex: hoveredNodeId === node.id ? 20 : 10 // Traz para frente se for o focado
        }}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
    >
        
        {treeType === "AVL" && hoveredNodeId === node.id && (
        <div>
            <div style={{ 
                position: "absolute", 
                top: "-18px", 
                right: "35px",
                fontSize: "12px", 
                color: "#00b947", 
                backgroundColor: "rgba(5, 5, 5, 0.95)", 
                borderRadius: "999px",
                padding: "4px 6px",
                border: "1px solid rgba(0, 185, 71, 0.6)"
                }}
            > 
                {`L:${node.leftHeight}`} 
            </div>
            <div style={{ 
                position: "absolute", 
                top: "-18px", 
                left: "35px", 
                fontSize: "12px", 
                color: "#00b947", 
                backgroundColor: "rgba(5, 5, 5, 0.95)", 
                borderRadius: "999px", 
                padding: "4px 6px",
                border: "1px solid rgba(0, 185, 71, 0.6)"
                }}
            > 
                {`R:${node.rightHeight}`} 
            </div>
        </div>
        )}

        {node.value}
    </div>
  ));
}

function drawEdges(tree) {
    // Desenha as arestas entre os nós
    if (!tree.root) return null;

  const edges = [];

  // Função auxiliar para percorrer e gerar as linhas
  function generateEdge(node) {
    if (!node) return;

    // Se tiver filho esquerdo, desenha linha do Pai -> Esq
    if (node.left) {
      edges.push(
        <line
          key={`${node.id}-${node.left.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
                    stroke="#00b947" 
                    strokeWidth="2"
                    strokeOpacity="0.85"
        />
      );
      generateEdge(node.left);
    }

    // Se tiver filho direito, desenha linha do Pai -> Dir
    if (node.right) {
      edges.push(
        <line
          key={`${node.id}-${node.right.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
                    stroke="#00b947"
                    strokeWidth="2"
                    strokeOpacity="0.85"
        />
      );
      generateEdge(node.right);
    }
  }

  generateEdge(tree.root);
  return edges;
}

export default function BinaryTree({
    inputFieldsContainerStyle,
    treeType = "BST",
    preview = false
}) {
    const t = useTranslations('BinaryTree');

    const treeTypeInstance = () => {
        if (treeType === "AVL") {
            return new AvlTree();
        } else {
            return new BinarySearchTree();
        }
    };

    const treeRef = useRef(treeTypeInstance()); // continua igual

    // Valores usados no preview da home
    const PREVIEW_VALUES = [
        200, 100, 300, 50, 150, 250, 350,
        25, 75, 125, 175, 225, 275, 325, 375
    ];

    // ------- CONFIGURAÇÕES DA ÁRVORE

    const WORLD_WIDTH = 4000;  // Largura gigante
    const WORLD_HEIGHT = 2000; // Altura gigante
    const START_X = preview ? 280 : WORLD_WIDTH / 2; // O centro do mundo (2000px)
    
    const containerRef = useRef(null); // Referência para o container de scroll

        const updateCoordinates = (root, startX) => {
        if (treeType === "AVL") {
            avl_SetNodesCoordinates(root, startX); // Executa direto
        } else {
            bst_setNodesCoordinates(root, startX); // Executa direto
        }
    }

    if (preview && treeRef.current.nodes.length === 0) {
      const tree = treeRef.current;
            PREVIEW_VALUES.forEach(v => tree.insert(v));
      updateCoordinates(tree.root, START_X);
    }

    const [hoveredNodeId, setHoveredNodeId] = useState(null); // Nó atualmente em hover

    const [rawText, setRawText] = useState(""); // Input visual do usuário

    const [valueToRemove, setValueToRemove] = useState(preview ? "300" : ""); // Valor a ser removido da árvore (50 por padrão no preview)

    const [version, setVersion] = useState(0); // Versão da árvore (força redraw)

    // Desenho memoizado: só recalcula quando version ou treeType mudam
    const renderedEdges = useMemo(
        () => drawEdges(treeRef.current),
        [version]
    );
    const renderedNodes = useMemo(
        () => drawTree(treeRef.current, treeType, hoveredNodeId, setHoveredNodeId),
        [version, treeType, hoveredNodeId]
    );

    
    // ----- HISTORICO ANTERIOR ---- //
    const [history, setHistory] = useState([]);
    

    // ----- OPERAÇÕES ---- //
    const [operationInfo, setOperationInfo] = useState(""); // Informação da operação atual

    // ---- ANIMAÇÃO ---- //
    const [isOnAnimation, setIsOnAnimation] = useState(false); // Se está em animação

    const [scope, animate] = useAnimate();

    const [animSpeed, setAnimSpeed] = useState(1); // Velocidade da animação

    // useEffct atualiza quando a velocidade da animação muda
    const animSpeedRef = useRef(animSpeed);
    useEffect(() => {
        animSpeedRef.current = animSpeed;
    }, [animSpeed]);

    const AnimationMode = Object.freeze({
        INSERTION: 'insertion',
        REMOVAL: 'removal'
    });

    // Guarda o controle da animação que está rodando AGORA
    const currentAnimControls = useRef(null);

    useEffect(() => {
        // Aplica a velocidade atual do slider -> Garante velocidade se o slider mudar
        if (currentAnimControls.current) {
            currentAnimControls.current.speed = animSpeed;
        }
    }, [animSpeed]);

    const [sequences, setSequences] = useState(() => ({
        externQueue: [], // Fila externa -> Não participa da lógica da árvore, só para visualização
        insertQueue: [], // Fila interna -> Participa da lógica da árvore
        nodeQueue: preview ? [...PREVIEW_VALUES] : [], // Fila da sequência de nós inseridos
    })); 
    
    // 2. Use este efeito para centralizar a visão no início
    useEffect(() => {
        if (containerRef.current) {
            
            // 1. Largura da janela visível do usuário
            const screenWidth = containerRef.current.clientWidth;
            
            // 2. Conta para posição central
            // START_X é onde está sua árvore (o meio do mundo gigante)
            const centerPosition = START_X - (screenWidth / 2);

            // 3. Aplica o scroll
            containerRef.current.scrollLeft = centerPosition;
        }
    }, []);

    function handleChange(value, name) {
        {/*
        Serve para mudar qualquer sequência no estado (vizQueue, queue, nodeSequence)
        */}

        setSequences((prev) => ({
        ...prev,
        [name]: value
        }));
    }

    function handleInputChange(event) {
        {/*
        É chamado sempre que o input do usuário muda
        -> Muda o rawText e o vizQueue (fila que o usuário vê)
        */}

        // 1. Pega o valor do input
        const input = event.target.value;

        if (!/^[0-9.,\s-]*$/.test(input)) {
            return; 
        }

        // 2. Atualiza o texto visual no InputField 
        setRawText(input);

        // 3. Lógica para transformar o input em uma array de valores
        const inputValuesString = input.split(",").map((s) => s.trim());
        let inputValues = [];

        for (let i = 0; i < inputValuesString.length; i++) {
            const value = parseInt(inputValuesString[i], 10);
            if (isNaN(value)) {
                continue; 
            }
            inputValues.push(value);
        }

        // 4. Atualiza a fila visual
        handleChange(inputValues, "externQueue");
    }

    function handleQueueChange() {
        {/*
        Coloca a fila visual na fila interna e reseta o input

        A fila inteira vai virar a fila interna + fila visual
        */}
        
        const newQueue = [...sequences.insertQueue, ...sequences.externQueue];
        handleChange(newQueue, "insertQueue");  

        resetInputAndVizQueue();
    }

    async function handleNextStep() {
        // Recentraliza se for o primeiro nó
        if (treeRef.current.nodes.length === 0 && containerRef.current) {
            resetView();
        }
            
        // 1. Verifica se há valores na fila
        if (sequences.insertQueue.length === 0) return;

        /// 2. Insere o próximo valor na árvore
        const newQueue = [...sequences.insertQueue];
        
        // 3. Remove o próximo valor da fila
        const nextValue = newQueue.shift();

        // 3.1 Verifica se o valor já existe na árvore
        const alreadyExists = treeRef.current.nodes.some((n) => n.value === nextValue);

        if (alreadyExists) {
            setOperationInfo(t('operationInfos.insertingClonedValue', { value: nextValue }));

            // Atualiza apenas a fila interna (descarta o duplicado) e sai
            handleChange(newQueue, "insertQueue");
            return;
        }

        setOperationInfo(t('operationInfos.insertingValue', { value: nextValue }));

        // 5. Insere o valor na árvore AVL -> Logicamente
        const tree = treeRef.current;
        const newNode = tree.insert(nextValue);

        if (tree.root) await animatePath(tree.root, newNode, AnimationMode.INSERTION); 

        updateCoordinates(tree.root, START_X);

        // Salva no histórico -> Antes de atualizar
        handleHistory();

        // 6. Atualizamos as filas
        const newNodeSequence  = [...sequences.nodeQueue, nextValue];
        handleChange(newQueue, "insertQueue");
        handleChange(newNodeSequence, "nodeQueue");

        // Força o redesenho da árvore (após a animação terminar)
        setVersion((v) => v + 1);
        
        await popOnNode(newNode);
    }

    async function popOnNode(node) {
        await animate("#popBorder", {
            left: node.x,
            top: node.y,
            opacity: 1,
            backgroundColor: "transparent",
            borderColor: "#22c55e",
            scale: 1,
        }, { duration: 0 });

        await animate("#popBorder", { scale: 1.2 }, { duration: 0.2 });
        await animate("#popBorder", { scale: 1, opacity: 0 }, { duration: 0.2 });
    }

    async function handleRemoveValue() {
        const value = Number(valueToRemove);

        if (Number.isNaN(value)) {
            alert(t('invalidNumberRemovalAlert'));
            return;
        }

        // Se não tiver esse valor na árvore, avisa e sai
        const exists = treeRef.current.nodes.some((n) => n.value === value);
        if (exists === false) {
            setOperationInfo(t('operationInfos.valueNotFound', { value }));
            return;
        }

        const tree = treeRef.current;
        const nodeToRemove = tree._searchNodeByValue(value, tree.root);

        // Anima o caminho até o nó a ser removido
        setOperationInfo(t('operationInfos.searching', { value }));
        if (tree.root) await animatePath(tree.root, nodeToRemove, AnimationMode.REMOVAL);   
        tree.remove(value, tree.root);

        // Salva no histórico -> Antes de atualizar
        handleHistory();

        // Atualiza as filas
        const newNodeSequence = sequences.nodeQueue.filter((v) => v !== value);
        handleChange(newNodeSequence, "nodeQueue");
        updateCoordinates(tree.root, START_X);

        // Força redesenho após remoção
        setVersion((v) => v + 1);

        // Limpa o valor de remoção após remover com sucesso
        setValueToRemove("");
    }

    async function animatePath(firstNode, finalNode, animateMode) {
        {/* Anima o caminho do nó, do firstNode até o finalNode 
            
            obs. em vez de fazer:
            const c = animate(..., { duration: 0.5 });
            c.speed = valor;
            await c;

            Para mudar a speed de cada animação, faremos um "prefab":
            Criar uma constante chamada configAnimate. Ela recebe uma função assíncrona. 
            Essa função aceita selector, keyframes e options (sendo options vazio por padrão). 
            => (Executa) o código que está no bloco a seguir.
        */}

        const configAnimate = async (selector, keyframes, options = {}) => {
            // 1. Inicia a animação com uma duração base
            const newAnimate = animate(selector, keyframes, { 
                ...options, 
                duration: options.duration || 0.5 
            }); 

            currentAnimControls.current = newAnimate;

            // 3. Aplica a velocidade atual do slider -> Garante velocidade mesmo sem o slider mudar
            newAnimate.speed = animSpeedRef.current;

            // 4. Espera terminar
            await newAnimate;
        }

        setIsOnAnimation(true); // Anima a inserção do nó 

        let currentNode = firstNode;

        const path = [];

        // 01. Loop para achar os lugares por onde o nó vai passar (x,y)
        if (currentNode) {
            while (currentNode) {
                path.push({ x: currentNode.x, y: currentNode.y });
                
                if (finalNode.value < currentNode.value) {
                    if (!currentNode.left || currentNode.left == finalNode) break; 
                    currentNode = currentNode.left;
                } else if (finalNode.value > currentNode.value) {
                    if (!currentNode.right || currentNode.right == finalNode) break;
                    currentNode = currentNode.right;
                } else {
                    break; 
                }
            }
        } 

        // 02. Posição final do nó (onde ele vai ficar)
        const finalTarget = { x: finalNode.x, y: finalNode.y };

        // Certeza que começa no começo
        await configAnimate("#traveler", { scale: 0, opacity: 0, left: path[0].x, top: path[0].y }, { duration: 0 });

        // 03. Animar o traveler
        if (path.length > 0) {
            await configAnimate("#traveler", { 
                left: path[0].x, 
                top: path[0].y, 
                opacity: 1, 
                backgroundColor: "transparent", 
                scale: 1, 
                borderColor: "#3b82f6", 
                zIndex: 50
            }, { duration: 0 });

            // 2. Percorre o caminho (Nós ocupados = Vermelho)
            for (let i = 0; i < path.length; i++) {
                const step = path[i];
                
                // Vai até o nó
                await configAnimate("#traveler", { left: step.x, top: step.y }, { duration: 0.5 });
                
                // Fica VERMELHO (Ocupado!)
                await configAnimate("#traveler", { borderColor: "#ef4444", scale: 1.2 }, { duration: 0.2 });
                await configAnimate("#traveler", { scale: 1 }, { duration: 0.1 });
            }
        } else {
            // Caso árvore vazia, aparece no topo
            await configAnimate("#traveler", { 
                left: finalTarget.x, 
                top: finalTarget.y, // Um pouco acima
                backgroundColor: "transparent", // Transparente
                opacity: 1 
            }, { duration: 0 });
        }

        // 04. Etapas específicas de inserção ou remoção
        if (animateMode === AnimationMode.REMOVAL) {
            // Indica que achou o nó a ser removido
            setOperationInfo(t('operationInfos.removing', { value: finalNode.value }));
            await configAnimate("#traveler", { 
                left: finalTarget.x, 
                top: finalTarget.y,
                backgroundColor: "transparent", // Transparente
                borderColor: "#c57122" // Laranja
            }, { duration: 0.5 });

            // Pop para indicar remoção
            await configAnimate("#traveler", { scale: 1.5 }, { duration: 0.4 });
            await configAnimate("#traveler", { scale: 1 }, { duration: 0.4 });

            let successorPath = [];
            let successorNode = null;
            if (finalNode.left != null && finalNode.right != null) {
                // Encontra o sucessor
                successorNode = finalNode.right;
                successorPath.push({ x: successorNode.x, y: successorNode.y });
                while (successorNode.left != null) {
                    successorNode = successorNode.left;
                    successorPath.push({ x: successorNode.x, y: successorNode.y });
                }
            }

            // 2. Se houver um sucessor (Caso de 2 filhos) -> Animação"
            if (successorNode) {
                // Viaja até o sucessor
                for (let i = 0; i < successorPath.length; i++) {
                    const step = successorPath[i];
                    await configAnimate("#traveler", { left: step.x, top: step.y}, { duration: 0.6 });
                }

                // Pop no sucessor
                await configAnimate("#traveler", { scale: 1.2 }, { duration: 0.6 });

                // Sobe de volta para o nó original (substituição)
                await configAnimate("#traveler", { 
                    left: finalTarget.x, 
                    top: finalTarget.y 
                }, { duration: 1.0 });

                // "Deposita" o valor
                await configAnimate("#traveler", { scale: 0, opacity: 0 }, { duration: 0.3 });
            } else {
                // Remoção simples (folha ou 1 filho): Só some
                await configAnimate("#traveler", { scale: 0, opacity: 0 }, { duration: 0.5 });
            }
        }

        // Limpeza final
        await configAnimate("#traveler", { scale: 0, opacity: 0}, { duration: 0 });
        setIsOnAnimation(false);
    }

    function resetInputAndVizQueue() {
        setRawText("");
        handleChange([], "externQueue");
    }

    function resetAll() {
        resetInputAndVizQueue();

        // Reseta a árvore
        treeRef.current = treeTypeInstance();

        // Reseta as sequências 
        setSequences({
            externQueue: [],
            insertQueue: [],
            nodeQueue: []
        });
        
        setVersion(0); // Força redraw
    }

    function resetHistory() {
        setHistory([]);
    }

    function handleHistory() {
        // Salva um snapshot do estado atual (antes da próxima operação)
        setHistory(prev => [
            ...prev,
            {
                insertQueue: [...sequences.insertQueue],
                nodeQueue: [...sequences.nodeQueue],
            }
        ]);
    }

    function returnToPreviousState() {
        // Retorna ao estado anterior do histórico
        if (history.length === 0) return; // Nada para voltar
        
        const previousState = history[history.length - 1];

        // Limpa filas visuais
        resetInputAndVizQueue();

        // Restaura as filas a partir do snapshot
        handleChange(previousState.insertQueue, "insertQueue");
        handleChange(previousState.nodeQueue, "nodeQueue");

        // Remove o snapshot consumido do histórico
        setHistory(prev => prev.slice(0, -1));

        // Reconstrói a árvore diretamente a partir de nodeQueue
        treeRef.current = treeTypeInstance();
        for (let i = 0; i < previousState.nodeQueue.length; i++) {
            // Insere cada nó na nova árvore
            treeRef.current.insert(previousState.nodeQueue[i]);
        }

        // Atualiza as coordenadas dos nós
        updateCoordinates(treeRef.current.root, START_X);   
        // Força redesenho
        setVersion((v) => v + 1);
    }

    function resetView() {
        if (containerRef.current) {
            const screenWidth = containerRef.current.clientWidth;
            const centerPosition = START_X - (screenWidth / 2);

            // Usamos scrollTo para ter controle da suavidade
            containerRef.current.scrollTo({
                left: centerPosition,
                top: 0,
                behavior: "smooth" 
            });
        }
    }

    function skipSteps() {
        // Executa todas as operações restantes da fila sem animação
        const tree = treeRef.current;

        let currentInsertQueue = [...sequences.insertQueue];
        let currentNodeQueue = [...sequences.nodeQueue];
        let currentExternQueue = [...sequences.externQueue];
        
        // Precisamos primeiro armazenar o histórico de cada passo, depois colocar na história geral
        // Isso porque, se colocarmos direto na historia em cada loop, o sistema não consegue lidar com múltiplos passos de uma vez
        const newHistory = [];

        while (currentInsertQueue.length > 0) {
            const value = currentInsertQueue[0];
            
            newHistory.push({
                insertQueue: [...currentInsertQueue],
                nodeQueue: [...currentNodeQueue],
                externQueue: [...currentExternQueue]
            });

            currentInsertQueue.shift(); 

            const alreadyExists = tree.nodes.some((n) => n.value === value);
            if (alreadyExists) {
                continue; 
            }

            // Insere na árvore
            tree.insert(value);
            currentNodeQueue.push(value);
        }
        
        setHistory((prev) => [...prev, ...newHistory]);
        updateCoordinates(tree.root, START_X);

        handleChange([], "insertQueue"); // Fila zerada
        handleChange(currentNodeQueue, "nodeQueue"); // Lista completa
        
        setVersion((v) => v + 1);
    }


    const isMobile = useIsMobile();

    return (
        <div>
            {!preview && (
                <div className={style.topInputSection}>
                    <div className={`${inputFieldsContainerStyle || ''} ${style.topInputInner}`}>
                        <InputField 
                            label={t('inputField.label')}
                            name="values"
                            value={rawText}
                            onChange={handleInputChange}
                            type="text"
                            placeholder={"e.g. 50, 30, 70, 20, 40"}
                            info={t('inputField.info')}
                        >
                        </InputField>
                    
                        <ReactiveButton 
                            onClick={preview ? undefined : (isOnAnimation ? undefined : handleQueueChange)} 
                            label={t('insertValuesQueueLabel')}
                            extraStyles={style.toolButton}
                            blocked={preview || isOnAnimation}
                        />
                    </div>
                </div>
            )}
            
            
            {/* 1. MOLDURA FIXA DA ÁRVORE PARA DESKTOP */}
            {!isMobile && 
                <div style={{ 
                    position: 'relative', 
                    width: preview ? '85%' : '60%', 
                    height: preview ? '300px' : '580px', 
                    overflow: preview ? 'visible' : 'hidden', 
                    margin: '0 auto' 
                }}>

                {/* 2.1 TOOLBOX FLUTUANTE -> ESQUERDA */}
                {!preview && 
                    <div 
                        className={style.treeToolsStyle} 
                        style={{
                            position: 'absolute', 
                            top: '10px',
                            left: '10px',
                            zIndex: 51, 
                            width: '215px', 
                            userSelect: 'none',
                            pointerEvents: 'auto' 
                        }}
                    >   
                        <ReactiveButton 
                            onClick={preview ? undefined : (isOnAnimation ? undefined : handleNextStep)} 
                            label={t('stepButtons.nextLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview || isOnAnimation}
                        />

                        <ReactiveButton 
                            onClick={preview ? undefined : (isOnAnimation ? undefined : returnToPreviousState)} 
                            label={t('stepButtons.previousLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview || isOnAnimation}
                        />

                        <div 
                            className={style.slider}
                        >
                            <label className={style.sliderLabel}>
                                {t('speedControler.label')}
                            </label>
                                
                            <input 
                                type="range" 
                                min="0.0"   
                                max="10.0"   
                                step="0.1"
                                value={animSpeed}
                                onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
                                className={style.sliderTrack}
                            />
                            <div className={style.sliderScale}>
                                <span>{t('speedControler.sliderSlow')}</span>
                                <span>{t('speedControler.sliderFast')}</span>
                            </div>
                        </div>
                    
                        <ReactiveButton 
                            onClick={preview ? undefined : (isOnAnimation ? undefined : () => { resetAll(); resetHistory(); })} 
                            label={t('resetTreeButtonLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview || isOnAnimation}
                        />

                        <div className={style.toolInputRemoval}>
                            <InputField 
                                label={t('removalCard.inputFieldLabel')}
                                name="removeValue"
                                value={valueToRemove}
                                onChange={(e) => setValueToRemove(e.target.value)}
                                type="number"
                                placeholder={"e.g. 50"}
                                info={t('removalCard.inputFieldInfo')}
                            />
                            <ReactiveButton 
                                onClick={isOnAnimation ? undefined : handleRemoveValue} 
                                label={t('removalCard.buttonLabel')}
                                extraStyles={`${style.toolButton} ${style.toolRemoveButton}`} 
                                blocked={isOnAnimation || valueToRemove === ""}
                            />
                        </div>
                    
                        <ReactiveButton 
                            onClick={preview ? undefined : resetView} 
                            label={t('resetViewButtonLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview}
                        />

                        <ReactiveButton 
                            onClick={preview ? undefined : skipSteps} 
                            label={t('skipStepsButtonLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview}
                        />
                    </div>
                }   
                    
                    {/* 2.2 TOOLBOX FLUTUANTE -> DIREITA */}
                    <div 
                        className={style.treeToolsStyle} 
                        style={{
                            position: 'absolute', 
                            top: '10px',
                            right: '10px',
                            zIndex: 51, 
                            width: '215px', 
                            userSelect: 'none',
                            pointerEvents: 'auto' 
                        }}
                    >
                        {!preview && <div className={style.queueInfo}>
                            {t('queueInfo.insertQueue')}: {sequences.insertQueue.length > 0 ? sequences.insertQueue.join(", ") : t("queueInfo.empty")}
                        </div>}
                        <div className={style.queueInfo}>
                        {t('queueInfo.nodeQueue')}: {sequences.nodeQueue.length > 0 ? sequences.nodeQueue.join(", ") : t("queueInfo.empty")}
                        </div>
                        
                        {preview && <div className={style.toolInputRemoval}>
                            <InputField 
                                label={t('removalCard.inputFieldLabel')}
                                name="removeValue"
                                value={valueToRemove}
                                onChange={(e) => setValueToRemove(e.target.value)}
                                type="number"
                                placeholder={"e.g. 50"}
                                info={t('removalCard.inputFieldInfo')}
                            />
                            <ReactiveButton 
                                onClick={isOnAnimation ? undefined : handleRemoveValue} 
                                label={t('removalCard.buttonLabel')}
                                extraStyles={`${style.toolButton} ${style.toolRemoveButton}`} 
                                blocked={isOnAnimation || valueToRemove === ""}
                            />
                        </div>}
                    </div>

                    {/* 2.3 INFO */}
                    {operationInfo && (
                        <motion.div
                            key={operationInfo}
                            className={style.treeInfoStyle} 
                            style={{
                                fontSize: preview ? '10px' : '12px',
                                padding: preview ? '5px 7px' : '10px 14px',
                                position: 'absolute', 
                                top: '10px',    
                                left: preview ? '10px' : '230px',
                                zIndex: 11, 
                                width: preview ? '170px' : '215px', 
                                userSelect: 'none',
                                pointerEvents: 'auto' 
                            }}
                            initial={{ opacity: 0 }} // Começa em 0
                            animate={{ opacity: [0, 1, 0] }} // 3 etapas: 0 -> 1 -> 0
                            transition={{ duration: 2, times: [0, 0.3, 1] }} // Passa para 1 em 30% do tempo, depois some até 2s
                        >
                            {operationInfo}
                        </motion.div>
                    )}

                    {/* 3. CONTAINER SCROLL */}
                    {preview ? (
                        <div 
                            ref={containerRef} 
                            className={style.treeContainer} 
                            style={{ 
                                position: 'relative',
                                width: '100%',   // Enche a moldura
                                height: '100%',  // Enche a moldura
                                overflow: 'hidden', 
                                cursor: 'default',
                            }} 
                        >
                            {/* Conteúdo de dentro (4000px) */}
                            <div 
                                ref={scope}
                                style={{ 
                                    position: 'relative',
                                    width: `${WORLD_WIDTH}px`,   
                                    minWidth: `${WORLD_WIDTH}px`,
                                    height: `${WORLD_HEIGHT}px` 
                                }} 
                                className={style.treeWorld}
                            >            
                                {/* SVG das Linhas */}
                                <svg
                                    style={{
                                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                                        pointerEvents: "none", zIndex: 0
                                    }}
                                >
                                    {renderedEdges}
                                </svg>

                                {/* Nós da Árvore */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}> 
                                    {renderedNodes}
                                </div>

                                {/* Animação */}
                                <motion.div 
                                    id="popBorder"
                                    style={{
                                        position: "absolute",
                                        top: 0, left: 0,
                                        marginLeft: "-20px", marginTop: "-20px", // Centralizar com margem negativa
                                        width: "40px", height: "40px",
                                        borderRadius: "50%",
                                        border: "3px solid #3b82f6",
                                        backgroundColor: "transparent", // Fundo transparente
                                        zIndex: 10,
                                        opacity: 0, 
                                        pointerEvents: "none"
                                    }}
                                />

                                <motion.div 
                                    id="traveler"
                                    style={{
                                        position: "absolute",
                                        top: 0, left: 0,
                                        marginLeft: "-20px", marginTop: "-20px", // Centralizar com margem negativa
                                        width: "40px", height: "40px",
                                        borderRadius: "50%",
                                        border: "3px solid #3b82f6",
                                        backgroundColor: "transparent", // Fundo transparente
                                        zIndex: 10,
                                        opacity: 0, 
                                        pointerEvents: "none"
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <ScrollContainer
                            innerRef={containerRef}
                            className={style.treeContainer}
                            horizontal // Habilita scroll horizontal
                            vertical // Habilita scroll vertical
                            hideScrollbars // Esconde as barras de rolagem
                            nativeMobileScroll={false}
                            style={{ 
                                position: 'relative',
                                width: '100%',   // Enche a moldura
                                height: '100%',  // Enche a moldura
                                overflow: 'auto',
                                cursor: 'grab',
                            }}
                        >
                            {/* Conteúdo de dentro (4000px) */}
                            <div 
                                ref={scope}
                                style={{ 
                                    position: 'relative',
                                    width: `${WORLD_WIDTH}px`,   
                                    minWidth: `${WORLD_WIDTH}px`,
                                    height: `${WORLD_HEIGHT}px` 
                                }} 
                                className={style.treeWorld}
                            >            
                                {/* SVG das Linhas */}
                                <svg
                                    style={{
                                        position: "absolute", top: 0, left: 0, width: "100%", height: "100%", 
                                        pointerEvents: "none", zIndex: 0
                                    }}
                                >
                                    {renderedEdges}
                                </svg>

                                {/* Nós da Árvore */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}> 
                                    {renderedNodes}
                                </div>

                                {/* Animação */}
                                <motion.div 
                                    id="popBorder"
                                    style={{
                                        position: "absolute",
                                        top: 0, left: 0,
                                        marginLeft: "-20px", marginTop: "-20px", // Centralizar com margem negativa
                                        width: "40px", height: "40px",
                                        borderRadius: "50%",
                                        border: "3px solid #3b82f6",
                                        backgroundColor: "transparent", // Fundo transparente
                                        zIndex: 10,
                                        opacity: 0, 
                                        pointerEvents: "none"
                                    }}
                                />

                                <motion.div 
                                    id="traveler"
                                    style={{
                                        position: "absolute",
                                        top: 0, left: 0,
                                        marginLeft: "-20px", marginTop: "-20px", // Centralizar com margem negativa
                                        width: "40px", height: "40px",
                                        borderRadius: "50%",
                                        border: "3px solid #3b82f6",
                                        backgroundColor: "transparent", // Fundo transparente
                                        zIndex: 10,
                                        opacity: 0, 
                                        pointerEvents: "none"
                                    }}
                                />
                            </div>
                        </ScrollContainer>
                    )}
                </div>
            }

            {/* 2. LAYOUT MOBILE -> Controles em coluna acima da árvore */}
            {isMobile && 
                <div 
                    style=
                    {{
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "20px", 
                        padding: "20px",
                    }}
                >
                    

                    {/* Informações das filas */}
                    <div className={style.treeToolsStyle}>
                        <div className={style.queueInfo}>
                            {t('queueInfo.insertQueue')}: {sequences.insertQueue.length > 0 ? sequences.insertQueue.join(", ") : t("queueInfo.empty")}
                        </div>
                        <div className={style.queueInfo}>
                            {t('queueInfo.nodeQueue')}: {sequences.nodeQueue.length > 0 ? sequences.nodeQueue.join(", ") : t("queueInfo.empty")}
                        </div>
                    </div>

                    {/* Moldura da árvore */}
                    <div style={{ 
                        position: 'relative', 
                        width: '100%', 
                        height: '400px', 
                        overflow: 'hidden'
                    }}>
                        

                        {preview ? (
                            <div 
                                ref={containerRef} 
                                className={style.treeContainer} 
                                style={{ 
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'hidden', 
                                    cursor: 'default',
                                }} 
                            >

                            {/* Info da operação */}
                            {operationInfo && (
                                <motion.div
                                    key={operationInfo}
                                    className={style.treeInfoStyle}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, times: [0, 0.3, 1] }}
                                >
                                    {operationInfo}
                                </motion.div>
                            )}

                                <div 
                                    ref={scope}
                                    style={{ 
                                        position: 'relative',
                                        width: `${WORLD_WIDTH}px`,   
                                        minWidth: `${WORLD_WIDTH}px`,
                                        height: `${WORLD_HEIGHT}px` 
                                    }} 
                                    className={style.treeWorld}
                                >            
                                    <svg
                                        style={{
                                            position: "absolute", 
                                            top: 0, 
                                            left: 0, 
                                            width: "100%", 
                                            height: "100%", 
                                            pointerEvents: "none", 
                                            zIndex: 0
                                        }}
                                    >
                                        {renderedEdges}
                                    </svg>

                                    <div style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '100%', 
                                        zIndex: 10 
                                    }}> 
                                        {renderedNodes}
                                    </div>

                                    <motion.div 
                                        id="popBorder"
                                        style={{
                                            position: "absolute",
                                            top: 0, 
                                            left: 0,
                                            marginLeft: "-20px", 
                                            marginTop: "-20px",
                                            width: "40px", 
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "3px solid #3b82f6",
                                            backgroundColor: "transparent",
                                            zIndex: 10,
                                            opacity: 0, 
                                            pointerEvents: "none"
                                        }}
                                    />

                                    <motion.div 
                                        id="traveler"
                                        style={{
                                            position: "absolute",
                                            top: 0, 
                                            left: 0,
                                            marginLeft: "-20px", 
                                            marginTop: "-20px",
                                            width: "40px", 
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "3px solid #3b82f6",
                                            backgroundColor: "transparent",
                                            zIndex: 10,
                                            opacity: 0, 
                                            pointerEvents: "none"
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                           <ScrollContainer
                                innerRef={containerRef}
                                className={style.treeContainer}
                                horizontal
                                vertical
                                hideScrollbars
                                nativeMobileScroll={false} // Mantém a mágica do JS no mobile
                                style={{ 
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'auto', 
                                    cursor: 'grab',
                                    overscrollBehavior: 'none', // Mata o efeito elástico no iOS/Android
                                }} 
                            >
                                {/* Info da operação */}
                                {operationInfo && (
                                    <motion.div
                                        key={operationInfo}
                                        className={style.treeInfoStyle}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, times: [0, 0.3, 1] }}
                                    >
                                        {operationInfo}
                                    </motion.div>
                                )}

                                <div 
                                    ref={scope}
                                    style={{ 
                                        position: 'relative',
                                        width: `${WORLD_WIDTH}px`,   
                                        minWidth: `${WORLD_WIDTH}px`,
                                        height: `${WORLD_HEIGHT}px` 
                                    }} 
                                    className={style.treeWorld}
                                >            
                                    <svg
                                        style={{
                                            position: "absolute", 
                                            top: 0, 
                                            left: 0, 
                                            width: "100%", 
                                            height: "100%", 
                                            pointerEvents: "none", 
                                            zIndex: 0
                                        }}
                                    >
                                        {renderedEdges}
                                    </svg>

                                    <div style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '100%', 
                                        zIndex: 10 
                                    }}> 
                                        {renderedNodes}
                                    </div>

                                    <motion.div 
                                        id="popBorder"
                                        style={{
                                            position: "absolute",
                                            top: 0, 
                                            left: 0,
                                            marginLeft: "-20px", 
                                            marginTop: "-20px",
                                            width: "40px", 
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "3px solid #3b82f6",
                                            backgroundColor: "transparent",
                                            zIndex: 10,
                                            opacity: 0, 
                                            pointerEvents: "none"
                                        }}
                                    />

                                    <motion.div 
                                        id="traveler"
                                        style={{
                                            position: "absolute",
                                            top: 0, 
                                            left: 0,
                                            marginLeft: "-20px", 
                                            marginTop: "-20px",
                                            width: "40px", 
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "3px solid #3b82f6",
                                            backgroundColor: "transparent",
                                            zIndex: 10,
                                            opacity: 0, 
                                            pointerEvents: "none"
                                        }}
                                    />
                                </div>
                            </ScrollContainer>
                        )}
                    </div>

                    {/* Controles inferiores */}
                    <div className={style.treeToolsStyle}>   
                        <ReactiveButton 
                            onClick={preview ? undefined : (isOnAnimation ? undefined : handleNextStep)} 
                            label={t('stepButtons.nextLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview || isOnAnimation}
                        />

                        <ReactiveButton 
                            onClick={preview ? undefined : (isOnAnimation ? undefined : returnToPreviousState)} 
                            label={t('stepButtons.previousLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview || isOnAnimation}
                        />

                        <div className={style.slider}>
                            <label className={style.sliderLabel}>
                                {t('speedControler.label')}
                            </label>
                            <input 
                                type="range" 
                                min="0.0"   
                                max="10.0"   
                                step="0.1"
                                value={animSpeed}
                                onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
                                className={style.sliderTrack}
                            />
                            <div className={style.sliderScale}>
                                <span>{t('speedControler.sliderSlow')}</span>
                                <span>{t('speedControler.sliderFast')}</span>
                            </div>
                        </div>
                    
                        <ReactiveButton 
                            onClick={preview ? undefined : (isOnAnimation ? undefined : () => { resetAll(); resetHistory(); })} 
                            label={t('resetTreeButtonLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview || isOnAnimation}
                        />

                        <div className={style.toolInputRemoval}>
                            <InputField 
                                label={t('removalCard.inputFieldLabel')}
                                name="removeValue"
                                value={valueToRemove}
                                onChange={(e) => setValueToRemove(e.target.value)}
                                type="number"
                                placeholder={"e.g. 50"}
                                info={t('removalCard.inputFieldInfo')}
                            />
                            <ReactiveButton 
                                onClick={isOnAnimation ? undefined : handleRemoveValue} 
                                label={t('removalCard.buttonLabel')}
                                extraStyles={`${style.toolButton} ${style.toolRemoveButton}`} 
                                blocked={isOnAnimation || valueToRemove === ""}
                            />
                        </div>
                    
                        <ReactiveButton 
                            onClick={preview ? undefined : resetView} 
                            label={t('resetViewButtonLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview}
                        />

                        <ReactiveButton 
                            onClick={preview ? undefined : skipSteps} 
                            label={t('skipStepsButtonLabel')} 
                            extraStyles={style.toolButton}
                            blocked={preview}
                        />
                    </div>
                    
                </div>
            }
        </div>
    )
}

