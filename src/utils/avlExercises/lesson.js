import AvlTree, { Node } from '../AvlTree.js';
import BinarySearchTree, { Node as BstNode } from '../BinarySearchTree.js';

// Copy the graph, including parent links, without sharing mutable nodes.
export function cloneTree(source) {
    const bst = source instanceof BinarySearchTree;
    const tree = bst ? new BinarySearchTree() : new AvlTree();
    function copy(node, parent = null) {
        if (!node) return null;
        const result = Object.assign(bst ? new BstNode(node.value, node.id) : new Node(node.value, node.id), node, { parent });
        tree.nodes.push(result);
        result.left = copy(node.left, result);
        result.right = copy(node.right, result);
        return result;
    }
    tree.root = copy(source.root);
    tree.nodeCount = source.nodeCount;
    tree.depth = source.depth;
    return tree;
}

export function insertionSlot(tree, value) {
    let node = tree.root;
    let parent = null;
    let side = 'root';
    while (node) {
        if (node.value === value) return null;
        parent = node;
        side = value < node.value ? 'left' : 'right';
        node = node[side];
    }
    return { parentId: parent?.id ?? null, side };
}

// The simulator itself determines the conventional operation order. Only this
// disposable reference copy is automatically rebalanced; never the student's tree.
export function rotationPlan(tree, insertedId) {
    const reference = cloneTree(tree);
    reference.updateHeight(reference.root);
    let ancestor = reference.nodes.find(node => node.id === insertedId);
    while (ancestor && Math.abs(ancestor.balanceFactor) <= 1) ancestor = ancestor.parent;
    if (!ancestor) return { operations: [], caseName: null, ancestorId: null };
    const caseName = ancestor.balanceFactor > 1
        ? (ancestor.left.balanceFactor >= 0 ? 'LL' : 'LR')
        : (ancestor.right.balanceFactor <= 0 ? 'RR' : 'RL');
    const operations = [];
    for (const [method, direction] of [['rotateLeft', 'left'], ['rotateRight', 'right']]) {
        reference[method] = function (node) {
            operations.push({ nodeId: node.id, direction });
            AvlTree.prototype[method].call(this, node);
        };
    }
    reference.rebalance(ancestor);
    return { operations, caseName, ancestorId: ancestor.id };
}

// Independent whole-tree check: bounds, parent links, heights, balance and set.
export function validateTree(tree, expected, requireBalance = true) {
    const seen = new Set();
    const values = [];
    let valid = true;
    function walk(node, parent, low, high) {
        if (!node) return -1;
        if (seen.has(node)) { valid = false; return -1; }
        seen.add(node);
        if (node.parent !== parent || !(node.value > low && node.value < high)) valid = false;
        values.push(node.value);
        const left = walk(node.left, node, low, node.value);
        const right = walk(node.right, node, node.value, high);
        const height = 1 + Math.max(left, right);
        if (tree instanceof AvlTree && (node.height !== height || node.leftHeight !== left + 1 || node.rightHeight !== right + 1
            || node.balanceFactor !== left - right || (requireBalance && Math.abs(left - right) > 1))) valid = false;
        return height;
    }
    walk(tree.root, null, -Infinity, Infinity);
    const sorted = [...expected].sort((a, b) => a - b);
    values.sort((a, b) => a - b);
    return valid && seen.size === tree.nodes.length && tree.nodes.every(node => seen.has(node))
        && new Set(values).size === values.length && values.length === sorted.length
        && values.every((value, i) => value === sorted[i]);
}

export function createExercise(sequence, mode = 'mixed', variant = 'avl') {
    // Short sequences are also used by the quick rotation challenges.
    const modes = variant === 'bst' ? ['bst'] : ['mixed', 'LL', 'RR', 'LR', 'RL'];
    if (!['avl', 'bst'].includes(variant) || sequence.length < (variant === 'bst' ? 1 : 3) || sequence.length > (variant === 'bst' ? 30 : 20) || !modes.includes(mode)
        || sequence.some(value => !Number.isSafeInteger(value)) || new Set(sequence).size !== sequence.length) {
        throw new Error('Invalid exercise sequence');
    }
    return {
        sequence: [...sequence], mode, variant, nodeCount: sequence.length, index: 0, tree: variant === 'bst' ? new BinarySearchTree() : new AvlTree(), phase: 'INSERTING',
        selected: null, correct: 0, errors: 0, rotations: 0, hints: 0, hintLevel: 0,
        showBalance: false, pending: [], ancestorId: null, feedback: { key: 'ready' },
    };
}

function fail(state, key, values = {}) {
    return { ...state, errors: state.errors + 1, feedback: { key, values, error: true } };
}

function advance(state, key) {
    if (!validateTree(state.tree, state.sequence.slice(0, state.index + 1), state.variant !== 'bst')) throw new Error('Invalid tree checkpoint');
    const index = state.index + 1;
    return { ...state, index, selected: null, hintLevel: 0, pending: [], ancestorId: null,
        phase: index === state.sequence.length ? 'COMPLETED' : 'INSERTING',
        feedback: { key: index === state.sequence.length ? 'completed' : key } };
}

