export const options = {
  agents: [
    'vscode-copilot',
    'cursor',
    'windsurf',
    'zed',
    'claude',
    'codex',
    'kiro',
    'cline',
    'amp',
    'aider',
    'firebase-studio',
    'open-hands',
    'gemini-cli',
    'junie',
    'augmentcode',
    'kilo-code',
    'goose',
    'roo-code',
    'warp',
  ] as const,

  categories: [
    'type-safety',
    'code-quality',
    'react',
    'security',
    'performance',
    'style',
    'imports',
    'testing',
    'other',
  ] as const,
}

export type AgentName = (typeof options.agents)[number]
export type RuleCategory = (typeof options.categories)[number]

export const CATEGORY_DISPLAY_NAMES: Record<RuleCategory, string> = {
  'type-safety': 'Type Safety & Explicitness',
  'code-quality': 'Code Quality',
  'react': 'React & JSX',
  'security': 'Security',
  'performance': 'Performance',
  'style': 'Code Style',
  'imports': 'Imports & Exports',
  'testing': 'Testing',
  'other': 'Other',
}
