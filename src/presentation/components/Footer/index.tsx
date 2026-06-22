import styles from './style.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>SPRINTOLOG &copy; {new Date().getFullYear()}</p>
        <div className={styles.madeBy}>
          <span>SYS. STATUS:</span>
          <span className={styles.status}>OPERACIONAL</span>
        </div>
      </div>
    </footer>
  );
}
