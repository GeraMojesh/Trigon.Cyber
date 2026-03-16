import type { BackendData } from './command-engine';

const DASHBOARD_OVERLAY_ID = 'dashboard-overlay';
const DASHBOARD_CONTENT_ID = 'dashboard-content';
const DASHBOARD_CLOSE_ID = 'dashboard-close';

export function openDashboard(data: BackendData): void {
  const overlay = document.getElementById(DASHBOARD_OVERLAY_ID);
  const content = document.getElementById(DASHBOARD_CONTENT_ID);
  if (!overlay || !content) return;

  content.innerHTML = `
    <div class="dashboard-section">
      <h3>Threat Analytics</h3>
      <ul>
        <li class="status-ok">Phishing: Monitored</li>
        <li class="status-ok">Malware: Monitored</li>
        <li class="status-ok">DDoS: Monitored</li>
      </ul>
    </div>
    <div class="dashboard-section">
      <h3>Security Alerts</h3>
      <ul>
        <li class="status-ok">No active alerts</li>
      </ul>
    </div>
    <div class="dashboard-section">
      <h3>Platform Status</h3>
      <ul>
        <li class="status-ok">Network: ${data.systemState?.networkStatus ?? 'Online'}</li>
        <li class="status-ok">Security: ${data.systemState?.securityMode ?? 'Active'}</li>
        <li class="status-ok">Version: ${data.systemState?.version ?? 'Trigon CyberOS v1.0'}</li>
      </ul>
    </div>
    <div class="dashboard-section">
      <h3>Threat Intelligence Feed</h3>
      <ul>
        <li>Real-time threat intel active</li>
        <li>AI analysis enabled</li>
      </ul>
    </div>
  `;

  overlay.classList.remove('hidden');
}

export function initDashboardClose(): void {
  const closeBtn = document.getElementById(DASHBOARD_CLOSE_ID);
  const overlay = document.getElementById(DASHBOARD_OVERLAY_ID);
  if (!closeBtn || !overlay) return;

  closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
}
