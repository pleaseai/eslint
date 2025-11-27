import type { PrintConfigOutput } from '../src/eslint/types'
import { describe, expect, test } from 'bun:test'
import {
  parseESLintConfig,
  parseRuleId,
  PLUGIN_DISPLAY_NAMES,
} from '../src/eslint/parser'

describe('parseRuleId', () => {
  test('parses core ESLint rule', () => {
    const result = parseRuleId('no-console')
    expect(result).toEqual({
      pluginPrefix: null,
      ruleName: 'no-console',
    })
  })

  test('parses plugin rule with simple prefix', () => {
    const result = parseRuleId('react/jsx-key')
    expect(result).toEqual({
      pluginPrefix: 'react',
      ruleName: 'jsx-key',
    })
  })

  test('parses scoped plugin rule', () => {
    const result = parseRuleId('@typescript-eslint/no-explicit-any')
    expect(result).toEqual({
      pluginPrefix: '@typescript-eslint',
      ruleName: 'no-explicit-any',
    })
  })

  test('parses react-hooks plugin rule', () => {
    const result = parseRuleId('react-hooks/rules-of-hooks')
    expect(result).toEqual({
      pluginPrefix: 'react-hooks',
      ruleName: 'rules-of-hooks',
    })
  })

  test('parses jsx-a11y plugin rule', () => {
    const result = parseRuleId('jsx-a11y/alt-text')
    expect(result).toEqual({
      pluginPrefix: 'jsx-a11y',
      ruleName: 'alt-text',
    })
  })
})

describe('parseESLintConfig', () => {
  test('parses config with string severity', () => {
    const config: PrintConfigOutput = {
      rules: {
        'no-console': 'error',
        'no-debugger': 'warn',
        'no-alert': 'off',
      },
    }

    const result = parseESLintConfig(config)

    expect(result.totalRules).toBe(3)
    expect(result.activeRules).toBe(2)
    expect(result.rules).toHaveLength(2)

    const noConsole = result.rules.find(r => r.ruleId === 'no-console')
    expect(noConsole).toBeDefined()
    expect(noConsole?.severity).toBe('error')

    const noDebugger = result.rules.find(r => r.ruleId === 'no-debugger')
    expect(noDebugger).toBeDefined()
    expect(noDebugger?.severity).toBe('warn')
  })

  test('parses config with numeric severity', () => {
    const config: PrintConfigOutput = {
      rules: {
        'no-console': 2,
        'no-debugger': 1,
        'no-alert': 0,
      },
    }

    const result = parseESLintConfig(config)

    expect(result.activeRules).toBe(2)

    const noConsole = result.rules.find(r => r.ruleId === 'no-console')
    expect(noConsole?.severity).toBe('error')

    const noDebugger = result.rules.find(r => r.ruleId === 'no-debugger')
    expect(noDebugger?.severity).toBe('warn')
  })

  test('parses config with array format and options', () => {
    const config: PrintConfigOutput = {
      rules: {
        'quotes': ['error', 'single'],
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      },
    }

    const result = parseESLintConfig(config)

    expect(result.activeRules).toBe(2)

    const quotes = result.rules.find(r => r.ruleId === 'quotes')
    expect(quotes?.severity).toBe('error')
    expect(quotes?.options).toEqual(['single'])

    const unusedVars = result.rules.find(r => r.ruleId === 'no-unused-vars')
    expect(unusedVars?.severity).toBe('warn')
    expect(unusedVars?.options).toEqual([{ argsIgnorePattern: '^_' }])
  })

  test('extracts plugins from rule prefixes', () => {
    const config: PrintConfigOutput = {
      rules: {
        'no-console': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'react/jsx-key': 'error',
        'react-hooks/rules-of-hooks': 'error',
      },
    }

    const result = parseESLintConfig(config)

    expect(result.plugins).toContain('@typescript-eslint')
    expect(result.plugins).toContain('react')
    expect(result.plugins).toContain('react-hooks')
  })

  test('includes plugins from config', () => {
    const config: PrintConfigOutput = {
      rules: {},
      plugins: ['import', 'unicorn'],
    }

    const result = parseESLintConfig(config)

    expect(result.plugins).toContain('import')
    expect(result.plugins).toContain('unicorn')
  })

  test('excludes off rules from active rules', () => {
    const config: PrintConfigOutput = {
      rules: {
        'no-console': 'off',
        'no-debugger': ['off'],
        'no-alert': 0,
        'prefer-const': [0],
      },
    }

    const result = parseESLintConfig(config)

    expect(result.totalRules).toBe(4)
    expect(result.activeRules).toBe(0)
    expect(result.rules).toHaveLength(0)
  })
})

describe('PLUGIN_DISPLAY_NAMES', () => {
  test('has mapping for common plugins', () => {
    expect(PLUGIN_DISPLAY_NAMES['@typescript-eslint']).toBe('TypeScript')
    expect(PLUGIN_DISPLAY_NAMES.react).toBe('React')
    expect(PLUGIN_DISPLAY_NAMES['react-hooks']).toBe('React Hooks')
    expect(PLUGIN_DISPLAY_NAMES['jsx-a11y']).toBe('Accessibility')
    expect(PLUGIN_DISPLAY_NAMES.import).toBe('Imports')
  })
})
