import { SYSTEM_CONFIG } from './config/system.config';

export type CommandHandler = (args: string[]) => Promise<string> | string;

export interface BackendData {
  companyInfo?: {
    company: string;
    domain: string;
    founder: string;
    coFounder: string;
    partner: string;
    partnerCompany: string;
    partnerWebsite: string;
  };
  projects?: Array<{ id: string; name: string; description: string }>;
  features?: string[];
  services?: Array<{ id: string; name: string; description: string }>;
  partner?: { organization: string; representative: string; website: string };
  tools?: string[];
  systemState?: { version: string; networkStatus: string; securityMode: string };
}

const COMMAND_LIST = [
  'help', 'info', 'about', 'features', 'projects', 'services', 'partner',
  'dashboard', 'tools', 'network', 'networks', 'security', 'research', 'repo',
  'roadmap', 'status', 'systems', 'contact', 'fields', 'scan', 'intel',
  'threat', 'threats', 'try', 'demo', 'news', 'updates', 'search', 'version',
  'social', 'collaborate', 'clear',
];

export function getAllCommands(): string[] {
  return [...COMMAND_LIST];
}

export function getAutocompleteSuggestions(partial: string): string | null {
  if (!partial || partial.trim() === '') return null;
  const p = partial.toLowerCase().trim();
  const match = COMMAND_LIST.find(c => c.startsWith(p) && c !== p);
  return match ?? null;
}

function staticOutput(lines: string[]): string {
  return lines.join('\n');
}

