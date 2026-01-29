import styles from './page.module.css';
import { useTranslations } from 'next-intl';

export const metadata = {
  title: 'Política de Privacidade | Decimatrix',
  description: 'Saiba como o Decimatrix coleta, usa e protege os seus dados.'
};

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

  const paragraphs = t.raw('paragraphs') || [];
  const cookiesItems = t.raw('cookiesItems') || [];
  const commitmentItems = t.raw('commitmentItems') || [];


  return (
    <main className={styles.privacyContainer}>
      <header className={styles.header}>
        <h1>{t('title')}</h1>
        <p>{t('intro')}</p>
      </header>

      <section className={styles.section}>
        {paragraphs.map((paragraph, index) => (
          <p key={`privacy-paragraph-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section className={styles.section}>
        <h2>{t('cookiesHeading')}</h2>
        <ul className={styles.list}>
          {cookiesItems.map((item, index) => (
            <li key={`privacy-cookie-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t('commitmentHeading')}</h2>
        <p>{t('commitmentIntro')}</p>
        <ul className={styles.list}>
          {commitmentItems.map((item, index) => (
            <li key={`privacy-commitment-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{t('moreInfoHeading')}</h2>
        <p>{t('moreInfoParagraph')}</p>
      </section>
    </main>
  );
}