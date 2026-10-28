"use client";

import { useTranslations } from 'next-intl';

// BST overrides only structure-specific copy; existing shared labels stay in
// AVLExercises so the AVL/quick/introduction contracts remain unchanged.
export default function useExerciseTranslations(variant = 'avl') {
    const common = useTranslations('AVLExercises');
    const specific = useTranslations(variant === 'bst' ? 'BSTExercises' : 'AVLExercises');
    return (key, values) => specific.has(key) ? specific(key, values) : common(key, values);
}
