"use client";
import { useEffect } from 'react';
import {useContext, createContext, useState} from 'react'; 

export const ViewportContext = createContext();

export function ViewportProvider({ children }) {
    const [isMobile, setIsMobile] = useState(false);
    console.log('ViewportProvider renderizado, isMobile:', isMobile);

    useEffect(() => {
        // Função para checar o tamanho
        const handleSize = () => setIsMobile(window.innerWidth <= 768);
        
        // Chama uma vez no mount para definir o estado real
        handleSize();

        window.addEventListener('resize', handleSize);
        return () => window.removeEventListener('resize', handleSize);
    }, []);

    return (
        <ViewportContext.Provider value={{ isMobile }}>
            {children}
        </ViewportContext.Provider>
    );
}

// Hook customizado para facilitar o uso do contexto
export const useIsMobile = () => {
    const context = useContext(ViewportContext);
    return context.isMobile;
};

