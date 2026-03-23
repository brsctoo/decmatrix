"use client";
import React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import style from './Basebord.module.css';
import { useTranslations } from 'next-intl';

export default function Basebord() {
    const t = useTranslations('BaseBoard');
    const { locale } = useParams();

    return (
        <div className={style.basebordContainer}>
            {t('decimatrix')}
            <div className={style.termsAndPolicies}>
                <Link href={`/${locale}/terms-of-use`}>{t('termsOfUse')}</Link>
                    <div className={style.separatorBall}></div>
                <Link href={`/${locale}/privacy-policy`}>{t('privacyPolicy')}</Link>
            </div>
            <div className={style.contactInfo}>
                {t('contact')}<a href="mailto:decimatrix25@gmail.com">decimatrix25@gmail.com</a>
            </div>
        </div>
    );
}