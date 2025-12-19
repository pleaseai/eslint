import type { PrintConfigOutput } from './types'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

export interface LoaderOptions {
  /** Target file to get config for (defaults to looking for a JS/TS file) */
  targetFile?: string
  /** Working directory */
  cwd?: string
}

/**
 * Find a suitable target file for --print-config
 */
function findTargetFile(cwd: string): string | null {
  const candidates = [
    'src/index.ts',
    'src/index.js',
    'src/main.ts',
    'src/main.js',
    'index.ts',
    'index.js',
    'src/App.tsx',
    'src/App.jsx',
  ]

  for (const candidate of candidates) {
    const fullPath = resolve(cwd, candidate)
    if (existsSync(fullPath)) {
      return candidate
    }
  }

  return null
}

/**
 * Check if ESLint flat config exists
 */
export function hasESLintConfig(cwd: string = process.cwd()): boolean {
  const configFiles = ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs']

  for (const file of configFiles) {
    if (existsSync(resolve(cwd, file))) {
      return true
    }
  }

  return false
}

/**
 * Find the ESLint config file path
 */
export function findESLintConfigPath(cwd: string = process.cwd()): string | null {
  const configFiles = ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs']

  for (const file of configFiles) {
    const fullPath = resolve(cwd, file)
    if (existsSync(fullPath)) {
      return fullPath
    }
  }

  return null
}

/**
 * Extract file patterns from ESLint flat config
 */
export async function extractFilePatterns(cwd: string = process.cwd()): Promise<string[]> {
  const configPath = findESLintConfigPath(cwd)
  if (!configPath) {
    return []
  }

  try {
    // Dynamically import the ESLint config with cache busting
    const configUrl = `${pathToFileURL(configPath).href}?t=${Date.now()}`
    const configModule = await import(configUrl)
    const config = configModule.default

    // Extract file patterns from config array
    const patterns = new Set<string>()

    // Handle both array and single object configs
    const configArray = Array.isArray(config) ? config : [config]

    for (const configItem of configArray) {
      if (configItem && typeof configItem === 'object' && 'files' in configItem) {
        const files = configItem.files
        if (Array.isArray(files)) {
          for (const pattern of files) {
            if (typeof pattern === 'string') {
              patterns.add(pattern)
            }
          }
        }
        else if (typeof files === 'string') {
          patterns.add(files)
        }
      }
    }

    return Array.from(patterns)
  }
  catch {
    // If import fails, return empty array (fallback to default patterns)
    return []
  }
}

/**
 * Load ESLint configuration using --print-config
 */
export async function loadESLintConfig(
  options: LoaderOptions = {},
): Promise<PrintConfigOutput> {
  const cwd = options.cwd ?? process.cwd()

  // Check for ESLint config first
  if (!hasESLintConfig(cwd)) {
    throw new Error(
      'No ESLint flat config found. Expected eslint.config.js, eslint.config.mjs, or eslint.config.cjs',
    )
  }

  // Find target file
  const targetFile = options.targetFile ?? findTargetFile(cwd)
  if (!targetFile) {
    throw new Error(
      'No target file found for --print-config. Please specify a file with --file option or create src/index.ts',
    )
  }

  // Run eslint --print-config
  const result = spawnSync('npx', ['eslint', '--print-config', targetFile], {
    encoding: 'utf-8',
    shell: true,
    cwd,
    timeout: 30000, // 30 second timeout
  })

  if (result.error) {
    throw new Error(`Failed to run ESLint: ${result.error.message}`)
  }

  if (result.status !== 0) {
    const errorMessage = result.stderr || result.stdout || 'Unknown error'
    throw new Error(`ESLint --print-config failed: ${errorMessage}`)
  }

  try {
    const config = JSON.parse(result.stdout) as PrintConfigOutput
    return config
  }
  catch {
    throw new Error(
      `Failed to parse ESLint config output. Raw output: ${result.stdout.slice(0, 200)}`,
    )
  }
}
