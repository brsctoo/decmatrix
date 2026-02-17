// Arquivo de acordo como o tutorial do google para colocar o GA4

'use client'; // Essencial para rodar no navegador

import Script from 'next/script';

const GoogleAnalytics = () => {
  return (
    <>
      {/* Script principal do Google Tag */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-9Z0ZRF95K0"
      />
      {/* Script de configuração */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9Z0ZRF95K0');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;