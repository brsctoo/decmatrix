import { booleanExpressionSolver } from '../computationalMath/BooleanOperationsLogic.js';
import { createTruthTableLogic } from '../computationalMath/truthTable.js';

// Ordem fixa e IDs estáveis. As chaves também identificam os textos PT/EN.
export const TRUTH_EXERCISES = [
    { id: 'not', variables: ['p'], expression: '¬p', columns: ['¬p'] },
    { id: 'and', variables: ['p', 'q'], expression: 'p ∧ q', columns: ['p ∧ q'] },
    { id: 'or', variables: ['p', 'q'], expression: 'p ∨ q', columns: ['p ∨ q'] },
    { id: 'implies', variables: ['p', 'q'], expression: 'p → q', columns: ['p → q'] },
    { id: 'iff', variables: ['p', 'q'], expression: 'p ↔ q', columns: ['p ↔ q'] },
    { id: 'notOr', variables: ['p', 'q'], expression: '¬p ∨ q', columns: ['¬p', '¬p ∨ q'] },
    { id: 'tautology', variables: ['p', 'q'], expression: '(p ∧ q) → p', columns: ['p ∧ q', '(p ∧ q) → p'] },
    { id: 'three', variables: ['p', 'q', 'r'], expression: '(p ∨ q) ∧ ¬r', columns: ['p ∨ q', '¬r', '(p ∨ q) ∧ ¬r'] },
];

export function buildTruthExercise(exercise) {
    const table = createTruthTableLogic(exercise.variables.map(v => v.toUpperCase()));
    const columns = exercise.columns.map(expression => booleanExpressionSolver({
        expression: expression.toUpperCase(), variableTruthTable: table,
    }));
    return { rows: table.slice(1), expected: table.slice(1).map((_, row) => columns.map(values => values[row])) };
}

export function newTruthState(index = 0, stats = {}) {
    const { expected } = buildTruthExercise(TRUTH_EXERCISES[index]);
    return { index, answers: expected.map(row => row.map(() => '')), marks: [], failures: [],
        phase: 'active', feedback: '', correct: stats.correct ?? 0, assisted: stats.assisted ?? 0, errors: stats.errors ?? 0 };
}

export function truthReducer(state, action) {
    if (action.type === 'select') return newTruthState(action.index, state);
    if (action.type === 'repeat') return newTruthState(state.index, state);
    if (action.type === 'next') return state.index < TRUTH_EXERCISES.length - 1 ? newTruthState(state.index + 1, state) : state;
    if (state.phase !== 'active') return state;
    if (action.type === 'answer') return { ...state, feedback: '',
        answers: state.answers.map((row, r) => row.map((value, c) => r === action.row && c === action.column ? action.value : value)),
        marks: state.marks.map((row, r) => row.map((value, c) => r === action.row && c === action.column ? '' : value)) };
    if (action.type === 'reveal') return { ...state, phase: 'revealed', feedback: 'revealed', assisted: state.assisted + 1 };
    if (action.type !== 'check') return state;
    const { expected } = buildTruthExercise(TRUTH_EXERCISES[state.index]);
    const failures = new Set(state.failures);
    let empty = false, wrong = false;
    const marks = expected.map((row, r) => row.map((value, c) => {
        const answer = state.answers[r][c];
        if (answer === '') { empty = true; return 'empty'; }
        if (answer === String(value)) return 'correct';
        wrong = true;
        failures.add(`${r}:${c}:${answer}`);
        return 'wrong';
    }));
    const completed = !empty && !wrong;
    return { ...state, marks, failures: [...failures], errors: state.errors + failures.size - state.failures.length,
        phase: completed ? 'completed' : 'active', correct: state.correct + Number(completed),
        feedback: empty ? 'empty' : wrong ? 'wrong' : 'correct' };
}
