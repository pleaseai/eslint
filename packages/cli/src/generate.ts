import type { AgentName } from './consts/options'
import * as p from '@clack/prompts'
import { createAgents, getAgentNames } from './agents'
import { loadESLintConfig } from './eslint/loader'
import { parseESLintConfig } from './eslint/parser'

export interface GenerateOptions {
  /** Target file for --print-config */
  targetFile?: string
  /** Specific agents to generate for */
  agents?: AgentName[]
  /** Quiet mode (no interactive output) */
  quiet?: boolean
}

/**
 * Generate AI rules from ESLint configuration
 */
export async function generate(options: GenerateOptions = {}): Promise<void> {
  const { quiet = false } = options

  if (!quiet) {
    p.intro('Generating AI rules from ESLint configuration')
  }

  // Load ESLint config
  const spinner = quiet ? null : p.spinner()
  spinner?.start('Loading ESLint configuration...')

  let rawConfig
  try {
    rawConfig = await loadESLintConfig({ targetFile: options.targetFile })
  }
  catch (error) {
    spinner?.stop('Failed to load ESLint config')
    const message = error instanceof Error ? error.message : String(error)
    if (!quiet) {
      p.log.error(message)
    }
    throw error
  }

  const parsed = parseESLintConfig(rawConfig)
  spinner?.stop(`Loaded ${parsed.activeRules} active ESLint rules`)

  if (!quiet) {
    p.log.info(`Detected plugins: ${parsed.plugins.join(', ') || 'None'}`)
  }

  // Determine which agents to generate for
  const agents = options.agents ?? getAgentNames()

  // Generate for each agent
  spinner?.start(`Generating rules for ${agents.length} AI tools...`)

  const results: { agent: AgentName, path: string, success: boolean }[] = []

  for (const agentName of agents) {
    try {
      const agent = createAgents(agentName, {
        config: parsed,
        generatorOptions: { includeGuidance: true },
      })

      await agent.update()

      results.push({
        agent: agentName,
        path: agent.getPath(),
        success: true,
      })
    }
    catch (error) {
      results.push({
        agent: agentName,
        path: '',
        success: false,
      })
      if (!quiet) {
        const message = error instanceof Error ? error.message : String(error)
        p.log.warn(`Failed to generate for ${agentName}: ${message}`)
      }
    }
  }

  spinner?.stop('Generation complete')

  // Summary
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  if (!quiet) {
    p.log.success(`Generated rules for ${successful.length} AI tools:`)
    for (const result of successful) {
      console.log(`  - ${result.agent}: ${result.path}`)
    }

    if (failed.length > 0) {
      p.log.warn(`Failed for ${failed.length} tools:`)
      for (const result of failed) {
        console.log(`  - ${result.agent}`)
      }
    }

    p.outro('Done! AI assistants will now follow your ESLint rules.')
  }
}
