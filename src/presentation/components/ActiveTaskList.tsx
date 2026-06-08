'use client';

import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import styles from './ActiveTaskList.module.css';
import { Play, Pause, Square, Trash2, Hash } from 'lucide-react';
import { useState, useEffect } from 'react';

function formatTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}

function TaskItem({ task }: { task: any }) {
  const { startTask, pauseTask, stopTask, deleteTask } = useSprintoStore();
  const [elapsed, setElapsed] = useState(task.accumulatedTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (task.isRunning) {
      interval = setInterval(() => {
        setElapsed(task.accumulatedTime + (Date.now() - task.startTime));
      }, 1000);
    } else {
      setElapsed(task.accumulatedTime);
    }
    return () => clearInterval(interval);
  }, [task.isRunning, task.startTime, task.accumulatedTime]);

  return (
    <div className={`${styles.taskItem} ${task.isRunning ? styles.running : ''}`}>
      <div className={styles.taskInfo}>
        <div className={styles.taskTitleRow}>
          <span className={styles.description}>{task.description}</span>
          {task.jiraKey && (
            <span className={styles.jiraBadge}>
              <Hash size={10} />
              {task.jiraKey}
            </span>
          )}
        </div>
        <span className={styles.timer}>{formatTime(elapsed)}</span>
      </div>
      
      <div className={styles.actions}>
        {!task.isRunning ? (
          <button onClick={() => startTask(task.id)} className={styles.playBtn} title="Iniciar">
            <Play size={18} fill="currentColor" />
          </button>
        ) : (
          <>
            <button onClick={() => pauseTask(task.id)} className={styles.pauseBtn} title="Pausar">
              <Pause size={18} fill="currentColor" />
            </button>
            <button onClick={() => stopTask(task.id)} className={styles.stopBtn} title="Finalizar e Registrar">
              <Square size={18} fill="currentColor" />
            </button>
          </>
        )}
        <button onClick={() => deleteTask(task.id)} className={styles.deleteBtn} title="Excluir">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export function ActiveTaskList() {
  const activeTasks = useSprintoStore((state) => state.activeTasks);

  if (activeTasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nenhuma tarefa ativa. Comece algo novo!</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {activeTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
