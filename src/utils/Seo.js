import { getTranslations } from "next-intl/server";

const BASE_URL = 'https://decmatrix.com';

export async function generateSeo(locale, namespace, slug = '') {
    const t = await getTranslations({ locale, namespace });

    const path = slug ? `/${slug}` : '';

    return {
        title: t('seoTitle'),
        description: t('seoDescription'),
        alternates: {
            canonical: `${BASE_URL}/${locale}${path}`,
            languages: {
                'pt-BR': `${BASE_URL}/pt${path}`,
                'en-US': `${BASE_URL}/en${path}`,
                'x-default': `${BASE_URL}/pt${path}`,
            },
        },
    };
}
