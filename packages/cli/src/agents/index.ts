import type { AgentName } from '../consts/options'
import type { ParsedEslintConfig } from '../eslint/types'
import type { GeneratorOptions } from './generator'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { AGENTS, MARKER_END, MARKER_START } from '../consts/rules'
import { exists } from '../utils'
import { generateRulesContent } from './generator'

export interface CreateAgentsOptions {
  /** Parsed ESLint configuration */
  config: ParsedEslintConfig
  /** Generator options */
  generatorOptions?: GeneratorOptions
  /** File patterns extracted from ESLint config */
  filePatterns?: string[]
}

/**
 * Create an agent handler for writing rules to a specific AI tool
 */
export function createAgents(name: AgentName, options: CreateAgentsOptions) {
  const agentConfig = AGENTS[name]

  // Generate dynamic rules content
  const rulesContent = generateRulesContent(options.config, options.generatorOptions)

  // Generate header (dynamic or static)
  const header = agentConfig.getHeader
    ? agentConfig.getHeader(options.filePatterns ?? [])
    : agentConfig.header

  const content = header
    ? `${header}\n\n${rulesContent}`
    : rulesContent

  const ensureDirectory = async () => {
    const dir = dirname(agentConfig.path)
    if (dir !== '.') {
      const cleanDir = dir.startsWith('./') ? dir.slice(2) : dir
      await mkdir(cleanDir, { recursive: true })
    }
  }

  return {
    /** Check if the agent file already exists */
    exists: () => exists(agentConfig.path),

    /** Get the path to the agent file */
    getPath: () => agentConfig.path,

    /** Create a new agent file (overwrites if exists) */
    create: async () => {
      await ensureDirectory()
      await writeFile(agentConfig.path, content)
    },

    /** Update existing agent file (respects appendMode) */
    update: async () => {
      await ensureDirectory()

      if (agentConfig.appendMode) {
        if (!(await exists(agentConfig.path))) {
          // File doesn't exist, create with markers
          await writeFile(
            agentConfig.path,
            `${MARKER_START}\n${rulesContent}\n${MARKER_END}`,
          )
          return
        }

        const existingContents = await readFile(agentConfig.path, 'utf-8')

        // Check for existing generated section marker
        if (existingContents.includes(MARKER_START)) {
          // Replace existing section
          const markerStartIndex = existingContents.indexOf(MARKER_START)
          const markerEndIndex = existingContents.indexOf(MARKER_END)

          if (markerEndIndex > markerStartIndex) {
            const before = existingContents.slice(0, markerStartIndex)
            const after = existingContents.slice(
              markerEndIndex + MARKER_END.length,
            )
            await writeFile(
              agentConfig.path,
              `${before}${MARKER_START}\n${rulesContent}\n${MARKER_END}${after}`,
            )
          }
          else {
            // Malformed markers, append fresh
            await writeFile(
              agentConfig.path,
              `${existingContents}\n\n${MARKER_START}\n${rulesContent}\n${MARKER_END}`,
            )
          }
        }
        else {
          // No markers, append with markers
          await writeFile(
            agentConfig.path,
            `${existingContents}\n\n${MARKER_START}\n${rulesContent}\n${MARKER_END}`,
          )
        }
      }
      else {
        // Overwrite mode
        await writeFile(agentConfig.path, content)
      }
    },
  }
}

/**
 * Get all available agent names
 */
export function getAgentNames(): AgentName[] {
  return Object.keys(AGENTS) as AgentName[]
}

/**
 * Get agent configuration
 */
export function getAgentConfig(name: AgentName) {
  return AGENTS[name]
}
