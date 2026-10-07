import styles from "./ArticleLayoutDefault.module.css";
import TextGenericDesigns from '../../TextGenericDesigns.module.css';

export default function ArticleLayoutDefault({ children, title, heading = 'h3' }) {
  const Heading = heading;
  return (
    <div className={`${styles.articleLayoutDefault} ${TextGenericDesigns.article}`}>
      <article>
          <Heading className={heading === 'h3' ? undefined : styles.sectionTitle}>{title}</Heading>
          {children}
      </article>
    </div>
  );
}

