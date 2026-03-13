import SortAlgorithms from '@/components/SortComponents/SortAlgorithms';
import { useTranslations} from 'next-intl';
import JsonLd from '@/components/JsonLd';


import ArticleLayoutDefault from "@/components/TextComponents/ArticleLayouts/ArticleLayoutDefault";
import styles from "./page.module.css";
import TextGenericDesigns from '@/components/TextComponents/TextGenericDesigns.module.css';
import HighlightSection from '@/components/TextComponents/HighlightSection';
import ParagraphSection from '@/components/TextComponents/ParagraphSection';
import ProprietiesList from '@/components/TextComponents/ProprietiesList';
import StepsList from '@/components/TextComponents/StepsList';
import FAQ from "@/components/TextComponents/FAQ";

export default function InsertionSortPage() {
    const t = useTranslations("sortAlgorithmsPages.insertionSort");

    return (
        <div style={{ padding: '20px' }}>
            <JsonLd dataName="insertionSort" />
            <div className={TextGenericDesigns.pagesMainTitle}>{t("mainTitle")}</div>

            <SortAlgorithms type='insertion'/>

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