"use client";

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { setNodesCoordinates } from '@/utils/AvlTree';
import { cloneTree } from '@/utils/avlExercises/lesson';
import { clampZoom, fitZoom, zoomTransform, gridSpacing, MIN_ZOOM, MAX_ZOOM } from '@/utils/avlExercises/viewport';
import styles from './Exercises.module.css';

// One viewport shared by the full exercise, quick practice and introduction.
// The simulator's drag-scroll container cannot clip without remaining scrollable:
// here the drawing is paint-contained and only its transform changes.
export default function ExerciseTree({ tree, selected, showBalance, onSelect, resetKey = 0, compact = false }) {
    const t = useTranslations('AVLExercises');
    const p = useTranslations('AVLPractice');
    const viewport = useRef(null);
    const gesture = useRef(null);
    const [size, setSize] = useState({ width: 600, height: compact ? 260 : 360 });
    const [view, setView] = useState({ fit: true, scale: 1, x: 0, y: 0 });
    const [touchPan, setTouchPan] = useState(false);
    const [dragging, setDragging] = useState(false);
    const layout = useMemo(() => {
        const copy = cloneTree(tree);
        setNodesCoordinates(copy.root);
        const minX = Math.min(0, ...copy.nodes.map(node => node.x));
        copy.nodes.forEach(node => { node.x = (node.x - minX) * 1.65 + 48; node.y *= 1.7; });
        return { tree: copy, width: Math.max(180, ...copy.nodes.map(node => node.x + 48)),
            height: Math.max(160, ...copy.nodes.map(node => node.y + 48)) };
    }, [tree]);
    const scale = view.fit ? fitZoom(layout.width, layout.height, size.width, size.height) : view.scale;
    const x = view.fit ? (size.width - layout.width * scale) / 2 : view.x;
    const y = view.fit ? (size.height - layout.height * scale) / 2 : view.y;
    useLayoutEffect(() => {
        const element = viewport.current;
        const update = () => setSize({ width: element.clientWidth, height: element.clientHeight });
        update();
        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    useLayoutEffect(() => {
        setView({ fit: true, scale: 1, x: 0, y: 0 });
        setTouchPan(false);
    }, [resetKey]);
    function fit() {
        const element = viewport.current;
        setSize({ width: element.clientWidth, height: element.clientHeight });
        setView({ fit: true, scale: 1, x: 0, y: 0 });
    }
    function zoom(factor) {
        const next = clampZoom(scale * factor);
        setView({ fit: false, scale: next,
            ...zoomTransform(x, y, size.width, size.height, scale, next) });
    }
    function pan(dx, dy) {
        setView({ fit: false, scale, x: x + dx, y: y + dy });
    }
    function center(node = layout.tree.nodes.find(item => item.id === selected) ?? layout.tree.root) {
        if (node) setView({ fit: false, scale, x: size.width / 2 - node.x * scale, y: size.height / 2 - node.y * scale });
    }
    function pointerDown(event) {
        if (event.button !== 0) return;
        gesture.current = { id: event.pointerId, sx: event.clientX, sy: event.clientY,
            x, y, scale, moved: false, active: true };
    }
    function pointerMove(event) {
        const start = gesture.current;
        if (!start?.active || start.id !== event.pointerId) return;
        const dx = event.clientX - start.sx, dy = event.clientY - start.sy;
        if (!start.moved && Math.hypot(dx, dy) < 10) return;
        // Ordinary vertical touch swipes belong to the page. An explicit toggle
        // enables two-axis touch panning; buttons are always an alternative.
        if (event.pointerType === 'touch' && !touchPan && Math.abs(dy) > Math.abs(dx)) return;
        start.moved = true;
        setDragging(true);
        if (event.isTrusted) viewport.current.setPointerCapture?.(event.pointerId);
        setView({ fit: false, scale: start.scale, x: start.x + dx,
            y: start.y + (event.pointerType === 'touch' && !touchPan ? 0 : dy) });
    }
    function pointerEnd(event) {
        if (gesture.current?.id === event.pointerId) {
            gesture.current.active = false;
            if (event.type === 'pointercancel') gesture.current = null;
            setDragging(false);
        }
    }
    return <div className={styles.treeArea} data-fit={view.fit ? '1' : '0'}>
        <div className={styles.toolbar}>
            <span>{t('zoom')}: <output aria-live="polite">{Math.round(scale * 100)}%</output></span>
            <button type="button" data-zoom="out" aria-label={p('zoomOut')} disabled={scale <= MIN_ZOOM} onClick={() => zoom(1 / 1.25)}>−</button>
            <button type="button" data-zoom="in" aria-label={p('zoomIn')} disabled={scale >= MAX_ZOOM} onClick={() => zoom(1.25)}>+</button>
            <button type="button" data-zoom="fit" onClick={fit}>{p('fit')}</button>
            <button type="button" onClick={() => center()} disabled={!tree.root}>{t('center')}</button>
        </div>
        <div className={styles.panControls} role="group" aria-label={p('moveView')}>
            {[[64, 0, 'panLeft', '←'], [0, 64, 'panUp', '↑'], [0, -64, 'panDown', '↓'], [-64, 0, 'panRight', '→']].map(([dx, dy, label, icon]) =>
                <button key={label} type="button" aria-label={p(label)} onClick={() => pan(dx, dy)}>{icon}</button>)}
            <button className={styles.touchOnly} type="button" aria-pressed={touchPan} onClick={() => setTouchPan(value => !value)}>{p('touchPan')}</button>
        </div>
        <div ref={viewport} role="region" aria-label={t('tree')} tabIndex={0}
            data-tree-viewport className={`${styles.viewport} ${compact ? styles.compactViewport : ''} ${dragging ? styles.viewportDragging : ''}`}
            style={{ touchAction: touchPan ? 'none' : 'pan-y pinch-zoom',
                backgroundSize: `${gridSpacing(scale)}px ${gridSpacing(scale)}px`, backgroundPosition: `${x}px ${y}px` }}
            onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
            onLostPointerCapture={() => setDragging(false)}
            onClickCapture={event => {
                if (gesture.current?.moved && event.detail !== 0) {
                    event.preventDefault(); event.stopPropagation(); gesture.current = null;
                }
            }}
            onKeyDown={event => {
                if (event.target !== viewport.current) return;
                const moves = { ArrowLeft: [64, 0], ArrowRight: [-64, 0], ArrowUp: [0, 64], ArrowDown: [0, -64] };
                if (moves[event.key]) { event.preventDefault(); pan(...moves[event.key]); }
                else if (event.key === 'Home') { event.preventDefault(); fit(); }
            }}>
            {!tree.root ? <p className={styles.empty}>{t('empty')}</p> :
                <div className={styles.world} data-tree-scale={scale} style={{ width: layout.width, height: layout.height,
                    transform: `translate(${x}px, ${y}px) scale(${scale})` }}>
                    <svg width={layout.width} height={layout.height} aria-hidden="true" className={styles.edges}>
                        {layout.tree.nodes.flatMap(node => [node.left, node.right].filter(Boolean).map(child =>
                            <line key={`${node.id}-${child.id}`} x1={node.x} y1={node.y} x2={child.x} y2={child.y} />))}
                    </svg>
                    {layout.tree.nodes.map(node => <button key={node.id} type="button" data-node-id={node.id}
                        className={`${styles.node} ${selected === node.id ? styles.selected : ''}`}
                        style={{ left: node.x, top: node.y }} aria-pressed={selected === node.id}
                        aria-label={`${t('nodeLabel', { value: node.value, parent: node.parent?.value ?? t('rootLabel'), left: node.left?.value ?? t('none'), right: node.right?.value ?? t('none') })}${showBalance ? ` ${t('nodeBalance', { value: node.balanceFactor })}` : ''}`}
                        onFocus={() => {
                            const nx = x + node.x * scale, ny = y + node.y * scale;
                            if (nx < 32 || nx > size.width - 32 || ny < 50 || ny > size.height - 32) center(node);
                        }} onClick={() => onSelect(node.id)}>
                        {node.value}
                        {showBalance && <span className={styles.factor} aria-hidden="true">{node.balanceFactor > 0 ? '+' : ''}{node.balanceFactor}</span>}
                    </button>)}
                </div>}
        </div>
        <p className={styles.note}>{p('mouseHelp')}</p>
        <p className={`${styles.note} ${styles.touchOnly}`}>{p('gestureHelp')}</p>
    </div>;
}
