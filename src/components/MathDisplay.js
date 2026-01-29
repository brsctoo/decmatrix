import 'katex/dist/katex.min.css'; // <--- OBRIGATÓRIO: Importa as fontes bonitas
import { BlockMath, InlineMath } from 'react-katex';

function MathDisplay({ equation, inline = false }) {
  if (inline) {
    return <InlineMath math={equation} />;
  }
  return <BlockMath math={equation} />;
}

export default MathDisplay;