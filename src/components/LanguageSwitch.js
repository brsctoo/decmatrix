"use client"

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

{/* Ícone */}
import { Languages } from 'lucide-react';
import { BR, US } from 'country-flag-icons/react/3x2';

import styles from './LanguageSwitch.module.css';

function LanguageSwitch() {
    const [switcherVisible, setSwitcherVisible] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const LANGUAGES = [
        { code: 'en', label: 'English', flag: US },
        { code: 'pt', label: 'Português', flag: BR },
    ];

    const changeLanguage = (langCode) => {
        const newPath = pathname.replace(/^\/(en|pt)/, `/${langCode}`);
        router.push(newPath);
    };

    return (
        <div className={styles.languageSwitch} >
            <div onClick={() => setSwitcherVisible(prev => !prev)} className={styles.languageIcon} > 
                <Languages size={24} />
            </div>

            {switcherVisible && (
                <div className={styles.languageOptions}>
                    {LANGUAGES.map(lang => (
                        <div 
                            key={lang.code}
                            className={styles.languageIndividualOption}
                            onClick={() => {
                                changeLanguage(lang.code);
                                setSwitcherVisible(false); // Esconde o switcher após a escolha
                            }}
                        >
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                padding: '5px 7px',
                                cursor: 'pointer'
                            }}>
                                <lang.flag style={{ width: '20px', height: 'auto' }} />
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{lang.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        
        </div>
        
        )
}

export default LanguageSwitch;

    