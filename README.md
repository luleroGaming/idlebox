# idlebox

**idlebox** is a TypeScript + Svelte playground for building incremental / idle games.

This repository is organized as a small monorepo with three main parts:

- **`framework/`** — a reusable game framework (logic, state, saves, tick loop, utilities)
- **`games/`** — one or more incremental game projects built on top of the framework
- **`docs/`** — notes, design decisions, and documentation

The goal is to iterate on the framework and the games in parallel: games provide real use cases, and the framework evolves based on what is actually needed (instead of trying to design a generic engine upfront).

At the moment, this repo focuses on being **simple to install**, **easy to run locally**, and friendly for experimentation.

## Prerequisites

To work on this repository, you’ll need:

### Required

- **Git** (to clone the repository)
- **Node.js** (recommended: latest LTS)
- **npm** (comes with Node.js)

### Recommended

- **VS Code**
- **Svelte extension** for VS Code
- **Prettier** (formatter)

## Installation

Follow these steps to get the repository running locally:

1. **Clone the repository**
```bash
git clone https://github.com/your-username/idlebox.git
cd idlebox
````

2. **Install dependencies**

```bash
npm install
```

> This will install dependencies for all workspace packages (framework + games).

3. **Verify installation**

```bash
node -v
npm -v
```

> Make sure Node.js and npm are correctly installed.

## How-to

### Add a game to the repo

Within games directory:

```bash
npx sv create my-game
```

1. Template: SveltKit minimal
2. Type checking: TypeScript Syntax
3. Add: prettier + eslint + vitest
4. Vitest for: unit & component testing
5. Package manager: npm

### Run a game locally

```bash
cd games/my-game
npm run dev -- --open
```

