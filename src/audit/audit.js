import { writeFileSync, existsSync, readFileSync } from 'fs';

const auditLogPath = './audit_logs.json';

// Load existing audit logs
const loadAuditLogs = () => {
  if (existsSync(auditLogPath)) {
    return JSON.parse(readFileSync(auditLogPath, 'utf8'));
  }
  return [];
};

// Save audit logs
const saveAuditLogs = (logs) => {
  writeFileSync(auditLogPath, JSON.stringify(logs, null, 2));
};

// Log a change
const logChange = (changeDetails) => {
  const logs = loadAuditLogs();
  const logEntry = {
    ...changeDetails,
    timestamp: new Date().toISOString(),
  };
  logs.push(logEntry);
  saveAuditLogs(logs);
};

export { loadAuditLogs, saveAuditLogs, logChange };