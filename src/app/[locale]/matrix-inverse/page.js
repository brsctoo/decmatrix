import SquareMatrixArticle from "@/components/matrices/SquareOperation/SquareMatrixArticle";
import { generateSeo } from "@/utils/Seo";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return await generateSeo(locale, 'matrixInverse', 'matrix-inverse');
}

export default async function MatrixInversePage({ params }) {
    const { locale } = await params;
    return <SquareMatrixArticle locale={locale} operation="inverse" />;
}
