import styles from './Footer.module.css';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.madeBy}>
        </div>
      </div>
    </footer>
  );
}
