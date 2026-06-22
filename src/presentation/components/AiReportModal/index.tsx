'use client';

import { useState } from 'react';
import { useSprintoStore } from '@/presentation/store/useSprintoStore';
import { Modal } from '../Modal';
import styles from './style.module.css';
import { Sparkles, Copy, RefreshCcw } from 'lucide-react';

interface AiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiReportModal({ isOpen, onClose }: AiReportModalProps) {
  const { logs } = useSprintoStore();
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    if (logs.length === 0) return;
    setIsLoading(true);
    
    try {
      const logsSummary = logs.map(l => ({
        task: l.description,
        jira: l.jiraKey,
        duration: Math.round(l.totalTime / (1000 * 60)) + ' min'
      }));

      const prompt = `Atue como um desenvolvedor sênior. Com base no histórico abaixo, escreva um resumo conciso para a Daily Scrum em português. Regras: Use primeira pessoa, use bullet points, destaque os tickets do Jira. Dados: ${JSON.stringify(logsSummary)}`;

      // Usando uma rota de API para não expor a chave no frontend (ideal)
      // Mas para manter a paridade com o focuslog, vou usar um placeholder ou pedir a chave
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      setReport(data.text);
    } catch (error) {
      console.error(error);
      setReport('Erro ao gerar relatório. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Relatório de IA para Daily">
      <div className={styles.container}>
        {report ? (
          <div className={styles.reportArea}>
            <pre className={styles.reportText}>{report}</pre>
            <div className={styles.actions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                <Copy size={16} />
                Copiar
              </button>
              <button onClick={generateReport} className={styles.regenBtn} disabled={isLoading}>
                <RefreshCcw size={16} className={isLoading ? styles.spin : ''} />
                Gerar Novamente
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Sparkles size={48} className={styles.sparkleIcon} />
            <p>Transforme seus logs em um resumo profissional para sua Daily Scrum.</p>
            <button onClick={generateReport} className={styles.generateBtn} disabled={isLoading || logs.length === 0}>
              {isLoading ? 'Gerando...' : 'Gerar Relatório Agora'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
