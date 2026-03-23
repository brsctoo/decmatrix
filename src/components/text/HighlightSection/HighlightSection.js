import styles from "./HighlightSection.module.css";

export default function highlightSection({children}) {
  return (
    <article className={styles.highlightSection}>
      <div>
        {children}
      </div>
    </article>
  );
}

