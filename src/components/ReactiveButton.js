import styles from './ReactiveButton.module.css';

{/* 
  Se active for False, a classe é apenas styles.reactiveButton
  Se active for True, a classe é styles.reactiveButton styles.active
*/}

function ReactiveButton({
  label,
  onClick,
  disabled = false,
  active = false,
  extraStyles = '',
  haveIsOverStyle = true,
  blocked = false,
}) {
  return (
    <button
      className={`
        ${styles.reactiveButton}
        ${active ? styles.active : ''}
        ${!haveIsOverStyle ? styles.noHover : ''}
        ${extraStyles}
        ${blocked ? styles.blocked : ''}
      `}
      onClick={onClick}
      disabled={disabled || blocked}
    >
      {label}
    </button>
  );
}

export default ReactiveButton;