import styles from "./ArticleLayoutSplit.module.css";
import TextGenericDesigns from '../../TextGenericDesigns.module.css';

export default function ArticleLayoutSplit({ children, title }) {
  return (
    <div className={`${styles.articleLayoutSplit} ${TextGenericDesigns.article}`}>
        <h3>{title}</h3>
        {children}
    </div>
  );
}

