import type { RuleCategory } from '../consts/options'

/**
 * Severity levels for ESLint rules
 */
export type RuleSeverity = 'off' | 'warn' | 'error'

/**
 * Raw rule configuration from ESLint --print-config output
 */
export type RawRuleConfig
  = | 'off'
    | 'warn'
    | 'error'
    | 0
    | 1
    | 2
    | [0 | 1 | 2 | 'off' | 'warn' | 'error', ...unknown[]]

/**
 * Output from `eslint --print-config`
 */
export interface PrintConfigOutput {
  rules: Record<string, RawRuleConfig>
  env?: Record<string, boolean>
  globals?: Record<string, boolean | 'readonly' | 'writable'>
  parser?: string
  parserOptions?: Record<string, unknown>
  plugins?: string[]
  settings?: Record<string, unknown>
}

/**
 * Parsed rule with normalized severity and extracted options
 */
export interface ParsedRule {
  /** Full rule ID (e.g., "no-console", "@typescript-eslint/no-explicit-any") */
  ruleId: string

  /** Plugin prefix if any (e.g., "@typescript-eslint", "react") */
  pluginPrefix: string | null

  /** Rule name without plugin prefix */
  ruleName: string

  /** Normalized severity level */
  severity: RuleSeverity

  /** Rule options (if provided) */
  options: unknown[]
}

/**
 * Parsed ESLint configuration
 */
export interface ParsedEslintConfig {
  /** All rules extracted from the config */
  rules: ParsedRule[]

  /** Detected plugins */
  plugins: string[]

  /** Total number of rules (including off) */
  totalRules: number

  /** Number of active rules (warn + error) */
  activeRules: number
}

/**
 * Rule mapping entry for converting ESLint rules to AI guidelines
 */
export interface RuleMapping {
  /** Human-readable description */
  description: string

  /** Category for grouping */
  category: RuleCategory

  /** Positive guidance: "Do this" */
  doThis?: string

  /** Negative guidance: "Don't do this" */
  dontDoThis?: string

  /** Function to generate dynamic description based on options */
  getDescriptionWithOptions?: (options: unknown[]) => string
}

/**
 * Rule mapping database type
 */
export type RuleMappingDatabase = Record<string, RuleMapping>

/**
 * A single guideline item for output
 */
export interface GuidelineItem {
  /** The rule this guideline is based on */
  ruleId: string

  /** Whether this is a strict requirement (error) or recommendation (warn) */
  isStrict: boolean

  /** Human-readable description */
  description: string

  /** Positive guidance */
  doThis?: string

  /** Negative guidance */
  dontDoThis?: string

  /** Category */
  category: RuleCategory
}

/**
 * Guidelines grouped by category
 */
export interface CategoryGuidelines {
  /** Category key */
  category: RuleCategory

  /** Display name for the category */
  displayName: string

  /** Guidelines in this category */
  guidelines: GuidelineItem[]
}

/**
 * Complete generated guidelines
 */
export interface GeneratedGuidelines {
  /** Guidelines grouped by category */
  categories: CategoryGuidelines[]

  /** Total number of rules processed */
  totalRules: number

  /** Number of rules without custom mappings (used fallback) */
  unmappedRules: number

  /** Generation timestamp */
  generatedAt: string
}
