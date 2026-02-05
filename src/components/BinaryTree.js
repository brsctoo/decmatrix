import style from './BinaryTree.module.css';
import { useDraggableScroll } from "../utils/MouseGrab.js";
import AvlTree, { setNodesCoordinates as avl_SetNodesCoordinates } from "../utils/AvlTree.js";
import BinarySearchTree, { setNodesCoordinates as bst_setNodesCoordinates } from "../utils/BinarySearchTree.js";
import React, { useRef, useState, useEffect, useMemo } from "react";
import InputField from './InputField';
import ReactiveButton from './ReactiveButton';
import { keyframes, useAnimate } from 'framer-motion';
import { motion } from 'framer-motion';
import { useTranslations } from 'use-intl';

function drawTree(tree, treeType = "BST", hoveredNodeId, setHoveredNodeId) {
    {/* Desenha a árvore Nó a Nó*/}
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
            backgroundColor: "rgb(201, 181, 156)",
            color: "rgb(82, 60, 45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
                color: "rgb(100, 100, 100)", 
                backgroundColor: "rgb(230, 230, 230, 1)", 
                borderRadius: "50%",
                padding: "4px"
                }}
            > 
                {`L:${node.leftHeight}`} 
            </div>
            <div style={{ 
                position: "absolute", 
                top: "-18px", 
                left: "35px", 
                fontSize: "12px", 
                color: "rgb(100, 100, 100)", 
                backgroundColor: "rgb(230, 230, 230, 1)", 
                borderRadius: "50%", 
                padding: "4px"
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
  {/* Desenha as arestas entre os nós */}
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
          stroke="#8b4513" // Cor marrom (combinando com seus nós)
          strokeWidth="2"
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
          stroke="#8b4513"
          strokeWidth="2"
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
    treeType = "BST"
}) {
    const t = useTranslations('BinaryTree');

    const treeTypeInstance = () => {
        if (treeType === "AVL") {
            return new AvlTree();
        } else {
            return new BinarySearchTree();
        }
    };

    const treeRef = useRef(treeTypeInstance()); // Referência para a árvore binária

    const [hoveredNodeId, setHoveredNodeId] = useState(null); // Nó atualmente em hover

    const [rawText, setRawText] = useState(""); // Input visual do usuário

    const [valueToRemove, setValueToRemove] = useState(); // Valor a ser removido da árvore

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

    const updateCoordinates = (root, startX) => {
        if (treeType === "AVL") {
            avl_SetNodesCoordinates(root, startX); // Executa direto
        } else {
            bst_setNodesCoordinates(root, startX); // Executa direto
        }
    }

    // ------------------- HISTORICO ANTERIOR ------------------ //
    const [history, setHistory] = useState([]);
    

    // ------------------- OPERAÇÕES ------------------ //
    const [operationInfo, setOperationInfo] = useState(""); // Informação da operação atual

    // ------------------- ANIMAÇÃO ------------------ //

    const [isOnAnimation, setIsOnAnimation] = useState(false); // Se está em animação

    const [scope, animate] = useAnimate();

    const [animSpeed, setAnimSpeed] = useState(3); // Velocidade da animação

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

    const [sequences, setSequences] = useState({
        externQueue: [], // Fila externa -> Não participa da lógica da árvore, só para visualização
        insertQueue: [], // Fila para inserção
        nodeQueue: [], // Fila da sequência de nós inseridos
    }); 
    

    // ------------------ CONFIGURAÇÕES DO MUNDO DA ÁRVORE ------------------ //

    const WORLD_WIDTH = 4000;  // Largura gigante
    const WORLD_HEIGHT = 2000; // Altura gigante
    const START_X = WORLD_WIDTH / 2; // O centro do mundo (2000px)
    
    const containerRef = useRef(null); // 1. Crie a referência
    const { events, style: dragStyle } = useDraggableScroll(containerRef);
    
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

        Muda o rawText e o vizQueue (fila que o usuário vê)
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

        // Remove o valor da árvore (se existir)

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
            // A. Indica que achou o nó a ser removido
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

            // 2. Se houver um SUCESSOR (Caso de 2 filhos), faz a "transferência de alma"
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

    return (
        <div>
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
                        onClick={isOnAnimation ? undefined : handleQueueChange} 
                        label={t('insertValuesQueueLabel')}
                        extraStyles={isOnAnimation ? style.buttonExtraStyle : undefined} 
                        haveIsOverStyle={isOnAnimation ? false : true}
                    />
                </div>
            </div>
            
            {/* 1. MOLDURA FIXA DA ÁRVORE */}
            <div style={{ 
                position: 'relative', 
                width: '90%', 
                height: '580px', 
                border: '1px solid #ccc',
                overflow: 'hidden', 
                margin: '0 auto' 
            }}>

                {/* 2.1 TOOLBOX FLUTUANTE -> ESQUERDA */}
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
                        onClick={isOnAnimation ? undefined : handleNextStep} 
                        label={t('stepButtons.nextLabel')} 
                        extraStyles={`${style.toolButton} ${isOnAnimation ? style.buttonExtraStyle : ''}`} 
                        haveIsOverStyle={isOnAnimation ? false : true}
                    />

                    <ReactiveButton 
                        onClick={isOnAnimation ? undefined : returnToPreviousState} 
                        label={t('stepButtons.previousLabel')} 
                        extraStyles={`${style.toolButton} ${isOnAnimation ? style.buttonExtraStyle : ''}`} 
                        haveIsOverStyle={isOnAnimation ? false : true}
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
                        onClick={isOnAnimation ? undefined : () => { resetAll(); resetHistory(); }} 
                        label={t('resetTreeButtonLabel')} 
                        extraStyles={`${style.toolButton} ${isOnAnimation ? style.buttonExtraStyle : ''}`} 
                        haveIsOverStyle={isOnAnimation ? false : true}
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
                        >
                        </InputField>

                        <ReactiveButton 
                            onClick={isOnAnimation ? undefined : handleRemoveValue} 
                            label={t('removalCard.buttonLabel')}
                            extraStyles={`${style.toolButton} ${style.toolRemoveButton} ${isOnAnimation ? style.buttonExtraStyle : ''}`} 
                            haveIsOverStyle={isOnAnimation ? false : true}
                        />
                    </div>
                
                    <ReactiveButton 
                        onClick={resetView} 
                        label={t('resetViewButtonLabel')} 
                        extraStyles={`${style.toolButton}`} 
                    />

                    <ReactiveButton 
                        onClick={skipSteps} 
                        label={t('skipStepsButtonLabel')} 
                        extraStyles={`${style.toolButton}`} 
                    />
                </div>
                    
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
                    <div className={style.queueInfo}>
                        {t('queueInfo.insertQueue')}: {sequences.insertQueue.length > 0 ? sequences.insertQueue.join(", ") : t("queueInfo.empty")}
                    </div>
                    <div className={style.queueInfo}>
                    {t('queueInfo.nodeQueue')}: {sequences.nodeQueue.length > 0 ? sequences.nodeQueue.join(", ") : t("queueInfo.empty")}
                    </div>
                </div>

                {/* 2.3 INFO */}
                <motion.div
                    key={operationInfo}
                    className={style.treeInfoStyle} 
                    style={{
                        position: 'absolute', 
                        top: '10px',    
                        left: '230px',
                        zIndex: 11, 
                        width: '215px', 
                        userSelect: 'none',
                        pointerEvents: 'auto' 
                    }}
                    initial={{ opacity: 0 }} // Começa em 0
                    animate={{ opacity: [0, 1, 0] }} // 3 etapas: 0 -> 1 -> 0
                    transition={{ duration: 2, times: [0, 0.3, 1] }} // Passa para 1 em 30% do tempo, depois some até 2s
                >
                    {operationInfo}
                </motion.div>

                {/* 3. CONTAINER SCROLL */}
                <div 
                    ref={containerRef} 
                    className={style.treeContainer} 
                    {...events}  
                    style={{ 
                        position: 'relative',
                        width: '100%',   // Enche a moldura
                        height: '100%',  // Enche a moldura
                        overflow: 'hidden', 
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

                        {/* O Viajante (Animação) */}
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
            </div>
        </div>
        
    )
}

