export const toNum = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        // Remove espaços e troca vírgula por ponto IMEDIATAMENTE
        const cleaned = val.trim().replace(',', '.');
        if (cleaned === '' || cleaned === '-' || cleaned === '.') return 0;

        if (cleaned.includes('/')) {
            const [n, d] = cleaned.split('/').map(Number);
            return d !== 0 ? n / d : 0;
        }
        return parseFloat(cleaned) || 0;
    } 
    return parseFloat(val) || 0;
};

export const toFraction = (decimal) => {
    const absDec = Math.abs(decimal);

    // 1. Tratamento de Zero e Inteiros
    if (absDec < 1e-10) return "0";
    if (Number.isInteger(decimal)) return decimal.toString();

    // 3. Isolar o sinal para o Algoritmo de Frações Contínuas
    const sign = decimal < 0 ? "-" : "";
    let n = absDec;
    let upper_n = 1, upper_d = 0; 
    let lower_n = 0, lower_d = 1; 
    
    const max_error = 1e-9;
    
    while (true) {
        let a = Math.floor(n);
        
        let aux_n = upper_n; 
        upper_n = a * upper_n + lower_n; 
        lower_n = aux_n;

        let aux_d = upper_d; 
        upper_d = a * upper_d + lower_d; 
        lower_d = aux_d;
        
        // Se a fração atual for precisa o suficiente, paramos
        if (Math.abs(absDec - upper_n / upper_d) < max_error) break;
        
        // Prepara para a próxima iteração
        n = 1 / (n - a);
        
        // Se o denominador ficar complexo demais, paramos para evitar frações feias
        if (upper_d > 10000) break;
    }

    // 4. Retorno final (evita retornar algo como "5/1")
    if (upper_d === 1) return `${sign}${upper_n}`;

    return `${sign}${upper_n}/${upper_d}`;
};

const MathUtils = {
    toNum,
    toFraction
};

export default MathUtils;