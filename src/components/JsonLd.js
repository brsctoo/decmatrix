import { useParams } from "next/navigation";
import { schemas } from "@/../constants/schemas";

export default function JsonLd({ dataName }) {
    const { locale } = useParams();

    const data = schemas[dataName][locale];

    return (
        <script
            type="application/ld+json"
            // O JSON.stringify é necessário para transformar o objeto JavaScript em uma string JSON.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} 
        />
    );
}