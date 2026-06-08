'use client';

import { useState } from 'react';
import styles from './Header.module.css';
import { Settings, Zap, Moon, Sun } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { useSprintoStore } from '../store/useSprintoStore';

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings } = useSprintoStore();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.iconBox}>
            <Zap size={20} fill="currentColor" />
          </div>
          <h1>Sprinto<span>Log</span></h1>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.themeBtn} 
            onClick={toggleTheme}
            title={settings.theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
          >
            {settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className={styles.settingsBtn} 
            title="Configurações"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
}
