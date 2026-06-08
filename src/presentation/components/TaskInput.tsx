'use client';

import { useState } from 'react';
import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import styles from './TaskInput.module.css';
import { Plus, Hash } from 'lucide-react';

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
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="No que você está focando agora?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.mainInput}
          />
          <div className={styles.jiraInputWrapper}>
            <Hash size={16} className={styles.jiraIcon} />
            <input
              type="text"
              placeholder="Jira Key"
              value={jiraKey}
              onChange={(e) => setJiraKey(e.target.value)}
              className={styles.jiraInput}
            />
          </div>
        </div>
        <button type="submit" className={styles.submitBtn} disabled={!description.trim()}>
          <Plus size={20} />
          <span>Iniciar</span>
        </button>
      </form>

      {templates.length > 0 && (
        <div className={styles.templates}>
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
