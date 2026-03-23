import SortAlgorithms from '@/components/data-structures/SortComponents/SortAlgorithms/SortAlgorithms';
import { getTranslations } from "next-intl/server";
import JsonLd from '@/components/JsonLd';
import { generateSeo } from "@/utils/Seo";


import ArticleLayoutDefault from "@/components/text/article-layouts/ArticleLayoutDefault/ArticleLayoutDefault";
import TextGenericDesigns from '@/components/text/TextGenericDesigns.module.css';
import HighlightSection from '@/components/text/HighlightSection/HighlightSection';
import ParagraphSection from '@/components/text/ParagraphSection/ParagraphSection';
import ProprietiesList from '@/components/text/ProprietiesList/ProprietiesList';
import StepsList from '@/components/text/StepsList/StepsList';
import FAQ from "@/components/text/FAQ/FAQ";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    return await generateSeo(locale, "sortAlgorithmsPages.selectionSort");
}

export default async function SelectionSortPage({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "sortAlgorithmsPages.selectionSort" });

    return (
        <div style={{ padding: '20px' }}>
            <JsonLd dataName="selectionSort" />
            <div className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</div>

            <SortAlgorithms type='selection'/>

            <ArticleLayoutDefault title={t("definition.title")}>
                <ParagraphSection
                    paragraphs={[
                        t("definition.content"),
                    ]}
                />
            </ArticleLayoutDefault>
                
            <ArticleLayoutDefault title={t("howWorks.title")}>
                <HighlightSection>
                    <StepsList 
                        steps={t.raw("howWorks.steps").map((_, index) => ({
                            content: t.rich(`howWorks.steps.${index}`, { 
                                strong: (children) => <strong>{children}</strong> 
                            })
                        }))}
                    />
                </HighlightSection>
            </ArticleLayoutDefault>
            
            <ArticleLayoutDefault title={t("contextAndUsage.title")}>
                <ParagraphSection
                    paragraphs={[
                        t.rich("contextAndUsage.content", {
                            strong: (chunks) => <strong>{chunks}</strong>,
                        }),
                    ]}
                />
            </ArticleLayoutDefault>

            <ArticleLayoutDefault title={t("proprieties.title")}>
                <ProprietiesList
                    proprieties={t.raw("proprieties.list").map((_, index) => ({
                        content: t.rich(`proprieties.list.${index}`, {
                            strong: (children) => <strong>{children}</strong>,
                        }),
                    }))}
                />
            </ArticleLayoutDefault>

            <FAQ questions={t.raw("faqSection").map((_, index) => ({
                question: t(`faqSection.${index}.question`),
                answer: t(`faqSection.${index}.answer`),
            }))} />
        </div>
    );
}