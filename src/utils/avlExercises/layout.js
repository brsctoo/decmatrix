import { Node, setNodesCoordinates } from '../AvlTree.js';
import { cloneTree } from './lesson.js';

// Reserve vacant children before layout, independent of selection/hover. The
// simulator's existing layout places real and prospective nodes in one pass.
// Only this disposable drawing copy ever receives placeholders.
export function exerciseLayout(tree) {
    const copy = cloneTree(tree);
    const slots = [];
    for (const parent of copy.nodes) {
        for (const side of ['left', 'right']) {
            if (parent[side]) continue;
            const ghost = new Node(null, `ghost-${parent.id}-${side}`);
            ghost.parent = parent;
            parent[side] = ghost;
            slots.push({ node: ghost, parentId: parent.id, parentValue: parent.value, side });
        }
    }
    setNodesCoordinates(copy.root);
    const drawing = [...copy.nodes, ...slots.map(slot => slot.node)];
    const minX = Math.min(0, ...drawing.map(node => node.x));
    for (const node of drawing) {
        node.x = (node.x - minX) * 1.65 + 48;
        node.y *= 1.7;
    }
    // Accessible node descriptions must describe only real children.
    for (const { node, side } of slots) node.parent[side] = null;
    return { tree: copy, slots, width: Math.max(180, ...drawing.map(node => node.x + 48)),
        height: Math.max(160, ...drawing.map(node => node.y + 48)) };
}
