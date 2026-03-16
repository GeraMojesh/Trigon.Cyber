import { getAllCommands } from './command-engine';

const CONTAINER_ID = 'command-buttons';

export function renderCommandShortcuts(onCommand: (cmd: string) => void): void {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) return;

  container.innerHTML = '';
  const commands = getAllCommands();

  for (const cmd of commands) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'command-btn';
    btn.textContent = cmd;
    btn.addEventListener('click', () => onCommand(cmd));
    container.appendChild(btn);
  }
}
