import type { AgentName } from '../consts/options'
import { generateRulesContent } from '../agents/generator'
import { AGENTS } from '../consts/rules'
import { loadESLintConfig } from '../eslint/loader'
import { parseESLintConfig } from '../eslint/parser'

export interface PreviewOptions {
  /** Target file for --print-config */
  targetFile?: string
  /** Specific agent to preview */
  agent?: AgentName
}

/**
 * Preview generated rules without writing files
 */
export async function preview(options: PreviewOptions = {}): Promise<void> {
  // Load ESLint config
  const rawConfig = await loadESLintConfig({ targetFile: options.targetFile })
  const parsed = parseESLintConfig(rawConfig)

  console.log(`Loaded ${parsed.activeRules} active ESLint rules`)
  console.log(`Plugins: ${parsed.plugins.join(', ') || 'None'}`)
  console.log('')

  // Generate content
  const content = generateRulesContent(parsed, { includeGuidance: true })

  if (options.agent) {
    const agentConfig = AGENTS[options.agent]
    console.log(`Preview for ${options.agent} (${agentConfig.path}):`)
    console.log('='.repeat(50))
    if (agentConfig.header) {
      console.log(agentConfig.header)
      console.log('')
    }
  }
  else {
    console.log('Preview of generated rules:')
    console.log('='.repeat(50))
  }

  console.log(content)
}
