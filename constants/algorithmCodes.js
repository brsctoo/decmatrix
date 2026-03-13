export const sortCodes = {
    bubbleSort: {
    pt: `const bubbleSort = (arr) => {
    // Laço externo que garante que a varredura aconteça N vezes
    for (let i = 0; i < arr.length; i++) {
        // Laço interno ignora os últimos elementos já ordenados
        for (let j = 0; j < arr.length - i - 1; j++) {
            // Se o atual for maior que o próximo, troca!
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
};`,
    en: `const bubbleSort = (arr) => {
    // Outer loop ensures the sweep happens N times
    for (let i = 0; i < arr.length; i++) {
        // Inner loop ignores the last already sorted elements
        for (let j = 0; j < arr.length - i - 1; j++) {
            // If the current is greater than the next, swap!
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
};`
},
    bubbleSortOptimized: {
    pt: `const bubbleSort = (arr) => {
    let n = arr.length;
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        
        // Percorre apenas a parte não ordenada
        for (let j = 0; j < n - i - 1; j++) {
            // Se o atual for maior que o próximo, troca!
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // Se não houve troca no loop interno, já está ordenado
        if (!swapped) break;
    }
    
    return arr;
};`,
    en: `const bubbleSort = (arr) => {
    let n = arr.length;
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        
        // Iterate only through the unsorted part 
        for (let j = 0; j < n - i - 1; j++) {
            // If the current is greater than the next, swap!
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // Break if already sorted
        if (!swapped) break;
    }
    
    return arr;
};`
},
    insertionSort: {
    pt: `const insertionSort = (arr) => {
    // Assume que a primeira posição já está ordenada
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        
        // Troca com o elemento da esquerda enquanto for menor
        while (j > 0 && arr[j - 1] > arr[j]) {
            [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
            j--;
        }
    }
    return arr;
};`,
    en: `const insertionSort = (arr) => {
    // Assume the first position is already sorted
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        
        // Keep swapping with the left element while it is smaller
        while (j > 0 && arr[j - 1] > arr[j]) {
            [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
            j--;
        }
    }
    return arr;
};`
},
    selectionSort: {
    pt: `const selectionSort = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        
        // Varre o restante do array procurando o menor elemento
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Se o menor elemento não for o atual, realiza a troca
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    
    return arr;
};`,
    en: `const selectionSort = (arr) => {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        
        // Scan for the smallest element
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // If needed, swap it into position
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    
    return arr;
};`
}
};