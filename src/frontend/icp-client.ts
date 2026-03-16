import type { BackendData } from './command-engine';

let backendData: BackendData = {};

export function getBackendData(): BackendData {
  return backendData;
}

export function setBackendData(data: Partial<BackendData>): void {
  backendData = { ...backendData, ...data };
}

const defaultData: BackendData = {
  companyInfo: {
    company: 'Trigon',
    domain: 'Cybersecurity & Artificial Intelligence',
    founder: 'G Mojesh',
    coFounder: 'J Vinay',
    partner: 'Y Sri Vardhan',
    partnerCompany: 'Sripto',
    partnerWebsite: 'sripto.tech',
  },
  partner: { organization: 'Sripto', representative: 'Y Sri Vardhan', website: 'sripto.tech' },
  features: [
    'AI Threat Detection',
    'Phishing Email Analyzer',
    'Malicious Link Scanner',
    'Steganography Detection',
    'Cyber Intelligence Engine',
    'Enterprise Security Dashboards',
  ],
  tools: [
    'Phishing Scanner',
    'Link Analyzer',
    'Steganography Detector',
    'Threat Intelligence Feed',
    'Vulnerability Scanner',
  ],
  systemState: { version: 'Trigon CyberOS v1.0', networkStatus: 'Online', securityMode: 'Active' },
  projects: [
    { id: '1', name: 'CyberOS Terminal Platform', description: 'Browser-based cyber defense terminal' },
    { id: '2', name: 'Trigon Threat Scanner', description: 'AI-powered threat detection' },
    { id: '3', name: 'AI Security Engine', description: 'Enterprise security analytics' },
  ],
  services: [
    { id: '1', name: 'Threat Intelligence', description: 'Real-time threat analysis' },
    { id: '2', name: 'Phishing Detection', description: 'Email and link analysis' },
    { id: '3', name: 'Security Audits', description: 'Enterprise security assessments' },
  ],
};

export async function initBackend(): Promise<void> {
  const win = window as unknown as { __BACKEND_CANISTER_ID?: string; ic?: { plug?: unknown } };
  if (win.__BACKEND_CANISTER_ID && win.ic) {
    try {
      const mod = await import(
        /* webpackIgnore: true */
        '../declarations/trigon_backend/index.js'
      ).catch(() => null);
      if (mod?.createActor) {
        const actor = mod.createActor(win.__BACKEND_CANISTER_ID, mod.actorOptions ?? {});
        const [companyInfo, partner, features, tools, systemState, projects, services] = await Promise.all([
          actor.getCompanyInfo().catch(() => null),
          actor.getPartner().catch(() => null),
          actor.getFeatures().catch(() => null),
          actor.getTools().catch(() => null),
          actor.getSystemState().catch(() => null),
          actor.getProjects().catch(() => null),
          actor.getServices().catch(() => null),
        ]);
        setBackendData({
          companyInfo: companyInfo ?? defaultData.companyInfo,
          partner: partner ?? defaultData.partner,
          features: features ?? defaultData.features,
          tools: tools ?? defaultData.tools,
          systemState: systemState ?? defaultData.systemState,
          projects: projects ?? defaultData.projects,
          services: services ?? defaultData.services,
        });
        return;
      }
    } catch {
      /* use defaults */
    }
  }
  setBackendData(defaultData);
}

export async function storeMessage(name: string, email: string, message: string): Promise<{ ok: boolean; err?: string }> {
  const win = window as unknown as { __BACKEND_CANISTER_ID?: string; ic?: unknown };
  if (!win.__BACKEND_CANISTER_ID || !win.ic) return { ok: true };
  try {
    const mod = await import(
      /* webpackIgnore: true */
      '../declarations/trigon_backend/index.js'
    ).catch(() => null);
    if (mod?.createActor) {
      const actor = mod.createActor(win.__BACKEND_CANISTER_ID, mod.actorOptions ?? {});
      const result = await actor.storeMessage(name, email, message);
      if (result && typeof result === 'object' && 'err' in result) return { ok: false, err: String((result as { err: string }).err) };
      return { ok: true };
    }
  } catch (e) {
    return { ok: false, err: String(e) };
  }
  return { ok: true };
}
