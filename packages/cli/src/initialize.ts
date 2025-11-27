import type { AgentName } from './consts/options'
import process from 'node:process'
import * as p from '@clack/prompts'
import { options } from './consts/options'
import { hasESLintConfig } from './eslint/loader'
import { generate } from './generate'
import { title } from './utils'

export interface InitializeOptions {
  /** Target file for --print-config */
  targetFile?: string
  /** Pre-selected agents */
  agents?: AgentName[]
  /** Quiet mode (skip prompts) */
  quiet?: boolean
}

/**
 * Initialize @pleaseai/lint in the current project
 */
export async function initialize(opts: InitializeOptions = {}): Promise<void> {
  const { quiet = false } = opts

  if (!quiet) {
    console.log(title)
    p.intro('Setting up ESLint to AI Rules converter')
  }

  // Check for ESLint config
  if (!hasESLintConfig()) {
    if (!quiet) {
      p.log.error(
        'No ESLint flat config found. Please create eslint.config.js first.',
      )
      p.log.info('Expected: eslint.config.js, eslint.config.mjs, or eslint.config.cjs')
    }
    throw new Error('No ESLint flat config found')
  }

  if (!quiet) {
    p.log.success('Found ESLint configuration')
  }

  // Select agents
  let selectedAgents: AgentName[]

  if (opts.agents && opts.agents.length > 0) {
    selectedAgents = opts.agents
  }
  else if (quiet) {
    // In quiet mode, use all agents
    selectedAgents = [...options.agents]
  }
  else {
    // Interactive selection
    const agentSelection = await p.multiselect({
      message: 'Select AI tools to generate rules for:',
      options: options.agents.map(agent => ({
        value: agent,
        label: formatAgentName(agent),
      })),
      initialValues: [
        'cursor',
        'claude',
        'vscode-copilot',
      ] as AgentName[],
    })

    if (p.isCancel(agentSelection)) {
      p.cancel('Setup cancelled')
      process.exit(0)
    }

    selectedAgents = agentSelection as AgentName[]
  }

  if (selectedAgents.length === 0) {
    if (!quiet) {
      p.log.warn('No agents selected. Exiting.')
    }
    return
  }

  if (!quiet) {
    p.log.info(`Selected ${selectedAgents.length} AI tools`)
  }

  // Generate rules
  await generate({
    targetFile: opts.targetFile,
    agents: selectedAgents,
    quiet,
  })
}

/**
 * Format agent name for display
 */
function formatAgentName(agent: AgentName): string {
  const names: Record<AgentName, string> = {
    'vscode-copilot': 'GitHub Copilot (VS Code)',
    'cursor': 'Cursor',
    'windsurf': 'Windsurf',
    'zed': 'Zed',
    'claude': 'Claude Code',
    'codex': 'OpenAI Codex',
    'kiro': 'Kiro',
    'cline': 'Cline',
    'amp': 'AMP',
    'aider': 'Aider',
    'firebase-studio': 'Firebase Studio',
    'open-hands': 'OpenHands',
    'gemini-cli': 'Gemini CLI',
    'junie': 'Junie',
    'augmentcode': 'Augment Code',
    'kilo-code': 'Kilo Code',
    'goose': 'Goose',
    'roo-code': 'Roo Code',
    'warp': 'Warp',
  }
  return names[agent] ?? agent
}
