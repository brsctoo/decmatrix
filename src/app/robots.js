/*
  O arquivo robots.js é responsável por configurar as regras para os motores de busca
  (como o Google) sobre como eles devem rastrear e indexar o site. Ele define quais
  partes do site podem ser acessadas pelos bots e quais partes devem ser ignoradas,
  além de fornecer a localização do sitemap para facilitar a indexação.
*/
 
import { SITE_URL } from '../../constants/site';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Deixe bloqueado apenas as rotas de API
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
 
