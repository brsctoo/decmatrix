import styles from "./DefaultList.module.css";
import { MathDisplayEquation } from "../../MathDisplay";

export default function DefaultList({
    itens = [], // ["Passo 1: Faça isso", "Passo 2: Faça aquilo"]
    subDefaultListStyle=""
}) {
    return (
        <div className={`${styles.defaultList} ${subDefaultListStyle}`}>
            <ol>
                {itens.map((item, i) => (
                    <li key={i}>
                        {item.content}

                        {item.subItens && (
                            <DefaultList itens={item.subItens.map(i => ({ content: i }))} subDefaultListStyle={styles.subDefaultListStyle} />
                        )}

                        {item.equations && (
                            <MathDisplayEquation equations={item.equations} />
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}