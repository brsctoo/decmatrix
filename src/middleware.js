import createMiddleware from 'next-intl/middleware';
import { languages } from '../constants/language';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  // A lista de todas as línguas que seu site suporta
  locales: languages,
 
  // Sem idioma negociável, o padrão atual é inglês.
  defaultLocale: 'en',
  // generateSeo supplies the complete reciprocal HTML alternates. Automatic
  // Link headers used the request host and unprefixed (404) x-default paths.
  alternateLinks: false
});

const legacyPaths = new Set([
  '/insertion-sort', '/privacy-policy', '/avl-tree-builder', '/truth-table-generator'
]);

export default function middleware(request) {
  if (legacyPaths.has(request.nextUrl.pathname)) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/en${request.nextUrl.pathname}`;
    return NextResponse.redirect(destination, 308);
  }
  return intlMiddleware(request);
}
 
export const config = {
  // O Matcher diz para o Next.js: "Só rode esse middleware nas páginas do site".
  // Ele ignora imagens, arquivos de API, ícones, arquivos do Next (_next), etc.
  matcher: ['/', '/(pt|en)/:path*', '/insertion-sort', '/privacy-policy', '/avl-tree-builder', '/truth-table-generator']
};
