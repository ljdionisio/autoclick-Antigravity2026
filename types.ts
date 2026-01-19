export interface TargetButton {
  id: string;
  name: string;
  triggerText: string;
  color: string;
  confidenceThreshold: number;
  shortcut: string;
  status: 'active' | 'inactive';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'bridge';
  message: string;
}

export interface SystemMetrics {
  totalClicks: number;
  uptime: string;
  filesChangedCurrentBatch: number;
  bridgeStatus: 'connected' | 'disconnected' | 'connecting';
  safetyLockActive: boolean;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  targets: string[];
  createdAt: string;
  isActive: boolean;
}

export interface AppSettings {
  bridgeUrl: string;
  maxFilesPerBatch: number;
  autoReconnect: boolean;
  soundEnabled: boolean;
  theme: 'dark' | 'system';
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}
