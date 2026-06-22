'use client';

import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import styles from './TimeClockSection.module.css';
import { useEffect, useState } from 'react';

function formatTime(ms: number | null) {
  if (!ms) return '--:--';
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function TimeClockSection() {
  const { timeClock, registerPonto } = useSprintoStore();
  const [countdown, setCountdown] = useState<string | null>(null);
  
  const isActive = !!timeClock.entrada && !timeClock.saida;

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeClock.entrada) {
        const [h, m] = timeClock.config.jornada.split(':').map(Number);
        const [ih, im] = timeClock.config.intervalo.split(':').map(Number);
        
        const workMs = (h * 3600000) + (m * 60000);
        const intervalMs = (ih * 3600000) + (im * 60000);
        
        let target: number;
        
        if (timeClock.almoco_ida && !timeClock.almoco_volta) {
            target = timeClock.almoco_ida + intervalMs;
        } else if (timeClock.almoco_volta) {
            const morningWork = timeClock.almoco_ida! - timeClock.entrada;
            const remainingWork = workMs - morningWork;
            target = timeClock.almoco_volta + remainingWork;
        } else {
            target = timeClock.entrada + workMs + intervalMs;
        }

        const diff = target - Date.now();
        if (diff > 0) {
          const s = Math.floor((diff / 1000) % 60);
          const mn = Math.floor((diff / (1000 * 60)) % 60);
          const hr = Math.floor(diff / (1000 * 60 * 60));
          setCountdown(`${hr.toString().padStart(2, '0')}:${mn.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        } else {
          setCountdown('00:00:00');
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeClock]);

  return (
    <div className={`${styles.container} ${isActive ? styles.isActive : ''}`}>
      <div className={styles.displayPanel}>
        <div className={styles.displayLabel}>
          {timeClock.almoco_ida && !timeClock.almoco_volta ? 'TEMPO DE INTERVALO' : 'TEMPO DE JORNADA'}
        </div>
        <div className={styles.displayValue}>
          {countdown || '--:--:--'}
        </div>
      </div>

      <div className={styles.grid}>
        <button 
          onClick={() => registerPonto('entrada')} 
          disabled={!!timeClock.entrada}
          className={`${styles.pontoBtn} ${timeClock.entrada ? styles.active : ''}`}
        >
          <span>ENTRADA</span>
          <span className={styles.time}>{formatTime(timeClock.entrada)}</span>
        </button>

        <button 
          onClick={() => registerPonto('almoco_ida')} 
          disabled={!timeClock.entrada || !!timeClock.almoco_ida}
          className={`${styles.pontoBtn} ${timeClock.almoco_ida ? styles.active : ''}`}
        >
          <span>ALMOÇO</span>
          <span className={styles.time}>{formatTime(timeClock.almoco_ida)}</span>
        </button>

        <button 
          onClick={() => registerPonto('almoco_volta')} 
          disabled={!timeClock.almoco_ida || !!timeClock.almoco_volta}
          className={`${styles.pontoBtn} ${timeClock.almoco_volta ? styles.active : ''}`}
        >
          <span>RETORNO</span>
          <span className={styles.time}>{formatTime(timeClock.almoco_volta)}</span>
        </button>

        <button 
          onClick={() => registerPonto('saida')} 
          disabled={!timeClock.almoco_volta || !!timeClock.saida}
          className={`${styles.pontoBtn} ${timeClock.saida ? styles.active : ''}`}
        >
          <span>SAÍDA</span>
          <span className={styles.time}>{formatTime(timeClock.saida)}</span>
        </button>
      </div>
    </div>
  );
}
