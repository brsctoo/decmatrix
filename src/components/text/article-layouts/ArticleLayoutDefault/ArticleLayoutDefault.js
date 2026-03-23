import styles from "./ArticleLayoutDefault.module.css";
import TextGenericDesigns from '../../TextGenericDesigns.module.css';

export default function ArticleLayoutDefault({ children, title }) {
  return (
    <div className={`${styles.articleLayoutDefault} ${TextGenericDesigns.article}`}>
      <article>
          <h3>{title}</h3>
          {children}
      </article>
    </div>
  );
}

