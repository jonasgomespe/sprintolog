'use client';

import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import { Modal } from './Modal';
import styles from './SettingsModal.module.css';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { jiraConfig, timeClock, updateJiraConfig, updateTimeClock } = useSprintoStore();
  
  const [localJira, setLocalJira] = useState(jiraConfig);
  const [localClockConfig, setLocalClockConfig] = useState(timeClock.config);

  const handleSave = async () => {
    await updateJiraConfig(localJira);
    await updateTimeClock({ config: localClockConfig });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configurações">
      <div className={styles.section}>
        <h4>Integração Jira</h4>
        <div className={styles.field}>
          <label>Host do Jira</label>
          <input 
            type="text" 
            value={localJira.host} 
            onChange={(e) => setLocalJira({...localJira, host: e.target.value})}
            placeholder="ex: sua-empresa.atlassian.net"
          />
        </div>
        <div className={styles.field}>
          <label>Email</label>
          <input 
            type="email" 
            value={localJira.email} 
            onChange={(e) => setLocalJira({...localJira, email: e.target.value})}
          />
        </div>
        <div className={styles.field}>
          <label>API Token</label>
          <input 
            type="password" 
            value={localJira.token} 
            onChange={(e) => setLocalJira({...localJira, token: e.target.value})}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h4>Jornada de Trabalho</h4>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Carga Horária</label>
            <input 
              type="time" 
              value={localClockConfig.jornada} 
              onChange={(e) => setLocalClockConfig({...localClockConfig, jornada: e.target.value})}
            />
          </div>
          <div className={styles.field}>
            <label>Intervalo</label>
            <input 
              type="time" 
              value={localClockConfig.intervalo} 
              onChange={(e) => setLocalClockConfig({...localClockConfig, intervalo: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
        <button onClick={handleSave} className={styles.saveBtn}>Salvar Alterações</button>
      </div>
    </Modal>
  );
}
