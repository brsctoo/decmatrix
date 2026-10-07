import SquareMatrixArticle from "@/components/matrices/SquareOperation/SquareMatrixArticle";
import { generateSeo } from "@/utils/Seo";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return await generateSeo(locale, 'matrixDeterminant', 'matrix-determinant');
}

export default async function MatrixDeterminantPage({ params }) {
    const { locale } = await params;
    return <SquareMatrixArticle locale={locale} operation="determinant" />;
}
