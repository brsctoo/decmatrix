import styles from './page.module.css';

const TERMS_CONTENT = {
  title: 'Termos de Uso',
  sections: [
    {
      heading: '1. Aceitação dos Termos',
      paragraphs: [
        'Ao acessar e utilizar o site Decimatrix, você concorda em cumprir e estar vinculado a estes termos e condições. Se você não concorda com qualquer parte destes termos, não deve utilizar nossas ferramentas.'
      ]
    },
    {
      heading: '2. Isenção de Responsabilidade (Disclaimer)',
      paragraphs: [],
      highlight: {
        title: 'Importante',
        content: 'As calculadoras e ferramentas fornecidas pelo Decimatrix (incluindo, mas não se limitando a Matriz de Decisão, Juros Compostos e Calculadora Freelancer) são destinadas exclusivamente para fins informativos e educacionais.'
      },
      listItems: [
        'Os resultados gerados são estimativas baseadas em fórmulas matemáticas e entradas do usuário.',
        'O Decimatrix não garante a precisão, integridade ou adequação dos resultados para qualquer situação específica.',
        'Esses cálculos não constituem aconselhamento financeiro, jurídico ou profissional. Sempre consulte um profissional qualificado antes de tomar decisões financeiras importantes.'
      ]
    },
    {
      heading: '3. Limitação de Responsabilidade',
      paragraphs: [
        'Em nenhuma circunstância o Decimatrix ou seus proprietários serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar as ferramentas do site.'
      ]
    },
    {
      heading: '4. Uso das Ferramentas',
      paragraphs: [
        'O usuário compromete-se a utilizar o site de forma ética, não tentando subverter os sistemas lógicos, introduzir softwares maliciosos ou utilizar scripts automatizados para extrair dados das ferramentas.'
      ]
    },
    {
      heading: '5. Modificações',
      paragraphs: [
        'O Decimatrix pode revisar estes termos de uso a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão vigente desses termos.'
      ]
    }
  ],
  effectiveLabel: 'Estes termos são regidos e interpretados de acordo com as leis vigentes e entram em vigor em ',
  effectiveDate: '30 de dezembro de 2025'
};

export const metadata = {
  title: 'Termos de Uso | Decimatrix',
  description: 'Condições de uso das ferramentas e serviços oferecidos pelo Decimatrix.'
};

export default function TermsOfUsePage() {
  return (
    <main className={styles.termsContainer}>
      <header className={styles.header}>
        <h1>{TERMS_CONTENT.title}</h1>
      </header>

      {TERMS_CONTENT.sections.map((section, index) => (
        <section className={styles.section} key={`${section.heading}-${index}`}>
          <h2>{section.heading}</h2>
          {section.highlight && (
            <aside className={styles.highlight}>
              <strong>{section.highlight.title}:</strong> {section.highlight.content}
            </aside>
          )}
          {section.paragraphs.map((paragraph, idx) => (
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
          {TERMS_CONTENT.effectiveLabel}
          <strong>{TERMS_CONTENT.effectiveDate}</strong>.
        </p>
      </footer>
    </main>
  );
}