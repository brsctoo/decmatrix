// src/components/TreePreview/TreePreview.jsx
"use client"; // Isso aqui avisa: "Next, vou usar o navegador!"

import style from "./TreePreview.module.css";
import HighlightSection from "@/components/text/HighlightSection/HighlightSection";
import BinaryTree from "@/components/data-structures/BinaryTree/BinaryTree";
import { useIsMobile } from "@/context/ViewportContext";

// Recebemos o título e a descrição por Props! Sem async, sem await.
export default function TreePreview({ title, description }) {
    const isMobile = useIsMobile();

    if (isMobile) return null;

    return ( 
        <div>
            <HighlightSection>
                <div className={style.binaryTreePreviewSection}>
                    <div className={style.binaryTreePreviewText}>
                        {/* Usamos as props que vieram do servidor */}
                        <h2 className={style.binaryTreePreviewTitle}>{title}</h2>
                        <p className={style.binaryTreePreviewDescription}>{description}</p>
                    </div>

                    <div className={style.binaryTreePreviewTree}>
                        <BinaryTree 
                            treeType="BST"
                            preview={true}
                            style={{ overflow: "visible" }}
                        />
                    </div>
                </div>
            </HighlightSection>
        </div> 
    );
}