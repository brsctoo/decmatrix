// Mesma ordem do gerador: F…F primeiro, variável à direita alternando mais rápido.
export function createTruthTableLogic(variables) {
    const table = [[...variables]];
    for (let i = 0; i < 2 ** variables.length; i++) {
        table.push(variables.map((_, j) =>
            Math.floor(i / (2 ** (variables.length - 1 - j))) % 2 === 0 ? 'F' : 'T'));
    }
    return table;
}
