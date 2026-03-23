import styles from './page.module.css';
import { getTranslations } from 'next-intl/server';
import { generateSeo } from "@/utils/Seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return await generateSeo(locale, "TermsOfUse");
}

export default async function TermsOfUsePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "TermsOfUse" });

  const sections = t.raw('sections') || [];
  const effectiveLabel = t('effective');
  const effectiveDate = t('effectiveDate');

  return (
    <main className={styles.termsContainer}>
      <header className={styles.header}>
        <h1>{t('title')}</h1>
      </header>

      {sections.map((section, index) => (
        <section className={styles.section} key={`${section.heading}-${index}`}>
          <h2>{section.heading}</h2>
          {section.highlight && (
            <aside className={styles.highlight}>
              <strong>{section.highlight.title}:</strong> {section.highlight.content}
            </aside>
          )}
          {section.content && (
            <p>{section.content}</p>
          )}
          {section.paragraphs && section.paragraphs.map((paragraph, idx) => (
            <p key={`${section.heading}-paragraph-${idx}`}>{paragraph}</p>
          ))}
          {section.listItems && (
            <ul className={styles.list}>
              {section.listItems.map((item, idx) => (
                <li key={`${section.heading}-item-${idx}`}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <footer className={styles.footer}>
        <p>
          {effectiveLabel}
          <strong>{effectiveDate}</strong>.
        </p>
      </footer>
    </main>
  );
}