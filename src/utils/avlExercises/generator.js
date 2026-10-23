import AvlTree from '../AvlTree.js';

export const MODES = ['mixed', 'LL', 'RR', 'LR', 'RL'];

export function analyzeSequence(sequence) {
    const tree = new AvlTree();
    const cases = [];
    tree.rebalance = function (node) {
        cases.push(node.balanceFactor > 1
            ? (node.left.balanceFactor >= 0 ? 'LL' : 'LR')
            : (node.right.balanceFactor <= 0 ? 'RR' : 'RL'));
        AvlTree.prototype.rebalance.call(this, node);
    };
    for (const value of sequence) {
        tree.insert(value);
        // Existing rotations relink nodes; refresh cached heights afterwards.
        tree.updateHeight(tree.root);
    }
    return { tree, cases };
}

function shuffle(values, random) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function generateExercise(mode = 'mixed', count = 8, random = Math.random) {
    if (!MODES.includes(mode) || !Number.isInteger(count) || count < 6 || count > 20) throw new Error('Invalid exercise configuration');
    const accepts = sequence => {
        const { cases } = analyzeSequence(sequence);
        return mode === 'mixed' ? new Set(cases).size >= 2 : cases.includes(mode);
    };
    const values = shuffle(Array.from({ length: 180 }, (_, i) => i - 60), random).slice(0, count).sort((a, b) => a - b);
    for (let attempt = 0; attempt < 80; attempt++) {
        const sequence = shuffle(values, random);
        if (accepts(sequence)) return sequence;
    }
    // Order-preserving relabeling keeps the AVL cases but varies actual values.
    const prefixes = { LL: [3, 2, 1], RR: [1, 2, 3], LR: [3, 1, 2], RL: [1, 3, 2], mixed: [3, 1, 2, 5, 4, 6] };
    const prefix = prefixes[mode];
    const ranks = [...prefix, ...shuffle(Array.from({ length: count }, (_, i) => i + 1).filter(rank => !prefix.includes(rank)), random)];
    const sequence = ranks.map(rank => values[rank - 1]);
    if (!accepts(sequence)) throw new Error('Exercise generation invariant failed');
    return sequence;
}
