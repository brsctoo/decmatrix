import 'katex/dist/katex.min.css'; // <--- OBRIGATÓRIO: Importa as fontes bonitas
import { BlockMath, InlineMath } from 'react-katex';
import styles from './MathDisplay.module.css';

export function MathDisplayEquation({ equation, inline = false, className = "" }) {
  if (inline) {
    return <InlineMath math={equation} className={className} />;
  }
  return <div className={styles.equation} tabIndex={0}><BlockMath math={equation} className={className} /></div>;
}

export function FractionDisplay({ numerator, denominator }) {
  const fraction = `\\frac{${numerator}}{${denominator}}`;
  return <InlineMath math={fraction} />;
}