export function createCommandEngine(getBackend: () => BackendData): Record<string, CommandHandler> {
  const get = getBackend;

  return {
    help: () => staticOutput([
      'Available commands:',
      ...(COMMAND_LIST.join(', ').match(/.{1,60}(\s|,|$)/g) ?? []).map((s) => s.trim()),
      '',
      'Type a command or click a shortcut above. Use ↑↓ for history, Tab for autocomplete.',
    ]),

    info: () => {
      const c = get().companyInfo;
      if (c) {
        return staticOutput([
          `Company: ${c.company}`,
          `Domain: ${c.domain}`,
          '',
          `Founder: ${c.founder}`,
          `Co-Founder & CEO: ${c.coFounder}`,
          '',
          `Partner: ${c.partner}`,
          `Partner Company: ${c.partnerCompany}`,
          `Website: ${c.partnerWebsite}`,
        ]);
      }
      return staticOutput([
        'Company: Trigon',
        'Domain: Cybersecurity & Artificial Intelligence',
        '',
        'Founder: G Mojesh',
        'Co-Founder & CEO: J Vinay',
        '',
        'Partner: Y Sri Vardhan',
        'Partner Company: Sripto',
        'Website: sripto.tech',
      ]);
    },

    about: () => staticOutput([
      'Cybersecurity intelligence',
      'AI threat detection',
      'Phishing email analysis',
      'Malicious link verification',
      'Steganography detection',
      'Enterprise cyber analytics',
    ]),

    features: () => {
      const f = get().features;
      if (f && f.length) return f.join('\n');
      return staticOutput([
        'AI Threat Detection',
        'Phishing Email Analyzer',
        'Malicious Link Scanner',
        'Steganography Detection',
        'Cyber Intelligence Engine',
        'Enterprise Security Dashboards',
      ]);
    },

    projects: () => {
      const p = get().projects;
      if (p && p.length) {
        return p.map(x => `• ${x.name}\n  ${x.description}`).join('\n\n');
      }
      return staticOutput([
        '• CyberOS Terminal Platform',
        '  Browser-based cyber defense terminal',
        '',
        '• Trigon Threat Scanner',
        '  AI-powered threat detection',
        '',
        '• AI Security Engine',
        '  Enterprise security analytics',
      ]);
    },

    services: () => {
      const s = get().services;
      if (s && s.length) {
        return s.map(x => `• ${x.name}\n  ${x.description}`).join('\n\n');
      }
      return staticOutput([
        '• Threat Intelligence — Real-time threat analysis',
        '• Phishing Detection — Email and link analysis',
        '• Security Audits — Enterprise security assessments',
      ]);
    },

    partner: () => {
      const p = get().partner;
      if (p) {
        return staticOutput([
          `Partner Organization: ${p.organization}`,
          `Representative: ${p.representative}`,
          `Website: ${p.website}`,
        ]);
      }
      return staticOutput([
        'Partner Organization: Sripto',
        'Representative: Y Sri Vardhan',
        'Website: sripto.tech',
      ]);
    },

    dashboard: () => {
      return 'OPEN_DASHBOARD';
    },

    tools: () => {
      const t = get().tools;
      if (t && t.length) return t.join('\n');
      return staticOutput([
        'Phishing Scanner',
        'Link Analyzer',
        'Steganography Detector',
        'Threat Intelligence Feed',
        'Vulnerability Scanner',
      ]);
    },

    network: () => networkOutput(get()),
    networks: () => networkOutput(get()),

    security: () => staticOutput([
      'Security Mode: Active',
      'Encryption: End-to-end',
      'Infrastructure: Internet Computer Protocol',
    ]),

    research: () => staticOutput([
      'Steganography detection research',
      'AI threat modeling',
      'Phishing pattern analysis',
    ]),

    repo: () => staticOutput([
      'Repository: Check GitHub via social command',
    ]),

    roadmap: () => staticOutput([
      'Q1: CyberOS Terminal release',
      'Q2: AI Threat Engine v1.0',
      'Q3: Enterprise dashboards',
    ]),

    status: () => statusOutput(get()),
    systems: () => staticOutput([
      'CyberOS Terminal — Online',
      'Threat Scanner — Online',
      'AI Engine — Online',
    ]),

    contact: () => {
      return 'OPEN_CONTACT';
    },

    fields: () => staticOutput([
      'Cybersecurity',
      'Artificial Intelligence',
      'Threat Intelligence',
      'Security Analytics',
      'Digital Risk Monitoring',
    ]),

    scan: () => staticOutput([
      '[SIMULATED SCAN]',
      'Scanning...',
      '  Network: OK',
      '  Endpoints: OK',
      '  No critical vulnerabilities detected.',
    ]),

    intel: () => staticOutput([
      'Threat Intel Feed: Active',
      'Last update: Real-time',
      'Sources: Internal + OSINT',
    ]),

    threat: () => threatsOutput(),
    threats: () => threatsOutput(),

    try: () => staticOutput([
      'Try a tool:',
      '  • Try phishing scanner',
      '  • Try link analyzer',
      '  • Try steganography detector',
    ]),

    demo: () => staticOutput([
      '• Malicious Link Scanner Demo',
      '• Phishing Email Detection Demo',
      '• Steganography Analyzer Demo',
    ]),

    news: () => updatesOutput(),
    updates: () => updatesOutput(),

    search: (args) => {
      const q = args.join(' ').trim() || 'phishing';
      return staticOutput([
        `Search results for "${q}":`,
        '  Phishing detection modules',
        '  Link analysis tools',
        '  Threat intelligence docs',
      ]);
    },

    version: () => staticOutput([
      SYSTEM_CONFIG.version,
      `Security Engine ${SYSTEM_CONFIG.securityEngine}`,
      `AI Threat Engine ${SYSTEM_CONFIG.aiThreatEngine}`,
    ]),

    social: () => staticOutput([
      'GitHub',
      'LinkedIn',
      'Research Publications',
      'Documentation',
    ]),

    collaborate: () => staticOutput([
      'Partnership and collaboration inquiries:',
      'Use the contact command or visit our website.',
    ]),

    clear: () => 'CLEAR',
  };
}

function networkOutput(get: () => BackendData): string {
  const s = get().systemState;
  return staticOutput([
    'Network Status: Online',
    'Infrastructure: Internet Computer Protocol',
    `Security Mode: ${s?.securityMode ?? 'Active'}`,
  ]);
}

function statusOutput(get: () => BackendData): string {
  const s = get().systemState;
  return staticOutput([
    `Version: ${s?.version ?? SYSTEM_CONFIG.version}`,
    `Network: ${s?.networkStatus ?? 'Online'}`,
    `Security: ${s?.securityMode ?? 'Active'}`,
  ]);
}

function threatsOutput(): string {
  return staticOutput([
    'Active threat categories:',
    '  Phishing — Monitored',
    '  Malware — Monitored',
    '  DDoS — Monitored',
    'No active incidents.',
  ]);
}

function updatesOutput(): string {
  return staticOutput([
    'AI Threat Engine v1.2 Released',
    'New phishing detection module deployed',
    'Steganography research published',
  ]);
}
