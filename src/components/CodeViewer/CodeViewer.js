import style from "./CodeViewer.module.css";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeViewer({ code, language, activeLines=[1] }) {
    return (
        <div className={style.codeViewerContainer}>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers={true}
                wrapLines={true}
                customStyle={{
                    margin: 0,
                    // O padding lateral zerou aqui para a linha ativa poder encostar nas bordas!
                    padding: '2.5rem 0', 
                    fontSize: '1.15rem', // Fonte consideravelmente MAIOR (aprox 18px)
                    lineHeight: 1.7, // Mais respiro entre as linhas
                    backgroundColor: 'transparent',
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace", // Fontes mais bonitas
                }}
                lineProps={(lineNumber) => { 
                    const style = { 
                        display: 'block', 
                        // O padding lateral veio para cá:
                        padding: '0 2.5rem', 
                        transition: 'background-color 0.2s ease, border-left 0.2s ease',
                        borderLeft: '4px solid transparent'
                    }; 
                    
                    // Highlight com a cor verde da sua marca!
                    if (activeLines.includes(lineNumber)) {
                        style.backgroundColor = 'rgba(0, 185, 71, 0.12)'; // Fundo verde translúcido
                        style.borderLeft = '4px solid #00b947';           // Borda verde Decmatrix
                    }
                    return { style };
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}