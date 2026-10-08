import { getTranslations } from "next-intl/server";
import { SITE_URL } from '../../constants/site';


export async function generateSeo(locale, namespace, slug = '') {
    const t = await getTranslations({ locale, namespace });

    const path = slug ? `/${slug}` : '';

    return {
        title: t('seoTitle'),
        description: t('seoDescription'),
        alternates: {
            canonical: `${SITE_URL}/${locale}${path}`,
            languages: {
                'pt-BR': `${SITE_URL}/pt${path}`,
                'en-US': `${SITE_URL}/en${path}`,
                'x-default': `${SITE_URL}/pt${path}`,
            },
        },
    };
}
