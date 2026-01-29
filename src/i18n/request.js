import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { languages } from '../../constants/language';

// As línguas que seu site aceita (deve bater com o middleware)
const locales = languages; // Importe do arquivo de constantes

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Pega a língua que o Middleware detectou na URL
  let locale = await requestLocale;

  // 2. Se a língua não for válida (ex: o usuário digitou /de/...), valida ou usa padrão
  if (!locale || !locales.includes(locale)) {
      // Mandar para 404
      notFound(); 
  }

  return {
    locale,
    // 3. Importa o JSON correto (en.json ou pt.json)
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});