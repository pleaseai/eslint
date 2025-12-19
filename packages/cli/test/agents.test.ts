import type { ParsedEslintConfig } from '../src/eslint/types'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { createAgents, getAgentConfig, getAgentNames } from '../src/agents'
import { MARKER_END, MARKER_START } from '../src/consts/rules'

const TEST_DIR = join(import.meta.dir, 'tmp-agents')

function createMockConfig(): ParsedEslintConfig {
  return {
    rules: [
      {
        ruleId: 'no-console',
        pluginPrefix: null,
        ruleName: 'no-console',
        severity: 'error',
        options: [],
      },
    ],
    plugins: [],
    totalRules: 1,
    activeRules: 1,
  }
}

describe('getAgentNames', () => {
  test('returns all agent names', () => {
    const names = getAgentNames()

    expect(names).toContain('cursor')
    expect(names).toContain('claude')
    expect(names).toContain('vscode-copilot')
    expect(names.length).toBe(19)
  })
})

describe('getAgentConfig', () => {
  test('returns config for cursor', () => {
    const config = getAgentConfig('cursor')

    expect(config.path).toBe('./.cursor/rules/eslint-rules.mdc')
    expect(config.header).toContain('description:')
    expect(config.appendMode).toBeUndefined()
  })

  test('returns config for claude with appendMode', () => {
    const config = getAgentConfig('claude')

    expect(config.path).toBe('./.claude/CLAUDE.md')
    expect(config.appendMode).toBe(true)
  })

  test('returns config for vscode-copilot with header', () => {
    const config = getAgentConfig('vscode-copilot')

    expect(config.path).toBe('./.github/copilot-instructions.md')
    expect(config.header).toContain('applyTo:')
    expect(config.appendMode).toBe(true)
  })
})

describe('createAgents', () => {
  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true })
    process.chdir(TEST_DIR)
  })

  afterEach(async () => {
    process.chdir(join(TEST_DIR, '..'))
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  test('exists returns false for non-existent file', async () => {
    const agent = createAgents('cursor', { config: createMockConfig() })
    const exists = await agent.exists()
    expect(exists).toBe(false)
  })

  test('create creates file with content', async () => {
    const agent = createAgents('windsurf', { config: createMockConfig() })
    await agent.create()

    const exists = await agent.exists()
    expect(exists).toBe(true)

    const content = await readFile(agent.getPath(), 'utf-8')
    expect(content).toContain('# ESLint Code Standards')
    expect(content).toContain('Remove console statements')
  })

  test('create includes header for cursor', async () => {
    const agent = createAgents('cursor', { config: createMockConfig() })
    await agent.create()

    const content = await readFile(agent.getPath(), 'utf-8')
    expect(content).toContain('description: ESLint Rules')
    expect(content).toContain('globs:')
  })

  test('update creates new file with markers for appendMode agent', async () => {
    const agent = createAgents('claude', { config: createMockConfig() })
    await agent.update()

    const content = await readFile(agent.getPath(), 'utf-8')
    expect(content).toContain(MARKER_START)
    expect(content).toContain(MARKER_END)
    expect(content).toContain('# ESLint Code Standards')
  })

  test('update appends to existing file for appendMode agent', async () => {
    const agent = createAgents('claude', { config: createMockConfig() })

    // Create existing file
    await mkdir('.claude', { recursive: true })
    await writeFile('.claude/CLAUDE.md', '# Existing Content\n\nSome existing rules.\n')

    await agent.update()

    const content = await readFile(agent.getPath(), 'utf-8')
    expect(content).toContain('# Existing Content')
    expect(content).toContain(MARKER_START)
    expect(content).toContain('# ESLint Code Standards')
    expect(content).toContain(MARKER_END)
  })

  test('update replaces existing markers for appendMode agent', async () => {
    const agent = createAgents('claude', { config: createMockConfig() })

    // Create existing file with markers
    await mkdir('.claude', { recursive: true })
    await writeFile(
      '.claude/CLAUDE.md',
      `# Existing Content

${MARKER_START}
Old generated content
${MARKER_END}

# More content
`,
    )

    await agent.update()

    const content = await readFile(agent.getPath(), 'utf-8')
    expect(content).toContain('# Existing Content')
    expect(content).toContain('# More content')
    expect(content).toContain('# ESLint Code Standards')
    expect(content).not.toContain('Old generated content')
  })

  test('update overwrites for non-appendMode agent', async () => {
    const agent = createAgents('windsurf', { config: createMockConfig() })

    // Create existing file
    await mkdir('.windsurf/rules', { recursive: true })
    await writeFile('.windsurf/rules/eslint-rules.md', '# Old Content\n')

    await agent.update()

    const content = await readFile(agent.getPath(), 'utf-8')
    expect(content).not.toContain('# Old Content')
    expect(content).toContain('# ESLint Code Standards')
  })

  test('getPath returns correct path', () => {
    const agent = createAgents('cursor', { config: createMockConfig() })
    expect(agent.getPath()).toBe('./.cursor/rules/eslint-rules.mdc')
  })
})
