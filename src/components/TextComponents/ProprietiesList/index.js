import styles from "./ProprietiesList.module.css";
import { MathDisplayEquation } from "../../MathDisplay";

export default function ProprietiesList({
    proprieties = [], // ["Passo 1: Faça isso", "Passo 2: Faça aquilo"]
    subProprietiesStyle=""
}) {
    return (
        <div className={`${styles.proprietiesList} ${subProprietiesStyle}`}>
            <ol>
                {proprieties.map((property, i) => (
                    <li key={i}>
                        {property.content}

                        {property.subSteps && (
                            <StepsList proprieties={property.subSteps.map(s => ({ content: s }))} subProprietiesStyle={styles.subProprietiesStyle} />
                        )}

                        {property.equations && (
                            <MathDisplayEquation equations={property.equations} />
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}