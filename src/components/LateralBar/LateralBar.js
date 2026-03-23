"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import styles from './LateralBar.module.css';
import ReactiveButton from '../ui/ReactiveButton/ReactiveButton';
import { usePathname, useRouter, useParams } from "next/navigation";

{/* Contexto */}
import { useUI } from '@/context/UIContext'; 

{/* Ícones */}
import { Sigma, Network, CircleDollarSign, ChevronLeft, Grid3x3 } from 'lucide-react';

{/* Animação */}
import { motion, AnimatePresence } from "framer-motion";

import { useTranslations } from 'next-intl';

function IconSection({ icon: Icon }) { 
    if (!Icon) return null; // Prevenção contra chaves inexistentes

    return (
        <div className={styles.icon}>
            <Icon size={24} /> 
        </div>
    );
}

export default function LateralBar() {
    const { isSidebarOpen } = useUI();

    {/* categoria ativada no momento -> muda com o handleCategory */}
    const [activeCategory, setActiveCategory] = React.useState(null);
    
    function handleCategory(categoryName) {
        setActiveCategory(categoryName === activeCategory ? null : categoryName);
    }

    const t = useTranslations('LateralBar');
    const router = useRouter();
    const params = useParams();

    // Ícones das categorias
    const ICONS_MAP = {
        'precalculus': <Sigma size={18} />,
        'data_structures': <Network size={18} />,
        'financial_calculators': <CircleDollarSign size={18} />,
        'linear_algebra': <Grid3x3 size={18} />
    }

    // Categorias disponíveis
    const CATEGORIES = [
        { id: 'financial_calculators', label: 'Finanças' },
        { id: 'precalculus', label: 'Matemática' },
        { id: 'linear_algebra', label: 'Matrizes' },
        { id: 'data_structures', label: 'Computação' },
    ];

    // Itens de navegação disponíveis
    const NAV_ITENS = {
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

        'quadraticEquation': {
            id: 'quadraticEquation', // id para identificar a seção
            labelKey: 'precalculus.quadraticEquation', // chave para tradução do título da seção
            path: `/${params.locale}/quadratic-equation-calculator`, // caminho para navegação
            category: 'precalculus' // categoria para agrupar seções relacionadas
        }, 

        'matrixMultiplication': {
            id: 'matrixMultiplication', // id para identificar a seção
            labelKey: 'linear_algebra.matrixMultiplication', // chave para tradução do título da seção
            path: `/${params.locale}/matrix-multiplication`,
            category: 'linear_algebra' // categoria para agrupar seções relacionadas
        },

        'matrixBasicOperations': {
            id: 'matrixBasicOperations', // id para identificar a seção
            labelKey: 'linear_algebra.matrixBasicOperations', // chave para tradução do título da seção
            path: `/${params.locale}/matrix-basic-operations`,
            category: 'linear_algebra' // categoria para agrupar seções relacionadas
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
        },

        'bubbleSort': {
            id: 'bubbleSort',
            labelKey: 'dataStructures.bubbleSort',
            path: `/${params.locale}/bubble-sort`,
            category: 'data_structures'
        },

        'insertionSort': {
            id: 'insertionSort',
            labelKey: 'dataStructures.insertionSort',
            path: `/${params.locale}/insertion-sort`,
            category: 'data_structures'
        },

        'selectionSort': {
            id: 'selectionSort',
            labelKey: 'dataStructures.selectionSort',
            path: `/${params.locale}/selection-sort`,
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

            // Busca o ícone no seu ICONS_MAP usando o ID da categoria
            const IconElement = ICONS_MAP[category.id];

            return (
                // Barra lateral total da categoria, incluindo o cabeçalho e os itens de navegação 
                <div key={category.id} className={styles.categoryWrapper}>
                    {/* Cabeçalho da seção */}
                    <div 
                        className={`${styles.categoryHeader} ${isActive ? styles.categoryHeaderActive : ""}`} 
                        onClick={() => handleCategory(category.id)}
                    >
                        {/* Renderiza o elemento de ícone */}
                        {IconElement} 
                        <span>{t(`categories.${category.id}`)}</span> 

                        {/* Ícone de chevron */}
                        <div className={`${styles.chevronIcon} ${isActive ? styles.chevronActive : ""}`}>
                            <ChevronLeft size={16} />
                        </div>
                    </div>

                    {/* Itens de navegação da categoria, mostrados apenas se a categoria estiver ativa */}
                    <AnimatePresence>    
                        {isActive && (
                            <motion.nav
                                initial={{ height: 0, opacity: 1 }} // Começa colapsado (sem altura e invisível)
                                animate={{ height: "auto", opacity: 1 }} // Anima para expandido (altura automática e visível)
                                exit={{ height: 0, opacity: 1 }} // Sai colapsando
                                transition={{ duration: 0.4, ease: "easeInOut" }} // Duração e tipo de transição
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
                            </motion.nav>
                        )}
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
                )}
            </AnimatePresence>
        </div>
    );
}
