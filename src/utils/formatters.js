/*
Formata valores numéricos
*/

export const formatMoneyValue = (value, locale = 'en') => {
    {/* Formata valores numéricos para exibição (Ex: "1250" -> "R$ 1.250,00" ou "$1,250.00") */}

    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    
    return value.toLocaleString(locale === 'pt' ? "pt-BR" : "en-US", {
        style: "currency", // Define o estilo como moeda para adicionar o símbolo de moeda apropriado
        currency: locale === 'pt' ? "BRL" : "USD", // Define a moeda com base no locale (coloca o sifrão no formato correto)
        minimumFractionDigits: 2 // Garante que sempre tenha 2 casas decimais, mesmo que o valor seja um número inteiro
    });
};

export const formatMoneyInput = (value, locale = 'en') => {
    {/* Formata inputs numéricos para valor em dinheiro (Ex: "127050" -> "1.270,50" ou "1,270.50") */}

    if (!value) return "";
    
    // Transforma em número e move a vírgula 2 casas (centavos)
    const number = Number(value) / 100;

    return number.toLocaleString(locale === 'pt' ? "pt-BR" : "en-US", {
        minimumFractionDigits: 2, // Garante que sempre tenha 2 casas decimais, mesmo que o usuário não tenha digitado
        maximumFractionDigits: 2, // Limita a 2 casas decimais para evitar que o usuário digite mais do que o necessário
    });
};