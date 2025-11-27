import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { hasESLintConfig } from '../src/eslint/loader'

const TEST_DIR = join(import.meta.dir, 'tmp-loader')

describe('hasESLintConfig', () => {
  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true })
    process.chdir(TEST_DIR)
  })

  afterEach(async () => {
    process.chdir(join(TEST_DIR, '..'))
    await rm(TEST_DIR, { recursive: true, force: true })
  })

  test('returns false when no config exists', () => {
    expect(hasESLintConfig()).toBe(false)
  })

  test('returns true when eslint.config.js exists', async () => {
    await writeFile('eslint.config.js', 'export default [];')
    expect(hasESLintConfig()).toBe(true)
  })

  test('returns true when eslint.config.mjs exists', async () => {
    await writeFile('eslint.config.mjs', 'export default [];')
    expect(hasESLintConfig()).toBe(true)
  })

  test('returns true when eslint.config.cjs exists', async () => {
    await writeFile('eslint.config.cjs', 'module.exports = [];')
    expect(hasESLintConfig()).toBe(true)
  })

  test('accepts custom cwd', async () => {
    const subDir = join(TEST_DIR, 'subdir')
    await mkdir(subDir, { recursive: true })
    await writeFile(join(subDir, 'eslint.config.js'), 'export default [];')

    expect(hasESLintConfig(subDir)).toBe(true)
    expect(hasESLintConfig(TEST_DIR)).toBe(false)
  })
})
