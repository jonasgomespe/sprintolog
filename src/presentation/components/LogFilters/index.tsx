'use client';

import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import styles from './style.module.css';
import { Search, Calendar, Clock, X } from 'lucide-react';

export function LogFilters() {
  const { filters, setFilters } = useSprintoStore();

  const clearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      minDuration: '',
    });
  };

  const hasActiveFilters = filters.search || filters.startDate || filters.endDate || filters.minDuration;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.inputWrapper}>
          <Search size={16} className={styles.icon} />
          <input
            type="text"
            placeholder="Buscar por descrição ou Jira..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputWrapper}>
          <Calendar size={16} className={styles.icon} />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ startDate: e.target.value })}
            className={styles.input}
            title="Data Inicial"
          />
        </div>
        <div className={styles.inputWrapper}>
          <Calendar size={16} className={styles.icon} />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ endDate: e.target.value })}
            className={styles.input}
            title="Data Final"
          />
        </div>
        <div className={styles.inputWrapper}>
          <Clock size={16} className={styles.icon} />
          <input
            type="number"
            placeholder="Min. minutos"
            value={filters.minDuration}
            onChange={(e) => setFilters({ minDuration: e.target.value })}
            className={styles.input}
            title="Duração Mínima"
          />
        </div>
        
        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearBtn} title="Limpar Filtros">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
