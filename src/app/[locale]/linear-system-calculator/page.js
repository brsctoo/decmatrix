import LinearCalculator from '@/components/pre-calculus/LinearCalculators/LinearCalculator';
import LinearArticle from '@/components/pre-calculus/LinearCalculators/LinearArticle';
import { generateSeo } from '@/utils/Seo';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return generateSeo(locale, 'LinearSystemCalculator', 'linear-system-calculator');
}
export default async function Page({ params }) {
    const { locale } = await params;
    return <div><LinearCalculator system /><LinearArticle locale={locale} system /></div>;
}
