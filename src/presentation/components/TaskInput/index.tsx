'use client';

import { useState } from 'react';
import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import styles from './style.module.css';
import { Terminal, Hash } from 'lucide-react';

export function TaskInput() {
  const [description, setDescription] = useState('');
  const [jiraKey, setJiraKey] = useState('');
  const addTask = useSprintoStore((state) => state.addTask);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    await addTask(description, jiraKey);
    setDescription('');
    setJiraKey('');
  };

  const templates = useSprintoStore((state) => state.templates);

  const applyTemplate = (template: any) => {
    setDescription(template.description);
    setJiraKey(template.jiraKey || '');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Novo Sprint</h2>
      <form className={styles.terminalBox} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <div className={styles.promptLine}>
            <Terminal size={16} className={styles.promptIcon} />
            <input
              type="text"
              placeholder="No que você vai trabalhar?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.mainInput}
              autoComplete="off"
            />
          </div>
          <div className={styles.promptLine}>
            <Hash size={16} className={styles.promptIcon} />
            <input
              type="text"
              placeholder="TICKET-123 (Opcional)"
              value={jiraKey}
              onChange={(e) => setJiraKey(e.target.value)}
              className={styles.jiraInput}
              autoComplete="off"
            />
          </div>
        </div>
        <button type="submit" className={styles.submitBtn} disabled={!description.trim()}>
          [ INICIAR SPRINT ]
        </button>
      </form>

      {templates.length > 0 && (
        <div className={styles.templates}>
          <span className={styles.templatesLabel}>TEMPLATES:</span>
          {templates.map(t => (
            <button key={t.id} onClick={() => applyTemplate(t)} className={styles.templateBtn}>
              {t.description}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
