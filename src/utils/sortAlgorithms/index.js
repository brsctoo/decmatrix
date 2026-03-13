export function bubbleSort(arrayState, sortStepsRef, setStepsCounter, setStepsAmount, tSteps) {
    let arr = [...arrayState]; 
    const n = arr.length;
    sortStepsRef.current = []; 

    const t = (key, values) => (tSteps ? tSteps(key, values) : "");

    // 1. Inicialização
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('classic.init', { n }),
        activeLines: [2] // let n = arr.length;
    });

    for(let i = 0; i < n - 1; i++) {
        
        // Início da varredura (Alinhado com o otimizado)
        sortStepsRef.current.push({
            array: [...arr],
            activeIndices: [],
            infoMsg: t('classic.startPass', { pass: i + 1, remaining: n - i - 1 }),
            activeLines: [4] // for(let i...
        });

        for(let j = 0; j < n - i - 1; j++) {
            
            // Comparação principal
            sortStepsRef.current.push({
                array: [...arr],
                activeIndices: [j, j + 1],
                infoMsg: t('classic.compare', { left: arr[j].value, right: arr[j + 1].value }),
                activeLines: [7] // if(arr[j] > arr[j + 1])
            });

            if(arr[j].value > arr[j + 1].value) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j+1] = temp;

                // Troca
                sortStepsRef.current.push({
                    array: [...arr],
                    activeIndices: [j, j + 1],
                    infoMsg: t('classic.swap'),
                    activeLines: [8, 9] // Swap
                });
            } else {
                // Não trocou
                sortStepsRef.current.push({
                    array: [...arr],
                    activeIndices: [],
                    infoMsg: t('classic.noSwap'),
                    activeLines: [7] // Fica no if
                });
            }
        }

        // Fim da varredura (Para manter o ritmo igual ao do Otimizado que checa o break)
        sortStepsRef.current.push({
            array: [...arr],
            activeIndices: [],
            infoMsg: t('classic.endPass', { pass: i + 1 }),
            activeLines: [4] // Foca no for do i fechando
        });
    }

    // Fim da ordenação
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('classic.finished'),
        activeLines: [15] // return arr;
    });

    if (setStepsAmount) setStepsAmount(sortStepsRef.current.length);
    if (setStepsCounter) setStepsCounter(0); 
}

export function bubbleSortOtimized(arrayState, sortStepsRef, setStepsCounter, setStepsAmount, tSteps) {
    let arr = [...arrayState]; 
    const n = arr.length;
    let swapped; 

    sortStepsRef.current = []; // Limpa os passos anteriores

    const t = (key, values) => (tSteps ? tSteps(key, values) : "");

    // 1. Inicialização
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('optimized.init', { n }),
        activeLines: [2, 3] // let n = arr.length; let swapped;
    });

    for (let i = 0; i < n - 1; i++) { 
        swapped = false;
        
        // Início da varredura (Laço externo)
        sortStepsRef.current.push({
            array: [...arr],
            activeIndices: [],
            infoMsg: t('optimized.startPass', { pass: i + 1, remaining: n - i - 1 }),
            activeLines: [5, 6] // for(let i...; swapped = false;
        });

        // Laço interno (n - i - 1 garante que não checamos as "bolhas" que já subiram)
        for (let j = 0; j < n - i - 1; j++) { 
            
            // Comparação principal
            sortStepsRef.current.push({
                array: [...arr],
                activeIndices: [j, j + 1],
                infoMsg: t('optimized.compare', { left: arr[j].value, right: arr[j + 1].value }),
                activeLines: [9, 11] // for(let j...; if (arr[j] > arr[j+1])
            });
            
            if (arr[j].value > arr[j + 1].value) {
                // Troca física dos objetos no seu estado React
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;

                // Passo da troca (swap)
                sortStepsRef.current.push({
                    array: [...arr],
                    activeIndices: [j, j + 1],
                    infoMsg: t('optimized.swap'),
                    activeLines: [12, 13] // [arr[j], arr[j+1]]... swapped = true;
                }); 

                swapped = true;
            } else {
                // Passo visual caso não haja troca
                sortStepsRef.current.push({
                    array: [...arr],
                    activeIndices: [],
                    infoMsg: t('optimized.noSwap'),
                    activeLines: [11] // Ilumina só o if para mostrar que a condição falhou
                });
            }
        }

        // Checagem de parada antecipada
        sortStepsRef.current.push({
            array: [...arr],
            activeIndices: [],
            infoMsg: swapped ? t('optimized.endPassSwapped') : t('optimized.endPassNoSwap'),
            activeLines: [18] // if (!swapped) break;
        });

        // O break real que quebra a execução do seu motor invisível
        if (!swapped) break; 
    }

    // Fim da ordenação
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('optimized.finished'),
        activeLines: [21] // return arr;
    });

    if (setStepsAmount) setStepsAmount(sortStepsRef.current.length);
    if (setStepsCounter) setStepsCounter(0); 
}

