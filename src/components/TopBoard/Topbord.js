"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname} from 'next/navigation';
import style from './Topbord.module.css';
import { useTranslations } from 'next-intl';
import LanguageSwitch from '../ui/LanguageSwitch/LanguageSwitch';

{/* Contexto */}
import { useUI } from '@/context/UIContext';
import { useIsMobile } from '@/context/ViewportContext';

export default function Topbord() {
    const { toggleSidebar } = useUI();
    const t = useTranslations('BaseBoard');
    const { locale } = useParams();
    const pathname = usePathname();
    const isMobile = useIsMobile();

    // Fechar a lateral bar quando a rota mudar -> Só no mobile, por questão de tamanho
    useEffect(
        () => {
            if (isMobile) {
                toggleSidebar(false);
            }        
        }, [pathname]
    );

    return (
        <div className={style.topbordContainer} style={{ position: 'fixed', zIndex: 1000 }}>
            <div className={style.content}>
                <Link href={`/${locale}`} className={style.logoLink}>
                    <div className={style.logoSection}>
                        <h1 className={style.title}>DECMATRIX</h1>
                        <p className={style.subtitle}>{locale === 'pt' ? 'Ferramentas Matemáticas' : 'Mathematical Tools'}</p>
                    </div>
                </Link>

                {/* Botão para abrir a lateral bar */}
                <div onClick={() => toggleSidebar(true)}>
                    <div className={style.hamburger}>
                        <span className={style.bar}></span>
                        <span className={style.bar}></span>
                        <span className={style.bar}></span>
                    </div>
                </div>
                
                <div className={style.LanguageSwitcher}>
                    <LanguageSwitch />
                </div>
            </div>
        </div>
    );
}