export function insertAnswer(state, parentId, side) {
    if (state.phase === 'COMPLETED') return state;
    if (state.phase !== 'INSERTING') return fail(state, 'finishBalance');
    const value = state.sequence[state.index];
    const parent = state.tree.nodes.find(node => node.id === parentId);
    if (state.tree.nodes.some(node => node.value === value)) return fail(state, 'duplicate');
    if (state.tree.root && (!parent || !['left', 'right'].includes(side))) return fail(state, 'selectNode');
    if (!state.tree.root && (parentId !== null || side !== 'root')) return fail(state, 'useRoot');
    if (parent?.[side]) return fail(state, 'occupied');
    // Follow all ancestors to explain the first violated bound, not just the parent.
    if (parent) {
        let child = { parent, value };
        let branch = side;
        while (child.parent) {
            const ancestor = child.parent;
            if ((branch === 'left' && value >= ancestor.value) || (branch === 'right' && value <= ancestor.value)) {
                return fail(state, branch === 'left' ? 'mustBeLess' : 'mustBeGreater', { value, ancestor: ancestor.value });
            }
            child = ancestor;
            if (child.parent) branch = child.parent.left === child ? 'left' : 'right';
        }
    }
    const tree = cloneTree(state.tree);
    const node = state.variant === 'bst' ? new BstNode(value, ++tree.nodeCount) : new Node(value, ++tree.nodeCount);
    tree.nodes.push(node);
    if (!tree.root) tree.root = node;
    else {
        node.parent = tree.nodes.find(item => item.id === parentId);
        node.parent[side] = node;
    }
    if (state.variant !== 'bst') tree.updateHeight(tree.root);
    const plan = state.variant === 'bst' ? { operations: [], ancestorId: null } : rotationPlan(tree, node.id);
    const next = { ...state, tree, correct: state.correct + 1, hintLevel: 0, selected: null,
        pending: plan.operations, ancestorId: plan.ancestorId };
    if (!validateTree(tree, state.sequence.slice(0, state.index + 1), false)) throw new Error('Invalid BST checkpoint');
    return plan.operations.length ? { ...next, phase: 'REBALANCING', feedback: { key: 'needsBalance' } } : advance(next, 'inserted');
}

export function rotateAnswer(state, nodeId, direction) {
    if (state.variant === 'bst') return state;
    if (state.phase !== 'REBALANCING') return fail(state, 'noRotation');
    const node = state.tree.nodes.find(item => item.id === nodeId);
    if (!node) return fail(state, 'selectNode');
    if (!['left', 'right'].includes(direction)) return fail(state, 'wrongDirection');
    if (!node[direction === 'left' ? 'right' : 'left']) return fail(state, direction === 'left' ? 'needsRightChild' : 'needsLeftChild');
    const expected = state.pending[0];
    if (nodeId !== expected.nodeId) return fail(state, 'wrongNode');
    if (direction !== expected.direction) return fail(state, 'wrongDirection');
    const tree = cloneTree(state.tree);
    tree[direction === 'left' ? 'rotateLeft' : 'rotateRight'](tree.nodes.find(item => item.id === nodeId));
    tree.updateHeight(tree.root);
    const next = { ...state, tree, pending: state.pending.slice(1), correct: state.correct + 1,
        rotations: state.rotations + 1, hintLevel: 0, selected: null };
    if (!validateTree(tree, state.sequence.slice(0, state.index + 1), false)) throw new Error('Invalid rotation checkpoint');
    if (!next.pending.length) return advance(next, 'balanced');
    // After the first half of a double rotation the promoted child can also be
    // unbalanced; the conventional next step is still the original ancestor.
    const ancestor = next.tree.nodes.find(node => node.id === next.ancestorId);
    return { ...next, feedback: { key: 'doubleFirst', values: { ancestor: ancestor?.value ?? '' } } };
}

export function revealHint(state) {
    if (state.phase === 'COMPLETED' || state.hintLevel >= (state.tree.root ? 4 : 1)) return state;
    return { ...state, hintLevel: state.hintLevel + 1, hints: state.hints + 1 };
}

export function hintDetails(state) {
    const inserting = state.phase === 'INSERTING';
    const target = inserting ? insertionSlot(state.tree, state.sequence[state.index]) : state.pending[0];
    const nodeId = inserting ? target?.parentId : target?.nodeId;
    const node = state.tree.nodes.find(item => item.id === nodeId);
    return { inserting, node: node?.value, side: inserting ? target?.side : target?.direction,
        ancestor: state.tree.nodes.find(item => item.id === state.ancestorId)?.value };
}

export const score = state => Math.max(0, 100 - state.errors * 10 - state.hints * 2);

export function exerciseReducer(state, action) {
    switch (action.type) {
        case 'start': return createExercise(action.sequence, action.mode, action.variant);
        case 'retry': return createExercise(state.sequence, state.mode, state.variant);
        case 'select': return { ...state, selected: action.id };
        case 'balance': return state.variant === 'bst' ? state : { ...state, showBalance: action.value };
        case 'hint': return revealHint(state);
        case 'insert': return insertAnswer(state, action.parentId, action.side);
        case 'rotate': return rotateAnswer(state, state.selected, action.direction);
        default: return state;
    }
}
