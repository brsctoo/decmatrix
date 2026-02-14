import 'katex/dist/katex.min.css'; // <--- OBRIGATÓRIO: Importa as fontes bonitas
import { BlockMath, InlineMath } from 'react-katex';

export function MathDisplayEquation({ equation, inline = false, className = "" }) {
  if (inline) {
    return <InlineMath math={equation} className={className} />;
  }
  return <BlockMath math={equation} className={className} />;
}

export function FractionDisplay({ numerator, denominator }) {
  const fraction = `\\frac{${numerator}}{${denominator}}`;
  return <InlineMath math={fraction} />;
}