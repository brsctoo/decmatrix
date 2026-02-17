/*
Formata valores numéricos
*/

export const formatMoneyValue = (value, locale = 'en') => {
    {/* Formata valores numéricos para exibição (Ex: "1250" -> "R$ 1.250,00" ou "$1,250.00") */}

    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    
    return value.toLocaleString(locale === 'pt' ? "pt-BR" : "en-US", {
        style: "currency", 
        currency: locale === 'pt' ? "BRL" : "USD", 
        minimumFractionDigits: 2 
    });
};

export const formatMoneyInput = (value, locale = 'en') => {
    {/* Formata inputs numéricos para valor em dinheiro (Ex: "127050" -> "1.270,50" ou "1,270.50") */}

    if (!value) return "";
    
    const number = Number(value) / 100;

    return number.toLocaleString(locale === 'pt' ? "pt-BR" : "en-US", {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2, 
    });
};