import PracticePage from '@/components/computational_math/Exercises/PracticePage';
import { generateSeo } from '@/utils/Seo';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return generateSeo(locale, 'BaseConversionExercises', 'base-conversion-exercises');
}

export default async function Page({ params }) {
    const { locale } = await params;
    return <PracticePage locale={locale} kind="base" />;
}
