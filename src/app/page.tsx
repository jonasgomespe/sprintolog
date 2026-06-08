'use client';

import { useEffect } from 'react';
import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import styles from './page.module.css';
import { TaskInput } from '@/presentation/components/TaskInput';
import { ActiveTaskList } from '@/presentation/components/ActiveTaskList';
import { LogList } from '@/presentation/components/LogList';
import { TimeClockSection } from '@/presentation/components/TimeClockSection';
import { Header } from '@/presentation/components/Header';
import { Footer } from '@/presentation/components/Footer';

export default function Home() {
  const { init, isLoading } = useSprintoStore();

  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando seu fluxo...</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.container}>
        <section className={styles.topSection}>
          <TaskInput />
          <TimeClockSection />
        </section>

        <section className={styles.contentSection}>
          <div className={styles.column}>
            <h2 className={styles.sectionTitle}>Tarefas Ativas</h2>
            <ActiveTaskList />
          </div>
          
          <div className={styles.column}>
            <h2 className={styles.sectionTitle}>Histórico Recente</h2>
            <LogList />
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
