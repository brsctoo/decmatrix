import styles from '../AVLExercises/Exercises.module.css';

// Shared SSR drawing for worked BST examples and AVL rotation frames.
export default function TreeDiagram({ tree, label, target }) {
    const coordinates = new Map();
    let rank = 0, maxDepth = 0;
    function position(node, depth = 0) {
        if (!node) return;
        position(node.left, depth + 1);
        coordinates.set(node.id, { x: 42 + rank++ * 78, y: 40 + depth * 72 });
        maxDepth = Math.max(maxDepth, depth);
        position(node.right, depth + 1);
    }
    position(tree.root);
    const width = Math.max(240, rank * 78 + 6), height = Math.max(224, maxDepth * 72 + 80);
    return <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label}>
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
    </svg>;
}
