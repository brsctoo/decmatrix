"use client";
import React, { useEffect } from 'react';
import styles from './LateralBar.module.css';
import ReactiveButton from './ReactiveButton';
import { usePathname, useRouter, useParams } from "next/navigation";

import { useTranslations } from 'next-intl';

function LateralSection({title, children, hasTitle = true}) {
    return (
        <div className={styles.lateralSection}>
            {hasTitle && <div className={styles.lateralSectionTitle}>{title}</div>}
            <div className={styles.lateralSectionContent}>{children}</div>
        </div>
    );
}

{/* 
    Quando o mouse passa no "opener", a lateral bar aparece. -> hover true
    Quando o mouse sai da lateral bar, ela desaparece. -> hover false
*/}

function LateralBar() {

    {/* hovered é o valor, setHovered é a função para atualizar o valor */}
    const [hovered, setHovered] = React.useState(false);

    const t = useTranslations('LateralBar');

    {/* pathname é o caminho atual da URL */}
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();

    return (
        <div style={{zIndex: 1000}}>
            <div 
            className={styles.opener}
            onMouseEnter={() => setHovered(true)}
            >   
                <span /> 
                <span />
                <span />
            </div>

            {/* hovered = True? style passa de lateralBarInvisible para lateralBar */}
            <div className={hovered ? styles.lateralBar : styles.lateralBarInvisible} onMouseLeave={() => setHovered(false)}>
                <div className={styles.lateralBarTitle}>
                    Decimatrix
                </div>

                <div className={styles.lateralBarSections}>
                    <LateralSection hasTitle={false}>
                        <ReactiveButton 
                            label={t('home')} 
                            onClick={() => router.push(`/${params.locale}/`)} 
                            active={pathname === `/${params.locale}`} 
                            extraStyles={`${styles.lateralBarButton}`}
                        />
                    </LateralSection>

                    <LateralSection title={t('algebra.title')}>
                        <ReactiveButton 
                            label={t('algebra.quadraticEquation')} 
                            onClick={() => router.push(`/${params.locale}/quadratic-equation-calculator`)} 
                            active={pathname === `/${params.locale}/quadratic-equation-calculator`} 
                            extraStyles={styles.lateralBarButton}
                        />
                    </LateralSection>
                    
                    <LateralSection title={t('financialCalculators.title')}>
                        <ReactiveButton 
                            label={t('financialCalculators.simpleInterestCalculator')} 
                            onClick={() => router.push(`/${params.locale}/simple-interest-calculator`)} 
                            active={pathname === `/${params.locale}/simple-interest-calculator`}   
                            extraStyles={styles.lateralBarButton}    
                        />  
                        <ReactiveButton 
                            label={t('financialCalculators.compoundInterestCalculator')} 
                            onClick={() => router.push(`/${params.locale}/compound-interest-calculator`)} 
                            active={pathname === `/${params.locale}/compound-interest-calculator`}       
                            extraStyles={styles.lateralBarButton}    
                        />    
                    </LateralSection>

                    <LateralSection title={t('dataStructures.title')}>
                        <ReactiveButton 
                            label={t('dataStructures.binarySearchTreeSimulator')}
                            onClick={() => router.push(`/${params.locale}/bst-tree-builder`)} 
                            active={pathname === `/${params.locale}/bst-tree-builder`} 
                            extraStyles={styles.lateralBarButton}
                        />
                        <ReactiveButton 
                            label={t('dataStructures.AVLTreeSimulator')}
                            onClick={() => router.push(`/${params.locale}/avl-tree-builder`)} 
                            active={pathname === `/${params.locale}/avl-tree-builder`} 
                            extraStyles={styles.lateralBarButton}
                        />
                    </LateralSection>
                </div>
            </div>
        </div>  
    );
}

export default LateralBar;