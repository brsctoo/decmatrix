import { getTranslations } from "next-intl/server";

export async function generateSeo(locale, namespace) {
  const t = await getTranslations({ locale, namespace });
  
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  };
}