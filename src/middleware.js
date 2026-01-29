import createMiddleware from 'next-intl/middleware';
import { languages } from '../constants/language';

export default createMiddleware({
  // A lista de todas as línguas que seu site suporta
  locales: languages,
 
  // Se o usuário entrar e a gente não souber a língua dele,
  // ou se ele for um robô do Google, manda para o Português.
  defaultLocale: 'en'
});
 
export const config = {
  // O Matcher diz para o Next.js: "Só rode esse middleware nas páginas do site".
  // Ele ignora imagens, arquivos de API, ícones, arquivos do Next (_next), etc.
  matcher: ['/', '/(pt|en)/:path*']
};