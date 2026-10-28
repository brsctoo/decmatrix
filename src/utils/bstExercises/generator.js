import BinarySearchTree from '../BinarySearchTree.js';


// Shuffle unique values, then reject the nearly linear shapes. No rotations:
// difficulty changes the allowed depth and size, not the BST insertion rules.
export function generateBstExercise(count = 8, random = Math.random) {
    if (!Number.isInteger(count) || count < 1 || count > 30) throw new Error('Invalid BST configuration');
    function shuffle(values) {
        const copy = [...values];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }
    const values = shuffle(Array.from({ length: 160 }, (_, i) => i + 1)).slice(0, count).sort((a, b) => a - b);
    const maxDepth = Math.ceil(Math.log2(count + 1)) + 2;
    const depth = node => node ? 1 + Math.max(depth(node.left), depth(node.right)) : 0;
    for (let attempt = 0; attempt < 80; attempt++) {
        const sequence = shuffle(values);
        const tree = new BinarySearchTree();
        sequence.forEach(value => tree.insert(value));
        const levels = depth(tree.root);
        if (levels <= maxDepth) return sequence;
    }
    // Bounded median-first fallback; never rotate the student's tree.
    function preorder(sorted) {
        if (!sorted.length) return [];
        const middle = Math.floor(sorted.length / 2);
        return [sorted[middle], ...preorder(sorted.slice(0, middle)), ...preorder(sorted.slice(middle + 1))];
    }
    return preorder(values);
}
