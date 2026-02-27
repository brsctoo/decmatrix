import styles from "./StepsList.module.css";
import { MathDisplayEquation } from "../../MathDisplay";

export default function StepsList({
    steps = [], // ["Passo 1: Faça isso", "Passo 2: Faça aquilo"]
    subStepsStyle=""
}) {
    return (
        <div className={`${styles.stepsList} ${subStepsStyle}`}>
            <ol>
                {steps.map((step, i) => (
                    <li key={i}>
                        {step.content}

                        {step.subSteps && (
                            <StepsList steps={step.subSteps.map(s => ({ content: s }))} subStepsStyle={styles.subStepsStyle} />
                        )}

                        {step.equations && (
                            <MathDisplayEquation equations={step.equations} />
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}