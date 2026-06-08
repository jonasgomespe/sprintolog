export interface Task {
  id: string;
  description: string;
  jiraKey?: string;
  startTime: number;
  accumulatedTime: number;
  isRunning: boolean;
}

export interface Log {
  id: string;
  description: string;
  jiraKey?: string;
  startTime: number;
  endTime: number;
  totalTime: number;
  jiraSynced?: boolean;
}

export interface Template {
  id: string;
  description: string;
  jiraKey?: string;
}

export interface TimeClockConfig {
  jornada: string; // "08:00"
  intervalo: string; // "01:00"
  sound: boolean;
}

export interface TimeClock {
  entrada: number | null;
  almoco_ida: number | null;
  almoco_volta: number | null;
  saida: number | null;
  config: TimeClockConfig;
  notified: {
    almoco: boolean;
    saida: boolean;
  };
}

export interface AppSettings {
  jiraEnabled: boolean;
  jiraSimulation: boolean;
}

export interface JiraConfig {
  host: string;
  email: string;
  token: string;
  proxy: string;
}

export interface LogFilters {
  search: string;
  startDate: string;
  endDate: string;
  minDuration: string; // em minutos
}

export interface AppState {
  activeTasks: Task[];
  logs: Log[];
  templates: Template[];
  settings: AppSettings;
  jiraConfig: JiraConfig;
  timeClock: TimeClock;
  filters: LogFilters;
}
