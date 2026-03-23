import styles from "./ParagraphSection.module.css";

export default function ParagraphSection({paragraphs=[]}) {
    return (
        <div className={styles.paragraphsContainer}>
            {paragraphs!=null && (
                paragraphs.map((paragraph, index) => (
                    <p key={index} className={styles.paragraphSection}>
                        {paragraph}
                    </p>
                ))
            )}
         </div>
    );
}