import type { RuleCategory } from '../consts/options'
import type {
  CategoryGuidelines,
  GeneratedGuidelines,
  GuidelineItem,
  ParsedEslintConfig,
} from '../eslint/types'
import { CATEGORY_DISPLAY_NAMES } from '../consts/options'
import { getRuleMapping } from '../mappings'

export interface GeneratorOptions {
  /** Include do/don't guidance in output */
  includeGuidance?: boolean
  /** Include rules without custom mappings */
  includeFallback?: boolean
}

/**
 * Generate guidelines from parsed ESLint config
 */
export function generateGuidelines(
  config: ParsedEslintConfig,
  options: GeneratorOptions = {},
): GeneratedGuidelines {
  const { includeGuidance = true, includeFallback = true } = options

  const guidelinesByCategory = new Map<RuleCategory, GuidelineItem[]>()
  let unmappedCount = 0

  for (const rule of config.rules) {
    const mapping = getRuleMapping(rule.ruleId, rule.pluginPrefix, rule.options)

    if (mapping.isFallback) {
      unmappedCount++
      if (!includeFallback)
        continue
    }

    const guideline: GuidelineItem = {
      ruleId: rule.ruleId,
      isStrict: rule.severity === 'error',
      description: mapping.description,
      category: mapping.category,
    }

    if (includeGuidance) {
      if (mapping.doThis)
        guideline.doThis = mapping.doThis
      if (mapping.dontDoThis)
        guideline.dontDoThis = mapping.dontDoThis
    }

    const existing = guidelinesByCategory.get(mapping.category) ?? []
    existing.push(guideline)
    guidelinesByCategory.set(mapping.category, existing)
  }

  // Sort and build categories
  const categoryOrder: RuleCategory[] = [
    'type-safety',
    'code-quality',
    'react',
    'security',
    'performance',
    'style',
    'imports',
    'testing',
    'other',
  ]

  const categories: CategoryGuidelines[] = []

  for (const category of categoryOrder) {
    const guidelines = guidelinesByCategory.get(category)
    if (guidelines && guidelines.length > 0) {
      // Sort by strictness (errors first), then by rule ID
      guidelines.sort((a, b) => {
        if (a.isStrict !== b.isStrict)
          return a.isStrict ? -1 : 1
        return a.ruleId.localeCompare(b.ruleId)
      })

      categories.push({
        category,
        displayName: CATEGORY_DISPLAY_NAMES[category],
        guidelines,
      })
    }
  }

  return {
    categories,
    totalRules: config.activeRules,
    unmappedRules: unmappedCount,
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Generate markdown content from guidelines
 */
export function generateMarkdown(
  guidelines: GeneratedGuidelines,
  options: { includeGuidance?: boolean } = {},
): string {
  const { includeGuidance = true } = options
  const lines: string[] = []

  // Header
  lines.push('# ESLint Code Standards')
  lines.push('')
  lines.push(
    `This project enforces **${guidelines.totalRules} ESLint rules** for code quality and consistency.`,
  )
  lines.push('')

  // Quick reference
  lines.push('## Quick Reference')
  lines.push('')
  lines.push('- **Check for issues**: `npx eslint .`')
  lines.push('- **Fix issues**: `npx eslint . --fix`')
  lines.push('')

  // Core principles
  lines.push('## Core Principles')
  lines.push('')
  lines.push(
    'Write code that is **accessible, performant, type-safe, and maintainable**. '
    + 'Focus on clarity and explicit intent over brevity.',
  )
  lines.push('')
  lines.push('---')
  lines.push('')

  // Generate each category
  for (const category of guidelines.categories) {
    lines.push(`### ${category.displayName}`)
    lines.push('')

    for (const guideline of category.guidelines) {
      // Main description with severity indicator
      const severity = guideline.isStrict ? '' : ' (recommended)'
      lines.push(`- ${guideline.description}${severity}`)

      // Optional do/don't guidance
      if (includeGuidance) {
        if (guideline.doThis) {
          lines.push(`  - **Do**: ${guideline.doThis}`)
        }
        if (guideline.dontDoThis) {
          lines.push(`  - **Don't**: ${guideline.dontDoThis}`)
        }
      }
    }
    lines.push('')
  }

  // Footer
  lines.push('---')
  lines.push('')
  lines.push(
    `*Generated from ESLint configuration on ${new Date().toLocaleDateString()}. `
    + `${guidelines.totalRules} rules enforced.*`,
  )

  return lines.join('\n')
}

/**
 * Generate rules content for an agent
 */
export function generateRulesContent(
  config: ParsedEslintConfig,
  options: GeneratorOptions = {},
): string {
  const guidelines = generateGuidelines(config, options)
  return generateMarkdown(guidelines, options)
}
