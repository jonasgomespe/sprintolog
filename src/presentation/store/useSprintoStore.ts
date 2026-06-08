import { create } from 'zustand';
import { Task, Log, Template, AppSettings, JiraConfig, TimeClock, AppState } from '@/core/domain/entities';
import { storage } from '@/infrastructure/storage/indexed-db';

interface SprintoStore extends AppState {
  isLoading: boolean;
  
  // Actions
  init: () => Promise<void>;
  
  // Task Actions
  addTask: (description: string, jiraKey?: string) => Promise<void>;
  startTask: (id: string) => Promise<void>;
  pauseTask: (id: string) => Promise<void>;
  stopTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Log Actions
  addLog: (log: Omit<Log, 'id'>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  
  // TimeClock Actions
  updateTimeClock: (data: Partial<TimeClock>) => Promise<void>;
  registerPonto: (type: 'entrada' | 'almoco_ida' | 'almoco_volta' | 'saida') => Promise<void>;
  
  // Settings Actions
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  updateJiraConfig: (config: Partial<JiraConfig>) => Promise<void>;
  setFilters: (filters: Partial<LogFilters>) => void;
}

const DEFAULT_FILTERS: LogFilters = {
  search: '',
  startDate: '',
  endDate: '',
  minDuration: '',
};

const DEFAULT_TIMECLOCK: TimeClock = {
  entrada: null,
  almoco_ida: null,
  almoco_volta: null,
  saida: null,
  config: { jornada: '08:00', intervalo: '01:00', sound: true },
  notified: { almoco: false, saida: false }
};

const DEFAULT_SETTINGS: AppSettings = {
  jiraEnabled: true,
  jiraSimulation: false
};

const DEFAULT_JIRA_CONFIG: JiraConfig = {
  host: '',
  email: '',
  token: '',
  proxy: ''
};

export const useSprintoStore = create<SprintoStore>((set, get) => ({
  activeTasks: [],
  logs: [],
  templates: [],
  settings: DEFAULT_SETTINGS,
  jiraConfig: DEFAULT_JIRA_CONFIG,
  timeClock: DEFAULT_TIMECLOCK,
  filters: DEFAULT_FILTERS,
  isLoading: true,

  init: async () => {
    set({ isLoading: true });
    try {
      const [tasks, logs, templates, settingsArr, jiraConfigArr, timeClockArr] = await Promise.all([
        storage.getAll<Task>('tasks'),
        storage.getAll<Log>('logs'),
        storage.getAll<Template>('templates'),
        storage.getAll<AppSettings & { id: string }>('settings'),
        storage.getAll<JiraConfig & { id: string }>('jiraConfig'),
        storage.getAll<TimeClock & { id: string }>('timeClock'),
      ]);

      set({
        activeTasks: tasks,
        logs: logs.sort((a, b) => b.startTime - a.startTime),
        templates,
        settings: settingsArr[0] || DEFAULT_SETTINGS,
        jiraConfig: jiraConfigArr[0] || DEFAULT_JIRA_CONFIG,
        timeClock: timeClockArr[0] || DEFAULT_TIMECLOCK,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
      set({ isLoading: false });
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  addTask: async (description, jiraKey) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      description,
      jiraKey,
      startTime: 0,
      accumulatedTime: 0,
      isRunning: false,
    };
    await storage.put('tasks', newTask);
    set((state) => ({ activeTasks: [...state.activeTasks, newTask] }));
  },

  startTask: async (id) => {
    const { activeTasks } = get();
    const now = Date.now();
    
    // Stop other running tasks first
    const updatedTasks = activeTasks.map((t) => {
      if (t.isRunning) {
        const updated = {
          ...t,
          isRunning: false,
          accumulatedTime: t.accumulatedTime + (now - t.startTime),
        };
        storage.put('tasks', updated);
        return updated;
      }
      if (t.id === id) {
        const updated = { ...t, isRunning: true, startTime: now };
        storage.put('tasks', updated);
        return updated;
      }
      return t;
    });

    set({ activeTasks: updatedTasks });
  },

  pauseTask: async (id) => {
    const { activeTasks } = get();
    const now = Date.now();

    const updatedTasks = activeTasks.map((t) => {
      if (t.id === id && t.isRunning) {
        const updated = {
          ...t,
          isRunning: false,
          accumulatedTime: t.accumulatedTime + (now - t.startTime),
        };
        storage.put('tasks', updated);
        return updated;
      }
      return t;
    });

    set({ activeTasks: updatedTasks });
  },

  stopTask: async (id) => {
    const { activeTasks } = get();
    const now = Date.now();

    const task = activeTasks.find((t) => t.id === id);
    if (!task || !task.isRunning) return;

    const totalTime = task.accumulatedTime + (now - task.startTime);
    
    // Create Log
    const newLog: Log = {
      id: crypto.randomUUID(),
      description: task.description,
      jiraKey: task.jiraKey,
      startTime: now - totalTime, // Rough estimate of start
      endTime: now,
      totalTime: totalTime,
    };

    await storage.put('logs', newLog);
    await storage.delete('tasks', id);

    set((state) => ({
      activeTasks: state.activeTasks.filter((t) => t.id !== id),
      logs: [newLog, ...state.logs],
    }));
  },

  deleteTask: async (id) => {
    await storage.delete('tasks', id);
    set((state) => ({
      activeTasks: state.activeTasks.filter((t) => t.id !== id),
    }));
  },

  addLog: async (logData) => {
    const newLog: Log = { ...logData, id: crypto.randomUUID() };
    await storage.put('logs', newLog);
    set((state) => ({ logs: [newLog, ...state.logs] }));
  },

  deleteLog: async (id) => {
    await storage.delete('logs', id);
    set((state) => ({
      logs: state.logs.filter((l) => l.id !== id),
    }));
  },

  updateTimeClock: async (data) => {
    const newTimeClock = { ...get().timeClock, ...data, id: 'current' };
    await storage.put('timeClock', newTimeClock);
    set({ timeClock: newTimeClock });
  },

  registerPonto: async (type) => {
    const { timeClock } = get();
    const newTimeClock = { 
      ...timeClock, 
      [type]: Date.now(), 
      id: 'current',
      // Reset notifications when a new day starts (e.g. at entrada)
      notified: type === 'entrada' ? { almoco: false, saida: false } : timeClock.notified
    };
    await storage.put('timeClock', newTimeClock);
    set({ timeClock: newTimeClock });
  },

  updateSettings: async (settings) => {
    const newSettings = { ...get().settings, ...settings, id: 'current' };
    await storage.put('settings', newSettings);
    set({ settings: newSettings });
  },

  updateJiraConfig: async (config) => {
    const newConfig = { ...get().jiraConfig, ...config, id: 'current' };
    await storage.put('jiraConfig', newConfig);
    set({ jiraConfig: newConfig });
  },
}));
