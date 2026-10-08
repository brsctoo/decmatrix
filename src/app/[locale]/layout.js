import { GeistSans } from "geist/font/sans";

import "./globals.css";
import LateralBar from "../../components/LateralBar/LateralBar";
import Basebord from "../../components/Basebord/Basebord";
import Topbord from "../../components/TopBoard/Topbord";
import { notFound } from "next/navigation";
import { languages } from "../../../constants/language";
import { SITE_URL } from '../../../constants/site';

import { Analytics } from "@vercel/analytics/next";

import GoogleAnalytics from '@/components/GoogleAnalytics';

// IMPORTAÇÕES DO CONTEXTO
import { UIProvider } from "../../context/UIContext";
import { ViewportProvider } from "@/context/ViewportContext";

// IMPORTAÇÕES DO NEXT-INTL
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Decmatrix | Calculadoras Matemáticas e Algoritmos Interativos',
        template: '%s | Decmatrix', // O %s é onde o Next.js vai injetar o nome da página!
    },
    description: 'Decmatrix oferece calculadoras matemáticas interativas e visualizadores de algoritmos online — matrizes, juros compostos, árvores AVL/BST, ordenação e muito mais. Gratuito e sem cadastro.',
    openGraph: {
        type: 'website',
        siteName: 'Decmatrix',
        locale: 'pt_BR',
        alternateLocale: ['en_US'],
    },
    twitter: {
        card: 'summary_large_image',
    },
};

// ASYNC -> Por causa do getMessages()
export default async function RootLayout({ children, params }) {
  // 1. Aguarda os parâmetros
  const { locale } = await params;

  // 2. Validação de segurança
  if (!languages.includes(locale)) {
    notFound();
  }

  // 3. Carrega as mensagens (o JSON) do lado do servidor
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={GeistSans.variable}>
      <body>
        {process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics />
        )}

        <NextIntlClientProvider messages={messages}>
            <UIProvider>
              <ViewportProvider>
                <Topbord />
                <div style={{ marginTop: "130px" }}> {/* Dá um espaçamento para o conteúdo não ficar embaixo do topbord, que é fixo */}
                  {children}
                </div>


                <LateralBar />
                <Basebord />
              </ViewportProvider>
            </UIProvider>

            <Analytics />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}
