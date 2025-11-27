import type {
  ParsedEslintConfig,
  ParsedRule,
  PrintConfigOutput,
  RawRuleConfig,
  RuleSeverity,
} from './types'

/**
 * Parse rule ID into components
 */
export function parseRuleId(ruleId: string): {
  pluginPrefix: string | null
  ruleName: string
} {
  // Scoped plugin: @typescript-eslint/no-explicit-any
  // Pattern: @scope/rule-name where scope can include hyphens
  const scopedMatch = ruleId.match(/^(@[\w-]+)\/(.+)$/)
  if (scopedMatch) {
    return { pluginPrefix: scopedMatch[1], ruleName: scopedMatch[2] }
  }

  // Regular plugin: react/jsx-key
  const pluginMatch = ruleId.match(/^([\w-]+)\/(.+)$/)
  if (pluginMatch) {
    return { pluginPrefix: pluginMatch[1], ruleName: pluginMatch[2] }
  }

  // Core ESLint rule: no-console
  return { pluginPrefix: null, ruleName: ruleId }
}

/**
 * Normalize severity to string form
 */
function normalizeSeverity(
  severity: 0 | 1 | 2 | 'off' | 'warn' | 'error',
): RuleSeverity {
  const map: Record<string | number, RuleSeverity> = {
    0: 'off',
    off: 'off',
    1: 'warn',
    warn: 'warn',
    2: 'error',
    error: 'error',
  }
  return map[severity] ?? 'off'
}

/**
 * Parse a single rule configuration
 */
function parseRuleConfig(ruleId: string, config: RawRuleConfig): ParsedRule {
  const { pluginPrefix, ruleName } = parseRuleId(ruleId)

  let severity: RuleSeverity
  let options: unknown[] = []

  if (Array.isArray(config)) {
    severity = normalizeSeverity(config[0])
    options = config.slice(1)
  }
  else if (typeof config === 'number') {
    severity = normalizeSeverity(config as 0 | 1 | 2)
  }
  else {
    severity = normalizeSeverity(config)
  }

  return {
    ruleId,
    pluginPrefix,
    ruleName,
    severity,
    options,
  }
}

/**
 * Parse ESLint --print-config output into structured format
 */
export function parseESLintConfig(config: PrintConfigOutput): ParsedEslintConfig {
  const rules: ParsedRule[] = []
  let totalRules = 0

  for (const [ruleId, ruleConfig] of Object.entries(config.rules)) {
    totalRules++
    const parsed = parseRuleConfig(ruleId, ruleConfig)

    // Only include active rules (warn or error)
    if (parsed.severity !== 'off') {
      rules.push(parsed)
    }
  }

  // Extract plugins from rule prefixes
  const plugins = new Set<string>()
  for (const rule of rules) {
    if (rule.pluginPrefix) {
      plugins.add(rule.pluginPrefix)
    }
  }

  // Also add plugins from config if available
  if (config.plugins) {
    for (const plugin of config.plugins) {
      plugins.add(plugin)
    }
  }

  return {
    rules,
    plugins: Array.from(plugins),
    totalRules,
    activeRules: rules.length,
  }
}

/**
 * Plugin prefix to display name mapping
 */
export const PLUGIN_DISPLAY_NAMES: Record<string, string> = {
  '@typescript-eslint': 'TypeScript',
  'react': 'React',
  'react-hooks': 'React Hooks',
  'jsx-a11y': 'Accessibility',
  'import': 'Imports',
  'import-x': 'Imports',
  'unicorn': 'Unicorn',
  'sonarjs': 'SonarJS',
  'security': 'Security',
  'n': 'Node.js',
  'promise': 'Promises',
  'jest': 'Jest',
  'vitest': 'Vitest',
  'testing-library': 'Testing Library',
  'prettier': 'Prettier',
  'vue': 'Vue',
  'svelte': 'Svelte',
  'astro': 'Astro',
}
