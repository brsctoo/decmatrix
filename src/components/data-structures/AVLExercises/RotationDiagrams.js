import { rotationFrames } from '@/utils/avlExercises/diagrams';
import styles from './Exercises.module.css';

// No client directive, interactivity, external images or simulator instances.
export default function RotationDiagrams({ kind, p }) {
    const frames = rotationFrames(kind);
    return <div className={styles.diagramSteps} data-rotation-case={kind}>
        {frames.map(({ tree, target, operation }, index) => {
            const coordinates = new Map();
            let rank = 0;
            function position(node, depth = 0) {
                if (!node) return;
                position(node.left, depth + 1);
                coordinates.set(node.id, { x: 42 + rank++ * 78, y: 40 + depth * 72 });
                position(node.right, depth + 1);
            }
            position(tree.root);
            function describe(node) {
                if (!node) return p('diagramEmpty');
                return p('diagramNode', { node: node.value,
                    left: node.left?.value ?? p('diagramEmpty'), right: node.right?.value ?? p('diagramEmpty') });
            }
            const label = p(index === 0 ? 'before' : index === frames.length - 1 ? 'after' : 'middle');
            const summary = tree.nodes.map(describe).join(' ');
            return <figure className={styles.diagram} key={index} data-diagram-step={index}>
                <figcaption><strong>{index + 1}. {label}</strong>
                    <p>{operation ? p('diagramRotate', { node: target, side: p(operation.direction === 'left' ? 'diagramLeft' : 'diagramRight') }) : p('diagramBalanced')}</p>
                </figcaption>
                <svg viewBox="0 0 240 224" width="240" height="224" role="img" aria-label={`${kind}: ${label}. ${summary}`}>
                    {tree.nodes.flatMap(node => [node.left, node.right].filter(Boolean).map(child => {
                        const a = coordinates.get(node.id), b = coordinates.get(child.id);
                        return <line key={`${node.id}-${child.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
                    }))}
                    {tree.nodes.map(node => {
                        const { x, y } = coordinates.get(node.id);
                        return <g key={node.id} transform={`translate(${x} ${y})`} data-value={node.value}>
                            {target === node.value && <circle r="29" className={styles.rotationTarget} />}
                            <circle r="22" />
                            <text textAnchor="middle" dominantBaseline="central">{node.value}</text>
                        </g>;
                    })}
                </svg>
                <p className={styles.srOnly}>{summary}</p>
            </figure>;
        })}
    </div>;
}
