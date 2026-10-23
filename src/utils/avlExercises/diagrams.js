import { createExercise, insertAnswer, insertionSlot, rotateAnswer } from './lesson.js';

export const ROTATION_SEQUENCES = { LL: [30, 20, 10], RR: [10, 20, 30], LR: [30, 10, 20], RL: [10, 30, 20] };

// Derive every frame using the same manual AVL validator as the exercise.
// Server-only consumers render these snapshots as static, accessible SVG.
export function rotationFrames(kind) {
    const sequence = ROTATION_SEQUENCES[kind];
    if (!sequence) throw new Error('Invalid rotation example');
    let state = createExercise(sequence, kind);
    for (const value of sequence) {
        const slot = insertionSlot(state.tree, value);
        state = insertAnswer(state, slot.parentId, slot.side);
    }
    const frames = [];
    while (true) {
        const operation = state.pending[0];
        frames.push({ tree: state.tree, operation,
            target: operation ? state.tree.nodes.find(node => node.id === operation.nodeId).value : null });
        if (!operation) break;
        state = rotateAnswer(state, operation.nodeId, operation.direction);
    }
    return frames;
}
