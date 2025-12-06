import { create } from 'zustand';

export interface LogEntry {
    id: string;
    timestamp: number;
    level: 'log' | 'warn' | 'error' | 'info';
    message: string;
    args: any[];
}

interface LogStore {
    logs: LogEntry[];
    addLog: (entry: LogEntry) => void;
    clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
    logs: [],
    addLog: (entry) => set((state) => ({ logs: [...state.logs, entry] })),
    clearLogs: () => set({ logs: [] }),
}));

const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
};

export const initLogInterceptor = () => {
    const addLog = useLogStore.getState().addLog;

    const intercept = (level: LogEntry['level']) => (...args: any[]) => {
        originalConsole[level](...args); // Call original
        addLog({
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            level,
            message: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
            args,
        });
    };

    console.log = intercept('log');
    console.warn = intercept('warn');
    console.error = intercept('error');
    console.info = intercept('info');
};
