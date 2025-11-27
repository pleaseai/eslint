# @pleaseai/lint

Convert your ESLint configuration into AI-readable rules for coding assistants.

## Overview

`@pleaseai/lint` automatically transforms your ESLint rules into guidelines that AI coding assistants can understand. This ensures AI-generated code follows your project's coding standards from the start.

## Supported AI Assistants

- **Cursor** - `.cursor/rules/`
- **VS Code Copilot** - `.github/copilot-instructions.md`
- **Claude Code** - `.claude/CLAUDE.md`
- **Windsurf** - `.windsurfrules`
- **Zed** - `.zed/rules/`
- **Codex** - `AGENTS.md`
- **Kiro** - `.kiro/rules/`
- **Cline** - `.clinerules`
- **Amp** - `.amp/rules/`
- **Aider** - `.aider/rules/`
- **Firebase Studio** - `.idx/airules.md`
- **OpenHands** - `.openhands/microagents/`
- **Gemini CLI** - `GEMINI.md`
- **Junie** - `.junie/rules/`
- **AugmentCode** - `augment-guidelines.md`
- **Kilo Code** - `.kilocode/rules/`
- **Goose** - `.goosehints`
- **Roo Code** - `.roo/rules/`
- **Warp** - `.warp/rules/`

## Installation

```bash
# npm
npm install -g @pleaseai/lint

# pnpm
pnpm add -g @pleaseai/lint

# bun
bun add -g @pleaseai/lint
```

## Usage

### Initialize (Interactive)

```bash
pleaseai-lint init
```

Interactively select which AI assistants to generate rules for.

### Generate Rules

```bash
pleaseai-lint generate
```

Generate rules for all configured AI assistants.

### Preview Rules

```bash
pleaseai-lint preview
```

Preview the generated rules without writing files.

### Check Configuration

```bash
pleaseai-lint check
```

Check your ESLint configuration status and see which rules are active.

## How It Works

1. **Parses** your ESLint configuration (supports flat config and legacy `.eslintrc`)
2. **Maps** ESLint rules to human-readable guidelines organized by category:
   - Type Safety & Explicitness
   - Code Quality
   - React & JSX
   - Security
   - Performance
   - Code Style
   - Imports & Exports
   - Testing
3. **Generates** AI-specific instruction files in the appropriate format for each tool

## Example Output

For a project with TypeScript ESLint rules, you might see guidelines like:

```markdown
### Type Safety & Explicitness

- Avoid using the any type
  - **Do**: Use specific types, unknown, or generics instead of any
  - **Don't**: Use any to bypass type checking
- Use strict equality operators (=== and !==)
  - **Do**: Always use === and !== for comparisons
  - **Don't**: Use == or != which perform type coercion
```

## Requirements

- Node.js 18+
- ESLint configuration in your project

## License

MIT
