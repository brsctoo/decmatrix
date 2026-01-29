import { useRef } from 'react';

function onMouseDown(e, containerRef, isDragging, startX, scrollLeft, startY, scrollTop) {
    if (!containerRef.current) return;

    isDragging.current = true;

    startX.current = e.pageX - containerRef.current.offsetLeft; // Posição do Mouse (Global) - Onde a Div Começa.
    scrollLeft.current = containerRef.current.scrollLeft;
    startY.current = e.pageY - containerRef.current.offsetTop;
    scrollTop.current = containerRef.current.scrollTop;
        
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.userSelect = 'none'; // Evita selecionar texto
}

function onMouseUp(containerRef, isDragging) {
    if (!containerRef.current) return;
    isDragging.current = false;
    containerRef.current.style.cursor = 'grab';
    containerRef.current.style.removeProperty('user-select');
}

function onMouseMove(e, containerRef, isDragging, startX, scrollLeft, startY, scrollTop) {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();

    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;

    // Multiplicador de velocidade (1 = normal, 2 = rápido)
    const speed = 1;
    const walkX = (x - startX.current) * speed;
    const walkY = (y - startY.current) * speed;
    containerRef.current.scrollLeft = scrollLeft.current - walkX;
    containerRef.current.scrollTop = scrollTop.current - walkY;
}



export const useDraggableScroll = (containerRef) => {
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const startY = useRef(0);
    const scrollTop = useRef(0);

    return {
        events: {
        onMouseDown: (e) => onMouseDown(e, containerRef, isDragging, startX, scrollLeft, startY, scrollTop),
        onMouseUp: () => onMouseUp(containerRef, isDragging),
        onMouseLeave: () => onMouseUp(containerRef, isDragging), // Se sair da tela, solta também
        onMouseMove: (e) => onMouseMove(e, containerRef, isDragging, startX, scrollLeft, startY, scrollTop),
        },
        // Retornamos um estilo sugerido também
        style: {
        cursor: 'grab',
        overflow: 'auto',
        }
    };
}