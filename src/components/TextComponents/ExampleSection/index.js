import styles from "./ExampleSection.module.css";

export default function ExampleSection({children, title}) {
    return (
        <div className={styles.exampleSection}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}
