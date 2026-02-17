'use client';

import { useRef } from 'react';

export const useDraggableScroll = (containerRef) => {
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const startY = useRef(0);
    const scrollTop = useRef(0);

    const handlePointerDown = (e) => {
        // Ignora se não for o botão esquerdo do mouse (no caso de mouse)
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        if (!containerRef.current) return;

        isDragging.current = true;
        
        // Registra o ponto inicial
        startX.current = e.pageX - containerRef.current.offsetLeft;
        startY.current = e.pageY - containerRef.current.offsetTop;
        
        // Registra a posição atual do scroll
        scrollLeft.current = containerRef.current.scrollLeft;
        scrollTop.current = containerRef.current.scrollTop;

        containerRef.current.style.cursor = 'grabbing';
        containerRef.current.style.userSelect = 'none';
        
        containerRef.current.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current || !containerRef.current) return;

        // Calcula a distância percorrida
        const x = e.pageX - containerRef.current.offsetLeft;
        const y = e.pageY - containerRef.current.offsetTop;

        const walkX = (x - startX.current);
        const walkY = (y - startY.current);

        // Aplica o movimento ao scroll
        containerRef.current.scrollLeft = scrollLeft.current - walkX;
        containerRef.current.scrollTop = scrollTop.current - walkY;
    };

    const handlePointerUp = (e) => {
        if (!containerRef.current) return;
        
        isDragging.current = false;
        containerRef.current.style.cursor = 'grab';
        containerRef.current.style.removeProperty('user-select');
        
        if (containerRef.current.hasPointerCapture(e.pointerId)) {
            containerRef.current.releasePointerCapture(e.pointerId);
        }
    };

    return {
        events: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerCancel: handlePointerUp, 
        },
        style: {
            cursor: 'grab',
            overflow: 'auto',
            touchAction: 'none', 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none', 
        }
    };
};