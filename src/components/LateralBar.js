"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import styles from './LateralBar.module.css';
import ReactiveButton from './ReactiveButton';
import { usePathname, useRouter, useParams } from "next/navigation";

{/* Contexto */}
import { useUI } from '@/context/UIContext'; 

{/* Ícones */}
import { Sigma, Network, CircleDollarSign, ChevronLeft } from 'lucide-react';

{/* Animação */}
import { motion, AnimatePresence } from "framer-motion";

import { useTranslations } from 'next-intl';

function IconSection({ icon: Icon }) { 
    if (!Icon) return null; // Prevenção contra chaves inexistentes

    return (
        <div className={styles.icon}>
            {/* Renderizamos como componente */}
            <Icon size={24} /> 
        </div>
    );
}

{/* 
    Quando o mouse passa no "opener", a lateral bar aparece. -> hover true
    Quando o mouse sai da lateral bar, ela desaparece. -> hover false
*/}

function LateralBar() {
    const { isSidebarOpen } = useUI();

    {/* isCollapsed é quando a barra está pequena */}
    const [isCollapsed, setIsCollapsed] = React.useState(true);

    {/* categoria ativada no momento -> muda com o handleCategory */}
    const [activeCategory, setActiveCategory] = React.useState(null);
    
    function handleCategory(categoryName) {
        setActiveCategory(categoryName === activeCategory ? null : categoryName);
    }

    const t = useTranslations('LateralBar');

    {/* pathname é o caminho atual da URL */}
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();

    // Ícones das categorias
    const ICONS_MAP = {
        'algebra': <Sigma size={18} />,
        'data_structures': <Network size={18} />,
        'financial_calculators': <CircleDollarSign size={18} />,
    }

    // Categorias disponíveis
    const CATEGORIES = [
        { id: 'financial_calculators', iconName: 'money', label: 'Finanças' },
        { id: 'algebra', iconName: 'variable', label: 'Matemática' },
        { id: 'data_structures', iconName: 'network', label: 'Computação' },
    ];

    // Itens de navegação disponíveis
    const NAV_ITENS = {
        'quadraticEquation': {
            id: 'quadraticEquation', // id para identificar a seção
            labelKey: 'algebra.quadraticEquation', // chave para tradução do título da seção
            path: `/${params.locale}/quadratic-equation-calculator`, // caminho para navegação
            category: 'algebra' // categoria para agrupar seções relacionadas
        },

        'simpleInterestCalculator': {
            id: 'simpleInterestCalculator',
            labelKey: 'financialCalculators.simpleInterestCalculator',
            path: `/${params.locale}/simple-interest-calculator`,
            category: 'financial_calculators'
        },

        'compoundInterestCalculator': {
            id: 'compoundInterestCalculator',
            labelKey: 'financialCalculators.compoundInterestCalculator',
            path: `/${params.locale}/compound-interest-calculator`,
            category: 'financial_calculators'
        },

        'binarySearchTreeSimulator': {
            id: 'binarySearchTreeSimulator',
            labelKey: 'dataStructures.binarySearchTreeSimulator',
            path: `/${params.locale}/bst-tree-builder`,
            category: 'data_structures'
        },

        'avlTreeSimulator': {
            id: 'avlTreeSimulator',
            labelKey: 'dataStructures.AVLTreeSimulator',
            path: `/${params.locale}/avl-tree-builder`,
            category: 'data_structures'
        }
    }

    function buildCategorySections() {
        { /* Cada categoria é mapeada para criar uma seção lateral e apresenta: 
            - isActive: se a categoria é a ativa, para destacar visualmente
            - IconElement: o ícone correspondente à categoria
            - Itens da Categoria: links de navegação para cada ferramenta pertencente à categoria, exibidos apenas se a categoria estiver ativa
        */}
    
        return CATEGORIES.map(category => {
            const isActive = activeCategory === category.id;

            // Buscamos o ícone no seu ICONS_MAP usando o ID da categoria
            const IconElement = ICONS_MAP[category.id];

            return (
                // Barra lateral total da categoria, incluindo o cabeçalho e os itens de navegação (se ativos)
                <div key={category.id} className={styles.categoryWrapper}>
                    <AnimatePresence>
                        <motion.div
                            initial={{ left: 0, opacity: 0 }} // Começa colapsado (sem altura e invisível)
                            animate={{ left: "auto", opacity: 1 }} // Anima para expandido (altura automática e visível)
                            exit={{ left: 0, opacity: 0 }} // Sai colapsando
                            transition={{ duration: 0.3, ease: "easeInOut" }} // Duração e tipo de transição
                            style={{ overflow: "hidden" }} // Esconde o conteúdo que ultrapassa a altura
                            className={styles.toolsList}
                            >
                            {/* Cabeçalho da seção */}
                            <div 
                                className={`${styles.categoryHeader} ${isActive ? styles.active : ""}`} 
                                onClick={() => handleCategory(category.id)}
                            >
                                {/* Renderiza o elemento de ícone (Sigma, Network, etc.) */}
                                {IconElement} 
                                <span>{t(`categories.${category.id}`)}</span> 
                                <div className={styles.chevronIcon}>
                                    <ChevronLeft size={16} />
                                </div>
                            </div>

                        {/* Itens de navegação da categoria, mostrados apenas se a categoria estiver ativa */}
                        
                            {isActive && (
                                <nav
                                    initial={{ left: 0, opacity: 0 }} // Começa colapsado (sem altura e invisível)
                                    animate={{ left: "auto", opacity: 1 }} // Anima para expandido (altura automática e visível)
                                    exit={{ left: 0, opacity: 0 }} // Sai colapsando
                                    transition={{ duration: 0.3, ease: "easeInOut" }} // Duração e tipo de transição
                                    style={{ overflow: "hidden" }} // Esconde o conteúdo que ultrapassa a altura
                                    className={styles.toolsList}
                                    >
                                    {Object.values(NAV_ITENS)
                                        .filter(item => item.category === category.id) // Pega apenas os itens que pertencem à categoria atual
                                        .map(item => ( // Mapeia cada item para um link de navegação
                                            <Link key={item.id} href={item.path} className={styles.toolLink}>
                                                <div className={styles.perfectCircle}></div>
                                                {t(`tools.${item.labelKey}`)}
                                            </Link>
                                        ))
                                    }
                                </nav>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )
        });
    }

    return (
        <div>
            <AnimatePresence>
                {!isSidebarOpen && 
                (<motion.nav 
                    initial={{ x: -250, opacity: 0 }} /// Começa fora da tela à esquerda e invisível
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -250, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={styles.sidebar}
                    >
                    <div className={styles.sidebarHeader}>
                        {t('title')}
                    </div>
                    {buildCategorySections()}
                </motion.nav>
                )};
            </AnimatePresence>
        </div>
    );
}

export default LateralBar;