import { analyzeSequence } from './generator.js';
import { createExercise, insertionSlot, insertAnswer } from './lesson.js';

function prepare(sequence) {
    const reference = analyzeSequence(sequence.slice(0, -1)).tree;
    let state = { ...createExercise(sequence), tree: reference, index: sequence.length - 1 };
    const slot = insertionSlot(reference, sequence.at(-1));
    state = insertAnswer(state, slot.parentId, slot.side);
    return { ...state, correct: 0, feedback: { key: 'quickReady', values: { value: sequence.at(-1) } } };
}

// A fixed introduction, not a random or continuous practice session.
export function createIntroChallenge() {
    return prepare([30, 20, 10]);
}

// Build only the starting puzzle automatically. All rotations after display are
// handled by the same manual validator as the full exercise, with separate state.
export function generateQuickChallenge(kind = 'single', random = Math.random, previous = []) {
    if (!['single', 'double'].includes(kind)) throw new Error('Invalid quick challenge kind');
    const wanted = kind === 'single' ? 1 : 2;
    const finish = sequence => {
        if (sequence.join(',') === previous.join(',')) sequence = sequence.map(value => value + 1);
        return prepare(sequence);
    };
    for (let attempt = 0; attempt < 80; attempt++) {
        const count = 3 + Math.floor(random() * 5);
        const pool = Array.from({ length: 150 }, (_, i) => i - 40);
        const sequence = [];
        for (let i = 0; i < count; i++) sequence.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
        const state = finish(sequence);
        if (state.phase === 'REBALANCING' && state.pending.length === wanted) return state;
    }
    const base = Math.floor(random() * 80) - 30;
    const gap = 2 + Math.floor(random() * 12);
    const patterns = kind === 'single' ? [[3, 2, 1], [1, 2, 3]] : [[3, 1, 2], [1, 3, 2]];
    const sequence = patterns[Math.floor(random() * 2)].map(rank => base + rank * gap);
    const state = finish(sequence);
    if (state.pending.length !== wanted) throw new Error('Invalid quick challenge fallback');
    return state;
}
