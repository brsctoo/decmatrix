// IDs locais para as barras da animação; não precisam ser criptográficos.
let nextItemId = 0;

export function getNumbersFromInput(input) {
    return input
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num))
        .map(num => ({ id: `sort-item-${nextItemId++}`, value: num }));
}
