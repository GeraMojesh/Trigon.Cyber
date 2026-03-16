import { SYSTEM_CONFIG } from './config/system.config';
import {
  createCommandEngine,
  getAutocompleteSuggestions,
  type CommandHandler,
} from './command-engine';
import { getBackendData, initBackend, storeMessage } from './icp-client';
import { renderCommandShortcuts } from './navigation';
import { openDashboard, initDashboardClose } from './dashboard';

const BOOT_OUTPUT_ID = 'boot-output';
const COMMAND_OUTPUT_ID = 'command-output';
const TERMINAL_INPUT_ID = 'terminal-input';
const CURSOR_ID = 'cursor';
const AUTOCOMPLETE_HINT_ID = 'autocomplete-hint';
const CONTACT_OVERLAY_ID = 'contact-overlay';
const CONTACT_CLOSE_ID = 'contact-close';
const CONTACT_FORM_ID = 'contact-form';

let commandHistory: string[] = [];
let historyIndex = -1;

function bootOutputEl(): HTMLElement | null {
  return document.getElementById(BOOT_OUTPUT_ID);
}

function commandOutputEl(): HTMLElement | null {
  return document.getElementById(COMMAND_OUTPUT_ID);
}

function terminalInputEl(): HTMLInputElement | null {
  return document.getElementById(TERMINAL_INPUT_ID) as HTMLInputElement | null;
}

function appendBootLine(text: string, delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const el = bootOutputEl();
      if (el) {
        const line = document.createElement('div');
        line.className = 'line';
        line.textContent = text;
        el.appendChild(line);
        el.scrollTop = el.scrollHeight;
      }
      resolve();
    }, delayMs);
  });
}

async function runBootSequence(): Promise<void> {
  const el = bootOutputEl();
  if (!el) return;

  for (const line of SYSTEM_CONFIG.asciiBanner) {
    await appendBootLine(line, 80);
  }
  await appendBootLine('', 200);

  for (let i = 0; i < SYSTEM_CONFIG.bootLines.length; i++) {
    const line = SYSTEM_CONFIG.bootLines[i];
    await appendBootLine(line, i === 0 ? 400 : 350);
  }

  await appendBootLine('', 150);
  await appendBootLine('cyberos@trigon:~$', 100);
}

function appendCommandOutput(html: string): void {
  const el = commandOutputEl();
  if (!el) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  el.appendChild(wrap);
  el.scrollTop = el.scrollHeight;
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function outputLinesToHtml(lines: string, cssClass = ''): string {
  return lines
    .split('\n')
    .map((line) => `<div class="line ${cssClass}">${escapeHtml(line)}</div>`)
    .join('');
}

const engine = createCommandEngine(getBackendData);

function normalizeCommand(input: string): { cmd: string; args: string[] } {
  const parts = input.trim().split(/\s+/).filter(Boolean);
  const cmd = (parts[0] ?? '').toLowerCase();
  const args = parts.slice(1);
  return { cmd, args };
}

async function executeCommand(input: string): Promise<void> {
  const { cmd, args } = normalizeCommand(input);
  if (!cmd) return;

  const handler: CommandHandler | undefined = (engine as Record<string, CommandHandler>)[cmd];
  if (!handler) {
    appendCommandOutput(
      outputLinesToHtml(`Command not found: ${cmd}\nType 'help' for available commands.`, 'info')
    );
    return;
  }

  let result: string;
  try {
    result = await Promise.resolve(handler(args));
  } catch (e) {
    result = `Error: ${e}`;
  }

  if (result === 'CLEAR') {
    const co = commandOutputEl();
    if (co) co.innerHTML = '';
    return;
  }
  if (result === 'OPEN_DASHBOARD') {
    openDashboard(getBackendData());
    return;
  }
  if (result === 'OPEN_CONTACT') {
    document.getElementById(CONTACT_OVERLAY_ID)?.classList.remove('hidden');
    return;
  }

  appendCommandOutput(outputLinesToHtml(result));
}

function updateAutocompleteHint(): void {
  const hintEl = document.getElementById(AUTOCOMPLETE_HINT_ID);
  const inputEl = terminalInputEl();
  if (!hintEl || !inputEl) return;
  const suggestion = getAutocompleteSuggestions(inputEl.value);
  if (suggestion) {
    hintEl.textContent = `  Suggestion: ${suggestion}`;
    hintEl.style.visibility = 'visible';
  } else {
    hintEl.textContent = '';
    hintEl.style.visibility = 'hidden';
  }
}

function setupTerminalInput(): void {
  const input = terminalInputEl();
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = input.value.trim();
      if (raw) {
        commandHistory.push(raw);
        historyIndex = commandHistory.length;
        appendCommandOutput(outputLinesToHtml(`cyberos@trigon:~$ ${raw}`, 'prompt-line'));
        executeCommand(raw);
        input.value = '';
        updateAutocompleteHint();
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const suggestion = getAutocompleteSuggestions(input.value);
      if (suggestion) {
        input.value = suggestion;
        updateAutocompleteHint();
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex] ?? '';
      }
      updateAutocompleteHint();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex] ?? '';
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
      updateAutocompleteHint();
      return;
    }
  });

  input.addEventListener('input', updateAutocompleteHint);
  input.addEventListener('blur', () => {
    document.getElementById(CURSOR_ID)?.classList.add('blink');
  });
  input.addEventListener('focus', () => {
    document.getElementById(CURSOR_ID)?.classList.remove('blink');
  });
}

function onShortcutCommand(cmd: string): void {
  const input = terminalInputEl();
  const output = commandOutputEl();
  if (!input || !output) return;
  appendCommandOutput(outputLinesToHtml(`cyberos@trigon:~$ ${cmd}`, 'prompt-line'));
  executeCommand(cmd);
  input.value = '';
  updateAutocompleteHint();
}

function setupContact(): void {
  document.getElementById(CONTACT_CLOSE_ID)?.addEventListener('click', () => {
    document.getElementById(CONTACT_OVERLAY_ID)?.classList.add('hidden');
  });
  document.getElementById(CONTACT_OVERLAY_ID)?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (target?.id === CONTACT_OVERLAY_ID) {
      target.classList.add('hidden');
    }
  });

  const form = document.getElementById(CONTACT_FORM_ID) as HTMLFormElement | null;
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') as string)?.trim() ?? '';
      const email = (fd.get('email') as string)?.trim() ?? '';
      const message = (fd.get('message') as string)?.trim() ?? '';
      const result = await storeMessage(name, email, message);
      if (result.ok) {
        form.reset();
        document.getElementById(CONTACT_OVERLAY_ID)?.classList.add('hidden');
        appendCommandOutput(outputLinesToHtml('Message sent successfully.', 'success'));
      } else {
        appendCommandOutput(outputLinesToHtml(`Error: ${result.err ?? 'Failed to send'}`, 'info'));
      }
    });
  }
}

async function main(): Promise<void> {
  await initBackend();
  await runBootSequence();
  bootOutputEl()?.classList.add('prompt-line');
  renderCommandShortcuts(onShortcutCommand);
  setupTerminalInput();
  initDashboardClose();
  setupContact();
  terminalInputEl()?.focus();
}

main();
