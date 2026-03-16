# Trigon Cyber Defense Terminal Platform

A cyber defense command center terminal and company website for **Trigon**, deployed on the **Internet Computer Protocol (ICP)**.

## Features

- **Cyber Defense Terminal** — Boot sequence, ASCII banner, command-based navigation
- **Command shortcuts** — Click or type: `help`, `info`, `about`, `features`, `projects`, `dashboard`, `contact`, etc.
- **Terminal behavior** — Blinking cursor, command history (↑↓), **autocomplete** (Tab; e.g. type `fea` → suggestion: `features`)
- **Cyber dragon guardian** — Semi-transparent circuit-style dragon in the background
- **Cyber aesthetic** — Black background, neon green text, electric blue highlights, purple accents
- **Dashboard** — Threat analytics, security alerts, platform status (via `dashboard` command)
- **Contact form** — Messages stored in the backend canister (via `contact` command)
- **ICP** — Frontend (assets) + Backend (Motoko) canisters

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install) (ICP SDK)

### Local development (frontend only)

```bash
npm install
npm run build
npx serve src/frontend/dist -l 3000
```

Open `http://localhost:3000`.

### Full stack (ICP local)

```bash
dfx start --background
dfx canister create --all
dfx build
dfx canister install trigon_backend
dfx canister install trigon_frontend --mode reinstall
```

Then open the frontend URL shown by `dfx canister id trigon_frontend` (e.g. `http://127.0.0.1:4943/?canisterId=<id>`).

### Deploy to ICP mainnet

```bash
dfx deploy --network ic
```

## Project structure

```
trigon-cyber-terminal/
├── dfx.json                 # ICP canisters: trigon_frontend (assets), trigon_backend (Motoko)
├── package.json
├── tsconfig.json
├── src/
│   ├── frontend/
│   │   ├── index.html
│   │   ├── terminal.css
│   │   ├── terminal.ts       # Boot sequence, input, history, autocomplete
│   │   ├── command-engine.ts # All commands and outputs
│   │   ├── navigation.ts     # Command shortcut buttons
│   │   ├── dashboard.ts       # Dashboard overlay
│   │   ├── icp-client.ts     # Backend data / storeMessage (optional ICP)
│   │   ├── config/
│   │   │   └── system.config.ts
│   │   └── dist/             # Built assets (after npm run build)
│   └── backend/
│       ├── main.mo           # Actor: getCompanyInfo, getProjects, storeMessage, etc.
│       ├── storage.mo
│       ├── api.mo
│       └── security.mo
└── README.md
```

## Commands (examples)

| Command     | Description                    |
|------------|--------------------------------|
| `help`     | List all commands              |
| `info`     | Company info (Trigon, founders, partner) |
| `about`    | Mission (cybersecurity, AI, phishing, etc.) |
| `features` | Product features               |
| `projects` | Projects (from backend when on ICP) |
| `services` | Services                       |
| `partner`  | Partner (Sripto, Y Sri Vardhan) |
| `dashboard`| Open cyber defense dashboard   |
| `contact`  | Open contact form              |
| `version`  | System version                 |
| `clear`    | Clear terminal output          |

Plus: `tools`, `network`, `security`, `scan`, `intel`, `threat`, `try`, `demo`, `search`, `social`, `collaborate`, `fields`, `news`, `updates`, `systems`, `roadmap`, `research`, `repo`, `status`.

## Boot sequence

On load, the terminal shows:

1. ASCII art banner: **TRIGON**
2. Lines:
   - Loading cyber kernel...
   - Initializing security modules...
   - Connecting to ICP network...
   - Verifying system integrity...
   - Loading AI threat intelligence...
   - Establishing encrypted environment...
3. **System Ready.**
4. Prompt: `cyberos@trigon:~$`

## Autocomplete

Type a partial command (e.g. `fea`) and the UI shows **Suggestion: features**. Press **Tab** to accept.

## Backend (Motoko)

- **getCompanyInfo()**, **getPartner()**, **getFeatures()**, **getTools()**, **getSystemState()**
- **getProjects()**, **getServices()**, **getLogs()**
- **storeMessage(name, email, message)** — contact form

When the frontend is served by dfx with the backend canister id set, it can call these via agent-js (after `dfx generate` and using the generated declarations).

## License

Proprietary — Trigon.
