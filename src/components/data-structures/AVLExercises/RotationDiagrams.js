import { rotationFrames } from '@/utils/avlExercises/diagrams';
import styles from './Exercises.module.css';
import TreeDiagram from '../TreeExercises/TreeDiagram';

// No client directive, interactivity, external images or simulator instances.
export default function RotationDiagrams({ kind, p }) {
    const frames = rotationFrames(kind);
    return <div className={styles.diagramSteps} data-rotation-case={kind}>
        {frames.map(({ tree, target, operation }, index) => {
            function describe(node) {
                if (!node) return p('diagramEmpty');
                return p('diagramNode', { node: node.value,
                    left: node.left?.value ?? p('diagramEmpty'), right: node.right?.value ?? p('diagramEmpty') });
            }
            const label = p(index === 0 ? 'before' : index === frames.length - 1 ? 'after' : 'middle');
            const summary = tree.nodes.map(describe).join(' ');
            return <figure className={styles.diagram} key={index} data-diagram-step={index}>
                <figcaption><strong>{index + 1}. {label}</strong>
                    <p>{operation ? p('diagramRotate', { node: target, side: p(operation.direction === 'left' ? 'diagramLeft' : 'diagramRight') }) : p('diagramBalanced')}</p>
                </figcaption>
                <TreeDiagram tree={tree} target={target} label={`${kind}: ${label}. ${summary}`} />
                <p className={styles.srOnly}>{summary}</p>
            </figure>;
        })}
    </div>;
}
