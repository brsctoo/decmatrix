{/* O arquivo robots.js é responsável por configurar as regras para os motores de busca (como o Google) sobre como eles devem rastrear e indexar o site. Ele define quais partes do site podem ser acessadas pelos bots e quais partes devem ser ignoradas, além de fornecer a localização do sitemap para facilitar a indexação. */}

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'], // Não gasta "crawl budget" com código interno
    },
    sitemap: 'https://decmatrix.com/sitemap.xml',
  }
}