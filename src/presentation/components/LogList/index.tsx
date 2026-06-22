'use client';

import { useState } from 'react';
import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import styles from './style.module.css';
import { Trash2, Hash, ExternalLink, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { AiReportModal } from '../AiReportModal';
import { LogFilters } from '../LogFilters';

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function LogList() {
  const { logs, deleteLog, filters } = useSprintoStore();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredLogs = logs.filter((log) => {
    // Busca por texto
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const inDesc = log.description.toLowerCase().includes(search);
      const inJira = log.jiraKey?.toLowerCase().includes(search);
      if (!inDesc && !inJira) return false;
    }

    // Filtro de Data
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      if (log.startTime < start) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).setHours(23, 59, 59, 999);
      if (log.endTime > end) return false;
    }

    // Filtro de Duração
    if (filters.minDuration) {
      const minMs = parseInt(filters.minDuration) * 60000;
      if (log.totalTime < minMs) return false;
    }

    return true;
  });

  const totalTimeFiltered = filteredLogs.reduce((acc, log) => acc + log.totalTime, 0);

  if (logs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Seu histórico está vazio.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.stats}>
          <span>{filteredLogs.length} logs</span>
          <span className={styles.dot}>•</span>
          <span className={styles.totalTime}>{formatDuration(totalTimeFiltered)}</span>
        </div>
        <div className={styles.headerActions}>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`${styles.filterBtn} ${showFilters ? styles.active : ''}`}
            title="Filtros"
          >
            <Filter size={14} />
          </button>
          <button onClick={() => setIsAiModalOpen(true)} className={styles.aiBtn}>
            <Sparkles size={14} />
            Gerar Report IA
          </button>
        </div>
      </div>

      {showFilters && <LogFilters />}

      <div className={styles.list}>
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div key={log.id} className={styles.logItem}>
              <div className={styles.logInfo}>
                <div className={styles.titleRow}>
                  <span className={styles.description}>{log.description}</span>
                  {log.jiraKey && (
                    <span className={styles.jiraBadge}>
                      <Hash size={10} />
                      {log.jiraKey}
                    </span>
                  )}
                </div>
                <div className={styles.meta}>
                  <span>{formatDate(log.startTime)} — {formatDate(log.endTime)}</span>
                  <span className={styles.dot}>•</span>
                  <span className={styles.duration}>{formatDuration(log.totalTime)}</span>
                </div>
              </div>

              <div className={styles.actions}>
                {log.jiraSynced && <CheckCircle2 size={16} className={styles.syncedIcon} />}
                {log.jiraKey && !log.jiraSynced && (
                  <button className={styles.syncBtn} title="Sincronizar com Jira">
                    <ExternalLink size={16} />
                  </button>
                )}
                <button onClick={() => deleteLog(log.id)} className={styles.deleteBtn} title="Excluir">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            Nenhum log encontrado para os filtros selecionados.
          </div>
        )}
      </div>

      <AiReportModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </>
  );
}
