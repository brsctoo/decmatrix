import styles from './page.module.css';

const PRIVACY_CONTENT = {
  title: 'Política de Privacidade',
  intro: 'A sua privacidade é importante para nós. É política do Decimatrix respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no {link} e em outros sites que possuímos e operamos.',
  linkLabel: 'Decimatrix',
  paragraphs: [
    'Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemos isso por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.',
    'Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas, roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.',
    'Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.',
    'Nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.',
    'Você é livre para recusar nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.'
  ],
  cookiesHeading: 'Cookies e Google AdSense',
  cookiesItems: [
    'O serviço Google AdSense que usamos para veicular publicidade utiliza um cookie DoubleClick para exibir anúncios mais relevantes em toda a web e limitar o número de vezes que um anúncio específico é mostrado para você.',
    'Para mais informações sobre o Google AdSense, consulte as FAQs oficiais sobre privacidade do Google AdSense.',
    'Utilizamos anúncios para compensar os custos de funcionamento deste site e financiar desenvolvimentos futuros. Os cookies de publicidade comportamental usados por este site foram projetados para garantir que apresentemos os anúncios mais relevantes sempre que possível.',
    'Vários parceiros anunciam em nosso nome e os cookies de rastreamento de afiliados simplesmente nos permitem ver se nossos usuários acessaram o site por meio de um dos sites de nossos parceiros.'
  ],
  commitmentHeading: 'Compromisso do Usuário',
  commitmentIntro: 'O usuário se compromete a fazer uso adequado dos conteúdos e das informações que o Decimatrix oferece no site, em caráter enunciativo, mas não limitativo:',
  commitmentItems: [
    'a) Não se envolver em atividades que sejam ilegais ou contrárias à boa-fé e à ordem pública;',
    'b) Não difundir propaganda ou conteúdo de natureza racista, xenófoba ou contra os direitos humanos;',
    'c) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Decimatrix ou introduzir e disseminar vírus informáticos.'
  ],
  moreInfoHeading: 'Mais informações',
  moreInfoParagraph: 'Esperamos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados caso interaja com alguma funcionalidade do nosso site.'
};

export const metadata = {
  title: 'Política de Privacidade | Decimatrix',
  description: 'Saiba como o Decimatrix coleta, usa e protege os seus dados.'
};

export default function PrivacyPolicyPage() {
  const introParts = PRIVACY_CONTENT.intro.split('{link}');

  return (
    <main className={styles.privacyContainer}>
      <header className={styles.header}>
        <h1>{PRIVACY_CONTENT.title}</h1>
        <p>
          {introParts[0]}
          <a
            href="https://www.decmatrix.com"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {PRIVACY_CONTENT.linkLabel}
          </a>
          {introParts[1]}
        </p>
      </header>

      <section className={styles.section}>
        {PRIVACY_CONTENT.paragraphs.map((paragraph, index) => (
          <p key={`privacy-paragraph-${index}`}>{paragraph}</p>
        ))}
      </section>

      <section className={styles.section}>
        <h2>{PRIVACY_CONTENT.cookiesHeading}</h2>
        <ul className={styles.list}>
          {PRIVACY_CONTENT.cookiesItems.map((item, index) => (
            <li key={`privacy-cookie-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{PRIVACY_CONTENT.commitmentHeading}</h2>
        <p>{PRIVACY_CONTENT.commitmentIntro}</p>
        <ul className={styles.list}>
          {PRIVACY_CONTENT.commitmentItems.map((item, index) => (
            <li key={`privacy-commitment-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>{PRIVACY_CONTENT.moreInfoHeading}</h2>
        <p>{PRIVACY_CONTENT.moreInfoParagraph}</p>
      </section>
    </main>
  );
}