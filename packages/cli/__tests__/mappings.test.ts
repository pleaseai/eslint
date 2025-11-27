import { describe, expect, test } from 'bun:test'
import {
  generateFallbackDescription,
  getRuleMapping,
  inferCategory,
  RULE_MAPPINGS,
} from '../src/mappings'
import { coreRuleMappings } from '../src/mappings/core'
import { reactRuleMappings } from '../src/mappings/react'
import { typescriptRuleMappings } from '../src/mappings/typescript'

describe('RULE_MAPPINGS', () => {
  test('contains core ESLint rules', () => {
    expect(RULE_MAPPINGS['no-console']).toBeDefined()
    expect(RULE_MAPPINGS['prefer-const']).toBeDefined()
    expect(RULE_MAPPINGS.eqeqeq).toBeDefined()
  })

  test('contains TypeScript rules', () => {
    expect(RULE_MAPPINGS['@typescript-eslint/no-explicit-any']).toBeDefined()
    expect(RULE_MAPPINGS['@typescript-eslint/no-unused-vars']).toBeDefined()
  })

  test('contains React rules', () => {
    expect(RULE_MAPPINGS['react/jsx-key']).toBeDefined()
    expect(RULE_MAPPINGS['react-hooks/rules-of-hooks']).toBeDefined()
  })
})

describe('coreRuleMappings', () => {
  test('no-console has correct structure', () => {
    const rule = coreRuleMappings['no-console']
    expect(rule.description).toBe('Remove console statements from production code')
    expect(rule.category).toBe('code-quality')
    expect(rule.doThis).toBeDefined()
    expect(rule.dontDoThis).toBeDefined()
  })

  test('quotes has option-aware description', () => {
    const rule = coreRuleMappings.quotes
    expect(rule.getDescriptionWithOptions).toBeDefined()

    const singleDesc = rule.getDescriptionWithOptions?.(['single'])
    expect(singleDesc).toBe('Use single quotes for strings')

    const doubleDesc = rule.getDescriptionWithOptions?.(['double'])
    expect(doubleDesc).toBe('Use double quotes for strings')
  })

  test('prefer-const has option-aware description', () => {
    const rule = coreRuleMappings['prefer-const']
    expect(rule.getDescriptionWithOptions).toBeDefined()

    const allDesc = rule.getDescriptionWithOptions?.([{ destructuring: 'all' }])
    expect(allDesc).toContain('destructured')
  })
})

describe('typescriptRuleMappings', () => {
  test('no-explicit-any has correct structure', () => {
    const rule = typescriptRuleMappings['@typescript-eslint/no-explicit-any']
    expect(rule.description).toBe('Avoid using the any type')
    expect(rule.category).toBe('type-safety')
  })

  test('no-unused-vars has option-aware description', () => {
    const rule = typescriptRuleMappings['@typescript-eslint/no-unused-vars']
    expect(rule.getDescriptionWithOptions).toBeDefined()

    const desc = rule.getDescriptionWithOptions?.([{ argsIgnorePattern: '^_' }])
    expect(desc).toContain('^_')
  })
})

describe('reactRuleMappings', () => {
  test('jsx-key has correct structure', () => {
    const rule = reactRuleMappings['react/jsx-key']
    expect(rule.description).toBe('Provide unique key props for elements in arrays')
    expect(rule.category).toBe('react')
  })

  test('rules-of-hooks has correct structure', () => {
    const rule = reactRuleMappings['react-hooks/rules-of-hooks']
    expect(rule.description).toBe('Follow the Rules of Hooks')
    expect(rule.category).toBe('react')
  })
})

describe('inferCategory', () => {
  test('infers type-safety for typescript-eslint', () => {
    expect(inferCategory('@typescript-eslint/some-rule', '@typescript-eslint')).toBe(
      'type-safety',
    )
  })

  test('infers react for react plugins', () => {
    expect(inferCategory('react/some-rule', 'react')).toBe('react')
    expect(inferCategory('react-hooks/some-rule', 'react-hooks')).toBe('react')
    expect(inferCategory('jsx-a11y/some-rule', 'jsx-a11y')).toBe('react')
  })

  test('infers imports for import plugins', () => {
    expect(inferCategory('import/some-rule', 'import')).toBe('imports')
    expect(inferCategory('import-x/some-rule', 'import-x')).toBe('imports')
  })

  test('infers testing for test plugins', () => {
    expect(inferCategory('jest/some-rule', 'jest')).toBe('testing')
    expect(inferCategory('vitest/some-rule', 'vitest')).toBe('testing')
  })

  test('infers style from pattern', () => {
    expect(inferCategory('indent', null)).toBe('style')
    expect(inferCategory('quotes', null)).toBe('style')
    expect(inferCategory('semi', null)).toBe('style')
  })

  test('infers security from pattern', () => {
    expect(inferCategory('no-eval', null)).toBe('security')
  })

  test('returns other for unknown rules', () => {
    expect(inferCategory('unknown-rule', null)).toBe('other')
  })
})

describe('generateFallbackDescription', () => {
  test('generates description for no- rules', () => {
    const desc = generateFallbackDescription('no-console', null)
    expect(desc).toBe('Avoid console')
  })

  test('generates description for prefer- rules', () => {
    const desc = generateFallbackDescription('prefer-const', null)
    expect(desc).toBe('Prefer const')
  })

  test('generates description for require- rules', () => {
    const desc = generateFallbackDescription('require-await', null)
    expect(desc).toBe('Require await')
  })

  test('adds plugin prefix for plugin rules', () => {
    const desc = generateFallbackDescription(
      '@typescript-eslint/no-explicit-any',
      '@typescript-eslint',
    )
    expect(desc).toContain('TypeScript')
    expect(desc).toContain('Avoid')
  })

  test('generates generic description for other rules', () => {
    const desc = generateFallbackDescription('some-custom-rule', null)
    expect(desc).toBe('Follow some custom rule rule')
  })
})

describe('getRuleMapping', () => {
  test('returns mapping for known rule', () => {
    const result = getRuleMapping('no-console', null, [])
    expect(result.isFallback).toBe(false)
    expect(result.description).toBe('Remove console statements from production code')
  })

  test('returns fallback for unknown rule', () => {
    const result = getRuleMapping('unknown-custom-rule', null, [])
    expect(result.isFallback).toBe(true)
    expect(result.category).toBe('other')
  })

  test('applies options to description', () => {
    const result = getRuleMapping('quotes', null, ['single'])
    expect(result.description).toBe('Use single quotes for strings')
  })

  test('returns mapping for plugin rule', () => {
    const result = getRuleMapping(
      '@typescript-eslint/no-explicit-any',
      '@typescript-eslint',
      [],
    )
    expect(result.isFallback).toBe(false)
    expect(result.category).toBe('type-safety')
  })
})
