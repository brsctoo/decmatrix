"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import style from './Topbord.module.css';
import { useTranslations } from 'next-intl';

{/* Contexto */}
import { useUI } from '@/context/UIContext';

export default function Topbord() {
    const { toggleSidebar } = useUI();
    const t = useTranslations('BaseBoard');
    const { locale } = useParams();

    return (
        <div className={style.topbordContainer} style={{ position: 'fixed', zIndex: 1000 }}>
            <div className={style.content}>
                <Link href={`/${locale}`} className={style.logoLink}>
                    <div className={style.logoSection}>
                        <h1 className={style.title}>DECMATRIX</h1>
                        <p className={style.subtitle}>{locale === 'pt' ? 'Ferramentas Matemáticas' : 'Mathematical Tools'}</p>
                    </div>
                </Link>
            </div>
            <button onClick={toggleSidebar}>Toggle Sidebar</button>
        </div>
    );
}