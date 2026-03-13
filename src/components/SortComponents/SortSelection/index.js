import { useEffect, useState, useRef } from 'react';
import styles from './SortSelection.module.css';

export default function SortSelection({ options, onSelect, defaultLabel="Selecione uma opção", initialValue = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(() => {
        if (initialValue && Array.isArray(options)) {
            const found = options.find((option) => option.value === initialValue);
            return found || null;
        }
        return null;
    });
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            {/* O Botão Principal que abre/fecha o menu */}
            <button 
                className={styles.dropdownHeader} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : defaultLabel}</span>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
                    ▼
                </span>
            </button>

            {/* A Lista flutuante de opções */}
            {isOpen && (
                <ul className={styles.dropdownList}>
                    {options.map((option) => (
                        <li 
                            key={option.value}
                            className={`${styles.dropdownItem} ${selectedOption?.value === option.value ? styles.selected : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
