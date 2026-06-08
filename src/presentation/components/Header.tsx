'use client';

import { useState } from 'react';
import styles from './Header.module.css';
import { Settings, Zap } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.iconBox}>
            <Zap size={20} fill="currentColor" />
          </div>
          <h1>Sprinto<span>Log</span></h1>
        </div>
        
        <button 
          className={styles.settingsBtn} 
          title="Configurações"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings size={20} />
        </button>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
}
