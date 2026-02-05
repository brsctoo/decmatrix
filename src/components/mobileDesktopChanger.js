import { useState, useEffect } from 'react';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    
