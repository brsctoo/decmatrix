{/* 
    Pega uma entrada do tipo { "A": "Matriz de rotação", "B": "Matriz de translação" } e exibe uma legenda com os símbolos e suas descrições.
    - Object.entries() transforma a estrutura em um array de pares [chave, valor], que pode ser mapeado para renderizar cada item da legenda.
    - Cada item da legenda é composto por um símbolo (a chave do objeto) e sua descrição (o valor do objeto).
    - A legenda é estilizada usando CSS para organizar os símbolos e descrições de forma clara e visualmente agradável.
*/}

import styles from "./SymbolLegend.module.css";

export default function SymbolLegend({
    symbols = {},
    renderSymbol,
}) {
    return (
        <div>
            {symbols != null && (
                <div className={styles.legendContainer}>
                    {Object.entries(symbols).map(([symbol, description]) => (
                        <div key={symbol} className={styles.legendItem}>
                            <span className={styles.symbol}>
                                {renderSymbol ? renderSymbol(symbol) : symbol}
                            </span>
                            <span className={styles.description}>{description}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


    

