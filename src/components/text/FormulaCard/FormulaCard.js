import styles from "./FormulaCard.module.css";
import { MathDisplayEquation } from "../../MathDisplay";

export default function FormulaCard({
    equations = [], // String com a fórmula em LaTeX. Ex: "E = mc^2"
}) {
    return (
        <div className={styles.formulaCard}>
            {equations!=null && (
                equations.map((equation, index) => (
                    <div key={index}>
                        <MathDisplayEquation equation={`\\mathbf{${equation}}`} />
                    </div>
                ))
            )}
        </div>
    );
}
    