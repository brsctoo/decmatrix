import { useState, useEffect } from 'react';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false); // Começa como false para não bugar o google

    function handleSize() {
        setIsMobile(window.innerWidth <= 768);
    }

    useEffect(() => {
        handleSize();
        window.addEventListener('resize', handleSize); // Vigia mudanças no tamanho da janela
        return () => window.removeEventListener('resize', handleSize);
    }, []);

    return isMobile;
}

export default useIsMobile;

    
