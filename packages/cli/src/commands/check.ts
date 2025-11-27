import { hasESLintConfig, loadESLintConfig } from '../eslint/loader'
import { parseESLintConfig } from '../eslint/parser'

export interface CheckResult {
  hasConfig: boolean
  configValid: boolean
  ruleCount: number
  plugins: string[]
  error?: string
}

/**
 * Check ESLint configuration
 */
export async function check(): Promise<CheckResult> {
  // Check if config exists
  if (!hasESLintConfig()) {
    return {
      hasConfig: false,
      configValid: false,
      ruleCount: 0,
      plugins: [],
      error: 'No ESLint flat config found (eslint.config.js/mjs/cjs)',
    }
  }

  try {
    // Try to load and parse config
    const rawConfig = await loadESLintConfig()
    const parsed = parseESLintConfig(rawConfig)

    console.log('ESLint Configuration Status:')
    console.log('============================')
    console.log(`Config found: Yes`)
    console.log(`Total rules: ${parsed.totalRules}`)
    console.log(`Active rules: ${parsed.activeRules}`)
    console.log(`Plugins: ${parsed.plugins.length > 0 ? parsed.plugins.join(', ') : 'None'}`)

    return {
      hasConfig: true,
      configValid: true,
      ruleCount: parsed.activeRules,
      plugins: parsed.plugins,
    }
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error loading ESLint config:', errorMessage)

    return {
      hasConfig: true,
      configValid: false,
      ruleCount: 0,
      plugins: [],
      error: errorMessage,
    }
  }
}
