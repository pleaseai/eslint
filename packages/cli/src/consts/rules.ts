import type { AgentName } from './options'

export interface EditorRuleConfig {
  path: string
  header?: string
  /** Dynamic header generator based on file patterns */
  getHeader?: (filePatterns: string[]) => string
  appendMode?: boolean
}

export const AGENTS: Record<AgentName, EditorRuleConfig> = {
  'vscode-copilot': {
    path: './.github/copilot-instructions.md',
    header: `---
applyTo: "**/*.{ts,tsx,js,jsx}"
---`,
    appendMode: true,
  },
  'cursor': {
    path: './.cursor/rules/eslint-rules.mdc',
    header: `---
description: ESLint Rules - Code Quality Standards
globs: "**/*.{ts,tsx,js,jsx,json,jsonc,html,vue,svelte,astro,css,yaml,yml,graphql,gql,md,mdx}"
alwaysApply: false
---`,
  },
  'windsurf': {
    path: './.windsurf/rules/eslint-rules.md',
  },
  'zed': {
    path: './.rules',
    appendMode: true,
  },
  'claude': {
    path: './.claude/rules/eslint-rules.md',
    getHeader: (filePatterns: string[]) => {
      const patterns = filePatterns.length > 0
        ? filePatterns.join(', ')
        : '**/*.{ts,tsx,js,jsx,json,vue,svelte,astro}'
      return `---\npaths: "${patterns}"\n---`
    },
  },
  'codex': {
    path: './AGENTS.md',
    appendMode: true,
  },
  'kiro': {
    path: './.kiro/steering/eslint-rules.md',
  },
  'cline': {
    path: './.clinerules',
    appendMode: true,
  },
  'amp': {
    path: './AGENT.md',
    appendMode: true,
  },
  'aider': {
    path: './eslint-rules.md',
  },
  'firebase-studio': {
    path: './.idx/airules.md',
    appendMode: true,
  },
  'open-hands': {
    path: './.openhands/microagents/repo.md',
    appendMode: true,
  },
  'gemini-cli': {
    path: './GEMINI.md',
    appendMode: true,
  },
  'junie': {
    path: './.junie/guidelines.md',
    appendMode: true,
  },
  'augmentcode': {
    path: './.augment/rules/eslint-rules.md',
  },
  'kilo-code': {
    path: './.kilocode/rules/eslint-rules.md',
  },
  'goose': {
    path: './.goosehints',
    appendMode: true,
  },
  'roo-code': {
    path: './.roo/rules/eslint-rules.md',
    appendMode: true,
  },
  'warp': {
    path: './WARP.md',
    appendMode: true,
  },
} as const

export const MARKER_START = '<!-- pleaseai-lint:start -->'
export const MARKER_END = '<!-- pleaseai-lint:end -->'
