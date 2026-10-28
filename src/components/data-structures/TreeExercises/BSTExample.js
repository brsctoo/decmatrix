import BinarySearchTree from '@/utils/BinarySearchTree';
import TreeDiagram from './TreeDiagram';
import styles from '../AVLExercises/Exercises.module.css';

export default function BSTExample({ t }) {
    const tree = new BinarySearchTree();
    [40, 20, 60, 10, 30].forEach(value => tree.insert(value));
    return <figure className={`${styles.diagram} ${styles.bstExample}`} data-bst-example>
        <figcaption>{t('example.sequence')}</figcaption>
        <TreeDiagram tree={tree} label={t('example.description')} />
        <p>{t('example.rule')}</p>
    </figure>;
}
