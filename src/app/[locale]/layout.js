import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

import { GeistSans } from "geist/font/sans";

import "./globals.css";
import LateralBar from "../../components/LateralBar";
import Basebord from "../../components/Basebord";
import Topbord from "../../components/Topbord";
import { notFound } from "next/navigation";
import { languages } from "../../../constants/language";

import { Analytics } from "@vercel/analytics/next";

import GoogleAnalytics from '@/components/GoogleAnalytics';

// IMPORTAÇÕES DO CONTEXTO
import { UIProvider } from "../../context/UIContext";
import { ViewportProvider } from "@/context/ViewportContext";

// IMPORTAÇÕES DO NEXT-INTL
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata = {
  title: {
    default: 'Decmatrix | Calculadoras Matemáticas e Algoritmos Interativos',
    template: '%s | Decmatrix', // O %s é onde o Next.js vai injetar o nome da página!
  },
  description: 'Resolva problemas matemáticos e visualize algoritmos em tempo real.',
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