import styles from './Footer.module.css';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>SprintoLog &copy; {new Date().getFullYear()}</p>
        <div className={styles.madeBy}>
          <span>Feito com</span>
          <Heart size={14} className={styles.heart} fill="currentColor" />
          <span>para alta performance</span>
        </div>
      </div>
    </footer>
  );
}
