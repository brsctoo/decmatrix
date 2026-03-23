{/* Serve somente para o display de uma matriz objeto, ou seja, não permite edição */}
import styles from "./Display.module.css";

export default function Display({ 
  matrix,
  otherClasses = "" // Permite passar outras classes para customização
  }) {
  return (
    <div>
      <div className={`${styles.matrixContainerDisplay} ${otherClasses}`}>
        <div className={styles.matrixInner}>
          <div className={styles.bracketLeft}></div>
          <div 
            className={styles.grid} 
            style={{ "--grid-cols": matrix.cols }}
          >
            {matrix.data.map((row, r) => 
              row.map((val, c) => (
                <div 
                  key={`res-${r}-${c}`} 
                  className={styles.cellDisplay}
                >
                  {val}
                </div>
              ))
            )}
          </div>

          <div className={styles.bracketRight}></div>
        </div>
      </div>
    </div>
  );
}
