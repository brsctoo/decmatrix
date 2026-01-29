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
}) {
  return (
    <button
      className={`
        ${styles.reactiveButton}
        ${active ? styles.active : ''}
        ${!haveIsOverStyle ? styles.noHover : ''}
        ${extraStyles}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default ReactiveButton;