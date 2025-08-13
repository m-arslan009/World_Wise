import styles from "../Css Modules/Button.module.css";

export default function Button({ onClick, children, type, disabled }) {
  const buttonClass = `${styles.btn} ${styles[type] || ""}`;
  return (
    <button onClick={onClick} className={buttonClass} disabled={disabled}>
      {children}
    </button>
  );
}
