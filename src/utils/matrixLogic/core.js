{/* Implementação do núcleo da matrix. Criação dela, clonar matriz, validar... */}

export class Matrix {
    constructor(rows, cols) {
        this.rows = rows; // Quantidade de linhas
        this.cols = cols; // Quantidade de colunas
        this.data = this.createEmptyMatrix(rows, cols);
        this.name = ""; // Nome da matriz, para exibição e identificação (ex: A, B, C)
    }

    createEmptyMatrix(rows, cols) {
        {/* Cria uma matriz 2D preenchida com zeros 
            
            Exemplo para 3x3:
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]
        */}
        
        const matrix = [];

        for (let i = 0; i < rows; i++) {
            const row = new Array(cols).fill(0);
            matrix.push(row);
        }
        return matrix;
    }

    changeCellValue(row, col, value) {
        {/* Altera o valor de uma célula específica na matriz */}
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.data[row][col] = value;
        }
    }

    resize() {
        {/* Redimensiona a matriz para um novo número de linhas e colunas, mantendo os dados existentes quando possível */}
        const newData = this.createEmptyMatrix(this.rows, this.cols);

        // Copia os dados existentes para a nova matriz, respeitando os limites do novo tamanho
        for (let i = 0; i < this.rows; i++) { 
            for (let j = 0; j < this.cols; j++) {
                newData[i][j] = this.data[i]?.[j] ?? 0; // Usa o valor existente ou 0 se a posição for nova
            }
        }

        // Atualiza as propriedades da matriz para refletir o novo tamanho e os dados redimensionados
        this.data = newData;
    }
}