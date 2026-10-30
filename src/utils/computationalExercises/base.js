import { convertBase, validateInput } from '../computationalMath/BaseConverterLogic.js';

export const BASES = [2, 8, 10, 16];
export const MAX_VALUE = 255;

export function generateBaseChallenge({ from, to } = {}, previous = null, random = Math.random) {
    const pick = size => Math.min(size - 1, Math.max(0, Math.floor(random() * size)));
    if (!BASES.includes(from) || !BASES.includes(to) || from === to) {
        from = BASES[pick(BASES.length)];
        const destinations = BASES.filter(base => base !== from);
        to = destinations[pick(destinations.length)];
    }
    let value = pick(MAX_VALUE + 1);
    if (previous?.from === from && previous?.to === to && previous?.value === value) value = (value + 1) % (MAX_VALUE + 1);
    return { from, to, value, number: convertBase(String(value), 10, from), answer: convertBase(String(value), 10, to) };
}

export function checkBaseAnswer(challenge, raw) {
    const answer = raw.trim();
    if (!answer) return 'empty';
    // A ferramenta aceita frações/sinal. Estes exercícios são só de inteiros não negativos.
    if (!/^[0-9a-z]+$/i.test(answer) || !validateInput(answer, challenge.to)) return 'invalid';
    const value = Number(convertBase(answer, challenge.to, 10));
    if (!Number.isSafeInteger(value) || value < 0) return 'invalid';
    return value === challenge.value ? 'correct' : 'wrong';
}

export function baseResolution(challenge) {
    const digits = challenge.number.toUpperCase().split('');
    return digits.map((digit, index) => `${convertBase(digit, challenge.from, 10)} × ${challenge.from}^${digits.length - index - 1}`).join(' + ')
        + ` = ${challenge.value} (${10})`;
}

export function baseDivisionSteps(challenge) {
    const steps = [];
    let value = challenge.value;
    do {
        const quotient = Math.floor(value / challenge.to);
        steps.push({ value, base: challenge.to, quotient, remainder: convertBase(String(value % challenge.to), 10, challenge.to) });
        value = quotient;
    } while (value > 0);
    return steps;
}

export const initialBaseState = { challenge: null, answer: '', phase: 'active', helped: false,
    hint: false, feedback: '', correct: 0, assisted: 0, errors: 0, failures: [] };

export function baseReducer(state, action) {
    if (action.type === 'new' || action.type === 'repeat') return { ...initialBaseState,
        correct: state.correct, assisted: state.assisted, errors: state.errors,
        challenge: action.type === 'repeat' ? state.challenge : action.challenge };
    if (!state.challenge || state.phase !== 'active') return state;
    if (action.type === 'answer') return { ...state, answer: action.value, feedback: '' };
    if (action.type === 'hint') return { ...state, hint: true, helped: true };
    if (action.type === 'reveal') return { ...state, phase: 'revealed', helped: true, assisted: state.assisted + 1, feedback: 'revealed' };
    if (action.type !== 'check') return state;
    const feedback = checkBaseAnswer(state.challenge, state.answer);
    if (feedback === 'correct') return { ...state, phase: 'completed', feedback: state.helped ? 'assisted' : 'correct',
        correct: state.correct + (state.helped ? 0 : 1), assisted: state.assisted + (state.helped ? 1 : 0) };
    const fingerprint = state.answer.trim().toUpperCase();
    const fresh = feedback !== 'empty' && !state.failures.includes(fingerprint);
    return { ...state, feedback, errors: state.errors + Number(fresh),
        failures: fresh ? [...state.failures, fingerprint] : state.failures };
}
