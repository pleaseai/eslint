import type { RuleCategory } from '../consts/options'
import type { RuleMapping, RuleMappingDatabase } from '../eslint/types'
import { PLUGIN_DISPLAY_NAMES } from '../eslint/parser'
import { coreRuleMappings } from './core'
import { reactRuleMappings } from './react'
import { typescriptRuleMappings } from './typescript'

/**
 * Combined rule mappings from all sources
 */
export const RULE_MAPPINGS: RuleMappingDatabase = {
  ...coreRuleMappings,
  ...typescriptRuleMappings,
  ...reactRuleMappings,
}

/**
 * Infer category from rule ID when not in custom mappings
 */
export function inferCategory(
  ruleId: string,
  pluginPrefix: string | null,
): RuleCategory {
  // Plugin-based inference
  if (pluginPrefix) {
    const pluginCategories: Record<string, RuleCategory> = {
      '@typescript-eslint': 'type-safety',
      'react': 'react',
      'react-hooks': 'react',
      'jsx-a11y': 'react',
      'import': 'imports',
      'import-x': 'imports',
      'security': 'security',
      'jest': 'testing',
      'vitest': 'testing',
      'testing-library': 'testing',
      'promise': 'code-quality',
    }
    if (pluginCategories[pluginPrefix]) {
      return pluginCategories[pluginPrefix]
    }
  }

  // Pattern-based inference for rule names
  const patterns: Array<[RegExp, RuleCategory]> = [
    [/^no-async-promise-executor|require-await|no-await-in-loop/, 'performance'],
    [/^prefer-const|no-var|const-|let-/, 'code-quality'],
    [/^no-unused-|no-undef/, 'type-safety'],
    [/^no-console|no-debugger|no-alert/, 'code-quality'],
    [/^eqeqeq|no-implicit-coercion/, 'type-safety'],
    [/^camelcase|id-|naming-/, 'style'],
    [/^indent|quotes|semi|comma|space|brace/, 'style'],
    [/^no-eval|no-new-func|no-script-url/, 'security'],
    [/^complexity|max-|no-nested/, 'code-quality'],
    [/import|export/, 'imports'],
    [/test|spec|describe|it\b/, 'testing'],
  ]

  for (const [pattern, category] of patterns) {
    if (pattern.test(ruleId)) {
      return category
    }
  }

  return 'other'
}

/**
 * Generate human-readable description from rule ID (fallback)
 */
export function generateFallbackDescription(
  ruleId: string,
  pluginPrefix: string | null,
): string {
  // Get the rule name part
  const ruleName = pluginPrefix
    ? ruleId.replace(`${pluginPrefix}/`, '')
    : ruleId

  // Parse rule name into description
  let description = parseRuleName(ruleName)

  // Add plugin context
  if (pluginPrefix) {
    const pluginName = PLUGIN_DISPLAY_NAMES[pluginPrefix] ?? pluginPrefix
    description = `${pluginName}: ${description}`
  }

  return description
}

/**
 * Parse rule name into human-readable form
 */
function parseRuleName(ruleName: string): string {
  // Pattern: no-xxx -> Avoid xxx
  if (ruleName.startsWith('no-')) {
    return `Avoid ${humanize(ruleName.slice(3))}`
  }

  // Pattern: prefer-xxx -> Prefer xxx
  if (ruleName.startsWith('prefer-')) {
    return `Prefer ${humanize(ruleName.slice(7))}`
  }

  // Pattern: require-xxx -> Require xxx
  if (ruleName.startsWith('require-')) {
    return `Require ${humanize(ruleName.slice(8))}`
  }

  // Pattern: xxx-xxx -> Follow xxx xxx rule
  return `Follow ${humanize(ruleName)} rule`
}

/**
 * Convert kebab-case to readable text
 */
function humanize(kebabCase: string): string {
  return kebabCase.split('-').join(' ')
}

/**
 * Get mapping for a rule, with fallback
 */
export function getRuleMapping(
  ruleId: string,
  pluginPrefix: string | null,
  options: unknown[],
): RuleMapping & { isFallback: boolean } {
  const mapping = RULE_MAPPINGS[ruleId]

  if (mapping) {
    // Apply options-based description if available
    let description = mapping.description
    if (mapping.getDescriptionWithOptions && options.length > 0) {
      description = mapping.getDescriptionWithOptions(options)
    }

    return {
      ...mapping,
      description,
      isFallback: false,
    }
  }

  // Generate fallback
  return {
    description: generateFallbackDescription(ruleId, pluginPrefix),
    category: inferCategory(ruleId, pluginPrefix),
    isFallback: true,
  }
}

export { coreRuleMappings } from './core'
export { reactRuleMappings } from './react'
export { typescriptRuleMappings } from './typescript'
