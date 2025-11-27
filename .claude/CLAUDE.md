# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **pleaseai-eslint**, a CLI tool that converts ESLint configurations into AI assistant rules for Cursor, Copilot, Claude, Windsurf, and 15+ other AI coding tools.

## Commands

```bash
# Install dependencies
bun install

# Development (watch mode)
bun run dev

# Build all packages
bun run build

# Run tests
bun run test
bun run test:coverage

# Run a single test file
cd packages/cli && bun test __tests__/parser.test.ts

# Linting
bun run check           # Check for issues
bun run fix             # Auto-fix issues

# CLI usage (after build)
node packages/cli/dist/index.js init
node packages/cli/dist/index.js generate
node packages/cli/dist/index.js preview
node packages/cli/dist/index.js check
```

## Architecture

**Monorepo Structure:**
- `packages/cli/` - Main CLI package (`@pleaseai/lint`)
- `ref/ultracite/` - Git submodule reference implementation

**CLI Source (`packages/cli/src/`):**
- `agents/` - Rule generators for each AI tool (Cursor, Copilot, Claude, etc.)
- `commands/` - CLI commands (check, preview)
- `eslint/` - ESLint config parsing and loading (`parser.ts`, `loader.ts`)
- `mappings/` - Rule mapping databases (core, typescript, react)
- `consts/` - Constants for supported agents and rule categories
- `index.ts` - TRPC router and CLI entry point
- `generate.ts` - Main generation logic
- `initialize.ts` - Project initialization

**Key Patterns:**
- Uses TRPC with `trpc-cli` for command routing
- Zod schemas for validation
- `@clack/prompts` for interactive CLI
- Tests use Bun's native test runner

**Build:**
- Turborepo orchestrates tasks with Vercel remote caching
- tsup bundles TypeScript to ESM with shebang

## Supported AI Agents

19 agents: cursor, vscode-copilot, windsurf, claude, zed, codex, kiro, cline, amp, aider, firebase-studio, open-hands, gemini-cli, junie, augmentcode, kilo-code, goose, roo-code, warp

---

<!-- pleaseai-lint:start -->

# ESLint Code Standards

This project enforces **68 ESLint rules** for code quality and consistency.

## Quick Reference

- **Check for issues**: `npx eslint .`
- **Fix issues**: `npx eslint . --fix`

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

---

### Type Safety & Explicitness

- Avoid using the any type
  - **Do**: Use specific types, unknown, or generics instead of any
  - **Don't**: Use any to bypass type checking
- Use strict equality operators (=== and !==)
  - **Do**: Always use === and !== for comparisons
  - **Don't**: Use == or != which perform type coercion
- Avoid unused labels
- Avoid unused private class members

### Code Quality

- Remove unused variables (pattern ^\_ ignored)
  - **Do**: Remove or use all declared variables
  - **Don't**: Leave unused variables in code
- Avoid async function as Promise executor
  - **Do**: Use new Promise((resolve) => {}) with proper async handling
  - **Don't**: Use new Promise(async (resolve) => {})
- Remove debugger statements
  - **Do**: Remove debugger statements before committing
  - **Don't**: Leave debugger statements in code
- Avoid empty block statements
  - **Do**: Add comments explaining why block is empty, or add proper logic
  - **Don't**: Leave empty catch blocks or if/else blocks
- Use let or const instead of var
  - **Do**: Use const for constants, let for variables that change
  - **Don't**: Use var for variable declarations
- Use const for variables that are never reassigned
  - **Do**: Use const by default for all variable declarations
  - **Don't**: Use let when the variable is never reassigned
- Remove console statements from production code (recommended)
  - **Do**: Use a proper logging library or remove debug statements
  - **Don't**: Leave console.log statements in production code

### Code Style

- Follow @typescript eslint/no namespace rule
- Follow @typescript eslint/prefer namespace keyword rule
- Avoid invalid regexp
- Avoid irregular whitespace
- Avoid regex spaces
- Follow valid typeof rule

### Imports & Exports

- Follow @typescript eslint/no require imports rule

### Other

- Follow @typescript eslint/ban ts comment rule
- Follow @typescript eslint/no array constructor rule
- Follow @typescript eslint/no duplicate enum values rule
- Follow @typescript eslint/no empty object type rule
- Follow @typescript eslint/no extra non null assertion rule
- Follow @typescript eslint/no misused new rule
- Follow @typescript eslint/no non null asserted optional chain rule
- Follow @typescript eslint/no this alias rule
- Follow @typescript eslint/no unnecessary type constraint rule
- Follow @typescript eslint/no unsafe declaration merging rule
- Follow @typescript eslint/no unsafe function type rule
- Follow @typescript eslint/no unused expressions rule
- Follow @typescript eslint/no wrapper object types rule
- Follow @typescript eslint/prefer as const rule
- Follow @typescript eslint/triple slash reference rule
- Follow for direction rule
- Avoid case declarations
- Avoid compare neg zero
- Avoid cond assign
- Avoid constant binary expression
- Avoid constant condition
- Avoid control regex
- Avoid delete var
- Avoid dupe else if
- Avoid duplicate case
- Avoid empty character class
- Avoid empty pattern
- Avoid empty static block
- Avoid ex assign
- Avoid extra boolean cast
- Avoid fallthrough
- Avoid global assign
- Avoid loss of precision
- Avoid misleading character class
- Avoid nonoctal decimal escape
- Avoid octal
- Avoid prototype builtins
- Avoid self assign
- Avoid shadow restricted names
- Avoid sparse arrays
- Avoid unexpected multiline
- Avoid unsafe finally
- Avoid unsafe optional chaining
- Avoid useless backreference
- Avoid useless catch
- Avoid useless escape
- Prefer rest params
- Prefer spread
- Require yield
- Follow use isnan rule

---

_Generated from ESLint configuration on 11/27/2025. 68 rules enforced._

<!-- pleaseai-lint:end -->
