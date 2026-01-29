import Link from 'next/link';
import style from './Basebord.module.css';
import { useTranslations } from 'next-intl';

export default function Basebord() {
    const t = useTranslations('BaseBoard');

    return (
        <div className={style.basebordContainer}>
            {t('decimatrix')}
            <div className={style.termsAndPolicies}>
                <Link href="/terms-of-use">{t('termsOfUse')}</Link>
                    <div className={style.separatorBall}></div>
                <Link href="/privacy-policy">{t('privacyPolicy')}</Link>
            </div>
            <div className={style.contactInfo}>
                {t('contact')}<a href="mailto:decimatrix25@gmail.com">decimatrix25@gmail.com</a>
            </div>
        </div>
    );
}