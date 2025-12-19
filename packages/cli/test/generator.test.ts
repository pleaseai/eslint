import type { ParsedEslintConfig, ParsedRule } from '../src/eslint/types'
import { describe, expect, test } from 'bun:test'
import {
  generateGuidelines,
  generateMarkdown,
  generateRulesContent,
} from '../src/agents/generator'

function createMockConfig(rules: ParsedRule[]): ParsedEslintConfig {
  return {
    rules,
    plugins: [],
    totalRules: rules.length,
    activeRules: rules.length,
  }
}

describe('generateGuidelines', () => {
  test('generates guidelines from parsed config', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
      {
        ruleId: 'prefer-const',
        pluginPrefix: null,
        ruleName: 'prefer-const',
        severity: 'warn',
        options: [],
      },
    ])

    const result = generateGuidelines(config)

    expect(result.totalRules).toBe(2)
    expect(result.categories.length).toBeGreaterThan(0)
    expect(result.generatedAt).toBeDefined()
  })

  test('groups rules by category', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
      {
        ruleId: 'eqeqeq',
        pluginPrefix: null,
        ruleName: 'eqeqeq',
        severity: 'error',
        options: [],
      },
    ])

    const result = generateGuidelines(config)

    // no-console is code-quality, eqeqeq is type-safety
    const codeQuality = result.categories.find(c => c.category === 'code-quality')
    const typeSafety = result.categories.find(c => c.category === 'type-safety')

    expect(codeQuality).toBeDefined()
    expect(typeSafety).toBeDefined()
  })

  test('marks strict rules correctly', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
      {
        ruleId: 'prefer-const',
        pluginPrefix: null,
        ruleName: 'prefer-const',
        severity: 'warn',
        options: [],
      },
    ])

    const result = generateGuidelines(config)

    const allGuidelines = result.categories.flatMap(c => c.guidelines)
    const noConsole = allGuidelines.find(g => g.ruleId === 'no-console')
    const preferConst = allGuidelines.find(g => g.ruleId === 'prefer-const')

    expect(noConsole?.isStrict).toBe(true)
    expect(preferConst?.isStrict).toBe(false)
  })

  test('counts unmapped rules', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
      {
        ruleId: 'unknown-custom-rule',
        pluginPrefix: null,
        ruleName: 'unknown-custom-rule',
        severity: 'error',
        options: [],
      },
    ])

    const result = generateGuidelines(config)

    expect(result.unmappedRules).toBe(1)
  })

  test('excludes fallback rules when option is set', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
      {
        ruleId: 'unknown-custom-rule',
        pluginPrefix: null,
        ruleName: 'unknown-custom-rule',
        severity: 'error',
        options: [],
      },
    ])

    const result = generateGuidelines(config, { includeFallback: false })

    const allGuidelines = result.categories.flatMap(c => c.guidelines)
    expect(allGuidelines.find(g => g.ruleId === 'unknown-custom-rule')).toBeUndefined()
  })

  test('includes guidance when option is set', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
    ])

    const result = generateGuidelines(config, { includeGuidance: true })

    const allGuidelines = result.categories.flatMap(c => c.guidelines)
    const noConsole = allGuidelines.find(g => g.ruleId === 'no-console')

    expect(noConsole?.doThis).toBeDefined()
    expect(noConsole?.dontDoThis).toBeDefined()
  })
})

describe('generateMarkdown', () => {
  test('generates markdown header', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
    ])

    const guidelines = generateGuidelines(config)
    const markdown = generateMarkdown(guidelines)

    expect(markdown).toContain('# ESLint Code Standards')
    expect(markdown).toContain('## Quick Reference')
    expect(markdown).toContain('`npx eslint .`')
    expect(markdown).toContain('`npx eslint . --fix`')
  })

  test('generates category sections', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
    ])

    const guidelines = generateGuidelines(config)
    const markdown = generateMarkdown(guidelines)

    expect(markdown).toContain('### Code Quality')
  })

  test('includes do/dont guidance when enabled', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
    ])

    const guidelines = generateGuidelines(config, { includeGuidance: true })
    const markdown = generateMarkdown(guidelines, { includeGuidance: true })

    expect(markdown).toContain('**Do**:')
    expect(markdown).toContain('**Don\'t**:')
  })

  test('marks recommended rules', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'warn',
        options: [],
      },
    ])

    const guidelines = generateGuidelines(config)
    const markdown = generateMarkdown(guidelines)

    expect(markdown).toContain('(recommended)')
  })

  test('includes footer with rule count', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
      {
        ruleId: 'prefer-const',
        pluginPrefix: null,
        ruleName: 'prefer-const',
        severity: 'error',
        options: [],
      },
    ])

    const guidelines = generateGuidelines(config)
    const markdown = generateMarkdown(guidelines)

    expect(markdown).toContain('2 rules enforced')
  })
})

describe('generateRulesContent', () => {
  test('generates complete content', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
    ])

    const content = generateRulesContent(config)

    expect(content).toContain('# ESLint Code Standards')
    expect(content).toContain('Remove console statements')
  })

  test('respects options', () => {
    const config = createMockConfig([
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
    ])

    const contentWithGuidance = generateRulesContent(config, { includeGuidance: true })
    const contentWithoutGuidance = generateRulesContent(config, {
      includeGuidance: false,
    })

    expect(contentWithGuidance).toContain('**Do**:')
    expect(contentWithoutGuidance).not.toContain('**Do**:')
  })
})
