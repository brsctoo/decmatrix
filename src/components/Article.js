import styles from "./Article.module.css";

function Article({title, children, variant="full"}) {
  return (
    <article className={`${styles.article} ${styles[variant]}`}>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </article>
  );
}

export default Article;

