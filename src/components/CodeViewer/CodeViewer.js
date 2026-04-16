import style from "./CodeViewer.module.css";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useIsMobile } from "@/context/ViewportContext"; // Importa o hook para detectar se é mobile

export default function CodeViewer({ code, language, activeLines=[1] }) {
    const isMobile = useIsMobile();

    if (isMobile) return null; // Esconde o CodeViewer em telas mobile para evitar problemas de usabilidade
    return (
        <div className={style.codeViewerContainer}>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers={true}
                wrapLines={true}
                customStyle={{
                    margin: 0,
                    padding: isMobile ? '1rem 0' : '2.5rem 0',
                    fontSize: isMobile ? '0.2rem' : '1.15rem',
                    lineHeight: isMobile ? 1.4 : 1.7,
                    backgroundColor: 'transparent',
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                }}
                lineProps={(lineNumber) => { 
                    const style = { 
                        display: 'block',
                        padding: isMobile ? '0' : '0 2.5rem',
                        transition: 'background-color 0.2s ease, border-left 0.2s ease',
                        borderLeft: '4px solid transparent'
                    }; 
                    
                    if (activeLines.includes(lineNumber)) {
                        style.backgroundColor = 'rgba(0, 185, 71, 0.12)';
                        style.borderLeft = '4px solid #00b947';
                    }
                    return { style };
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}