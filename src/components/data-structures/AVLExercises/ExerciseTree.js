"use client";

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { exerciseLayout } from '@/utils/avlExercises/layout';
import { clampZoom, fitZoom, zoomTransform, gridSpacing, MIN_ZOOM, MAX_ZOOM } from '@/utils/avlExercises/viewport';
import styles from './Exercises.module.css';

// One viewport shared by the full exercise, quick practice and introduction.
// The simulator's drag-scroll container cannot clip without remaining scrollable:
// here the drawing is paint-contained and only its transform changes.
export default function ExerciseTree({ tree, selected, showBalance, onSelect, onInsert, onRotate, inserting = false, rotating = false, nextValue, resetKey = 0, compact = false }) {
    const t = useTranslations('AVLExercises');
    const p = useTranslations('AVLPractice');
    const viewport = useRef(null);
    const gesture = useRef(null);
    const [size, setSize] = useState({ width: 600, height: compact ? 260 : 360 });
    const [view, setView] = useState({ fit: true, scale: 1, x: 0, y: 0 });
    const [touchPan, setTouchPan] = useState(false);
    const [dragging, setDragging] = useState(false);
    const layout = useMemo(() => exerciseLayout(tree), [tree]);
    const ghosts = inserting ? layout.slots.filter(slot => slot.parentId === selected) : [];
    const rotationNode = rotating ? layout.tree.nodes.find(node => node.id === selected) : null;
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
    function selectNode(node) {
        onSelect(node.id);
        if (rotating) {
            const nextScale = Math.max(scale, .8);
            const nx = x + node.x * scale, ny = y + node.y * scale;
            if (scale < .8 || nx < 100 || nx > size.width - 100 || ny < 32 || ny > size.height - 32)
                setView({ fit: false, scale: nextScale, x: size.width / 2 - node.x * nextScale,
                    y: size.height / 2 - node.y * nextScale });
            return;
        }
        const slots = inserting ? layout.slots.filter(slot => slot.parentId === node.id) : [];
        if (!slots.length) return;
        // Reveal the local decision at a readable scale, without relaying out or
        // moving any graph nodes. Ghost hit targets remain 48 screen pixels.
        const points = [node, ...slots.map(slot => slot.node)];
        const cx = (Math.min(...points.map(n => n.x)) + Math.max(...points.map(n => n.x))) / 2;
        const cy = (Math.min(...points.map(n => n.y)) + Math.max(...points.map(n => n.y))) / 2;
        const nextScale = Math.max(scale, .8);
        const visible = points.every(n => x + n.x * scale >= 32 && x + n.x * scale <= size.width - 32
            && y + n.y * scale >= 32 && y + n.y * scale <= size.height - 32);
        if (!visible || scale < .8) setView({ fit: false, scale: nextScale,
            x: size.width / 2 - cx * nextScale, y: size.height / 2 - cy * nextScale });
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
            {inserting && nextValue !== undefined && <div className={styles.nextValueBadge} data-next-value={nextValue} aria-hidden="true">
                {p('nextNode')} <strong>{nextValue}</strong>
            </div>}
            {!tree.root ? inserting ? <button type="button" data-ghost-side="root" className={styles.ghostRoot}
                aria-label={t('root')} onClick={() => onInsert(null, 'root')}>+<span>{t('root')}</span></button> : <p className={styles.empty}>{t('empty')}</p> :
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
                        }} onClick={() => selectNode(node)}>
                        {node.value}
                        {showBalance && <span className={styles.factor} aria-hidden="true">{node.balanceFactor > 0 ? '+' : ''}{node.balanceFactor}</span>}
                    </button>)}
                </div>}
            {ghosts.length > 0 && <svg className={styles.ghostEdges} width={size.width} height={size.height} aria-hidden="true">
                {ghosts.map(({ node, parentId, side }) => <line key={side}
                    x1={x + node.parent.x * scale} y1={y + node.parent.y * scale}
                    x2={x + node.x * scale} y2={y + node.y * scale} />)}
            </svg>}
            {rotationNode && ['left', 'right'].map(direction => <button type="button" key={direction}
                data-rotation-direction={direction} data-rotation-node={rotationNode.id} className={styles.rotationOption}
                style={{ left: x + rotationNode.x * scale + (direction === 'left' ? -64 : 64), top: y + rotationNode.y * scale }}
                aria-label={p(direction === 'left' ? 'rotateNodeLeft' : 'rotateNodeRight', { value: rotationNode.value })}
                onFocus={() => {
                    const nx = x + rotationNode.x * scale;
                    if (nx < 100 || nx > size.width - 100) center(rotationNode);
                }} onClick={() => onRotate(direction)}>{direction === 'left' ? '↶' : '↷'}</button>)}
            {ghosts.map(({ node, parentId, parentValue, side }) => <button type="button" key={`${parentId}-${side}`}
                data-ghost-side={side} data-ghost-parent={parentId} className={styles.ghost}
                style={{ left: x + node.x * scale, top: y + node.y * scale }}
                aria-label={p(side === 'left' ? 'ghostLeft' : 'ghostRight', { value: parentValue })}
                onFocus={() => {
                    const nx = x + node.x * scale, ny = y + node.y * scale;
                    if (nx < 28 || nx > size.width - 28 || ny < 28 || ny > size.height - 28) center(node);
                }} onClick={() => onInsert(parentId, side)}>+</button>)}
        </div>
        <p className={styles.note}>{p('mouseHelp')}</p>
        <p className={`${styles.note} ${styles.touchOnly}`}>{p('gestureHelp')}</p>
    </div>;
}
