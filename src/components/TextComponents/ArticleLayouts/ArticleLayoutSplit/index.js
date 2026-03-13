import styles from "./ArticleLayoutSplit.module.css";
import TextGenericDesigns from '../../TextGenericDesigns.module.css';

export default function ArticleLayoutSplit({ children, title, type="normalSplit", extraContent}) {
  return (
    <div>
      {type === "normalSplit" && (
        <div className={`${styles.articleLayoutSplit} ${TextGenericDesigns.article}`}>
          <div className={styles.splitTitle}>
            {title && <h3>{title}</h3>}
          </div>

          <div className={styles.splitContent}>
            {children}
          </div>
        </div>
      )}

      {type === "codeSplit" && (
        <div className={`${styles.articleLayoutSplit} ${styles.codeSplit} ${TextGenericDesigns.article}`}>
          
          {/* Lado Esquerdo: Título e Texto */}
          <div className={styles.textSide}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.textContent}>
              {children}
            </div>
          </div>

          {/* Lado Direito: O Visualizador de Código */}
          <div className={styles.visualSide}>
            {extraContent}
          </div>

        </div>
      )}
    </div>
  );
}