export function insertionSort(arrayState, sortStepsRef, setStepsCounter, setStepsAmount, tSteps) {
    let arr = [...arrayState]; 
    const n = arr.length;

    sortStepsRef.current = []; 

    const t = (key, values) => (tSteps ? tSteps(key, values) : "");

    // 1. Inicialização
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('insertion.init', { n }),
        activeLines: [3] // for (let i = 1; i < arr.length; i++)
    });

    for (let i = 1; i < n; i++) {
        let j = i;

        // Início da rodada
        sortStepsRef.current.push({
            array: [...arr],
            activeIndices: [j], 
            infoMsg: t('insertion.startPass', { pass: i, value: arr[j].value }),
            activeLines: [4] // let j = i;
        });

        // Vai trocando a carta com a da esquerda enquanto ela for menor
        while (j > 0) {
            sortStepsRef.current.push({
                array: [...arr],
                activeIndices: [j - 1, j],
                infoMsg: t('insertion.compare', { left: arr[j - 1].value, current: arr[j].value }),
                activeLines: [7] // while (j > 0 && arr[j - 1] > arr[j])
            });

            if (arr[j - 1].value > arr[j].value) {
                // MÁGICA AQUI: Usamos SWAP em vez de SHIFT! Nenhum objeto é duplicado.
                const temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j] = temp;
                
                sortStepsRef.current.push({
                    array: [...arr],
                    activeIndices: [j - 1, j],
                    infoMsg: t('insertion.swap', { shifted: arr[j].value }), 
                    activeLines: [8] // [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
                });
                
                j--;
            } else {
                // Achou o lugar! A carta da esquerda já é menor.
                sortStepsRef.current.push({
                    array: [...arr],
                    activeIndices: [j],
                    infoMsg: t('insertion.noShift', { left: arr[j - 1].value }),
                    activeLines: [7] 
                });
                break;
            }
        }

        if (j === 0) {
             sortStepsRef.current.push({
                array: [...arr],
                activeIndices: [0],
                infoMsg: t('insertion.reachedStart'),
                activeLines: [7] 
            });
        }
    }

    // Fim da ordenação
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('insertion.finished'),
        activeLines: [12] // return arr;
    });

    if (setStepsAmount) setStepsAmount(sortStepsRef.current.length);
    if (setStepsCounter) setStepsCounter(0); 
}

export function selectionSort(arrayState, sortStepsRef, setStepsCounter, setStepsAmount, tSteps) {
    let arr = [...arrayState]; 
    const n = arr.length;

    sortStepsRef.current = []; 

    const t = (key, values) => (tSteps ? tSteps(key, values) : "");

    // 1. Inicialização
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('selection.init', { n }),
        activeLines: [2] // for (let i = 0; i < arr.length - 1; i++)
    });

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        // Início da rodada (Define o primeiro como o menor provisório)
        sortStepsRef.current.push({
            array: [...arr],
            activeIndices: [minIndex], 
            infoMsg: t('selection.startPass', { pass: i + 1, min: arr[minIndex].value }),
            activeLines: [3] // let minIndex = i;
        });

        // O "olheiro" (j) sai correndo pela direita procurando alguém menor
        for (let j = i + 1; j < n; j++) {
            
            // Comparação: O olheiro achou alguém menor que o minIndex atual?
            sortStepsRef.current.push({
                array: [...arr],
                activeIndices: [j, minIndex], // Mostra o olheiro e o menor atual
                infoMsg: t('selection.compare', { current: arr[j].value, min: arr[minIndex].value }),
                activeLines: [7] // if (arr[j] < arr[minIndex])
            });

            if (arr[j].value < arr[minIndex].value) {
                minIndex = j;
                
                // Encontrou um novo menor!
                sortStepsRef.current.push({
                    array: [...arr],
                    activeIndices: [minIndex], // Destaca o novo menor
                    infoMsg: t('selection.newMin', { newMin: arr[minIndex].value }),
                    activeLines: [8] // minIndex = j;
                });
            }
        }

        // Fim da varredura: vamos ver se precisamos trocar
        sortStepsRef.current.push({
            array: [...arr],
            activeIndices: [i, minIndex], 
            infoMsg: t('selection.checkSwap', { target: arr[i].value, min: arr[minIndex].value }),
            activeLines: [13] // if (minIndex !== i)
        });

        if (minIndex !== i) {
            // Troca (Swap) o menor de todos com o cara que estava na posição alvo
            const temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;

            sortStepsRef.current.push({
                array: [...arr],
                activeIndices: [i, minIndex], // Mostra os dois que trocaram de lugar
                infoMsg: t('selection.swap', { min: arr[i].value }),
                activeLines: [14] // [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            });
        } else {
            // O menor já estava no lugar certo
            sortStepsRef.current.push({
                array: [...arr],
                activeIndices: [i],
                infoMsg: t('selection.noSwap', { min: arr[i].value }),
                activeLines: [13] // Fica no if para mostrar que deu falso
            });
        }
    }

    // Fim da ordenação
    sortStepsRef.current.push({
        array: [...arr],
        activeIndices: [],
        infoMsg: t('selection.finished'),
        activeLines: [18] // return arr;
    });

    if (setStepsAmount) setStepsAmount(sortStepsRef.current.length);
    if (setStepsCounter) setStepsCounter(0); 
}