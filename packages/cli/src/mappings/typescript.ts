import type { RuleMappingDatabase } from '../eslint/types'

/**
 * TypeScript-ESLint rule mappings
 */
export const typescriptRuleMappings: RuleMappingDatabase = {
  '@typescript-eslint/no-explicit-any': {
    description: 'Avoid using the any type',
    category: 'type-safety',
    doThis: 'Use specific types, unknown, or generics instead of any',
    dontDoThis: 'Use any to bypass type checking',
    getDescriptionWithOptions: (options) => {
      const config = options[0] as { ignoreRestArgs?: boolean } | undefined
      if (config?.ignoreRestArgs) {
        return 'Avoid any type (rest arguments are allowed)'
      }
      return 'Avoid using the any type'
    },
  },

  '@typescript-eslint/no-unused-vars': {
    description: 'Remove unused variables',
    category: 'code-quality',
    doThis: 'Remove or use all declared variables',
    dontDoThis: 'Leave unused variables in code',
    getDescriptionWithOptions: (options) => {
      const config = options[0] as { argsIgnorePattern?: string } | undefined
      if (config?.argsIgnorePattern) {
        return `Remove unused variables (pattern ${config.argsIgnorePattern} ignored)`
      }
      return 'Remove unused variables'
    },
  },

  '@typescript-eslint/explicit-function-return-type': {
    description: 'Add explicit return types to functions',
    category: 'type-safety',
    doThis: 'Add return type annotations: function foo(): string',
    dontDoThis: 'Rely on type inference for function return types',
  },

  '@typescript-eslint/explicit-module-boundary-types': {
    description: 'Add explicit types to exported functions and classes',
    category: 'type-safety',
    doThis: 'Type all exported function parameters and return values',
    dontDoThis: 'Export functions without explicit type annotations',
  },

  '@typescript-eslint/no-non-null-assertion': {
    description: 'Avoid non-null assertions (!)',
    category: 'type-safety',
    doThis: 'Use optional chaining (?.) or proper null checks',
    dontDoThis: 'Use ! to assert non-null without checking',
  },

  '@typescript-eslint/prefer-nullish-coalescing': {
    description: 'Use nullish coalescing operator (??)',
    category: 'type-safety',
    doThis: 'Use ?? for null/undefined checks: value ?? defaultValue',
    dontDoThis: 'Use || which also catches falsy values like 0 or ""',
  },

  '@typescript-eslint/prefer-optional-chain': {
    description: 'Use optional chaining (?.)',
    category: 'type-safety',
    doThis: 'Use optional chaining: obj?.prop?.nested',
    dontDoThis: 'Use verbose checks: obj && obj.prop && obj.prop.nested',
  },

  '@typescript-eslint/strict-boolean-expressions': {
    description: 'Use explicit boolean expressions',
    category: 'type-safety',
    doThis: 'Use explicit checks: if (value !== undefined)',
    dontDoThis: 'Use implicit truthiness: if (value)',
  },

  '@typescript-eslint/no-floating-promises': {
    description: 'Handle all promises - don\'t let them float',
    category: 'code-quality',
    doThis: 'Await promises or use .then()/.catch() or void operator',
    dontDoThis: 'Call async functions without handling the promise',
  },

  '@typescript-eslint/await-thenable': {
    description: 'Only await thenable values',
    category: 'code-quality',
    doThis: 'Only await promises or thenable objects',
    dontDoThis: 'Await non-promise values',
  },

  '@typescript-eslint/no-misused-promises': {
    description: 'Use promises correctly',
    category: 'code-quality',
    doThis: 'Handle promises properly in conditionals and callbacks',
    dontDoThis: 'Use promises where a boolean or void is expected',
  },

  '@typescript-eslint/consistent-type-imports': {
    description: 'Use type-only imports for types',
    category: 'imports',
    doThis: 'Use import type { Foo } for type-only imports',
    dontDoThis: 'Import types with regular import syntax',
  },

  '@typescript-eslint/consistent-type-definitions': {
    description: 'Use consistent type definition style',
    category: 'style',
    getDescriptionWithOptions: (options) => {
      const style = options[0] as string | undefined
      if (style === 'interface')
        return 'Prefer interface over type for object types'
      if (style === 'type')
        return 'Prefer type over interface for object types'
      return 'Use consistent type definition style'
    },
  },

  '@typescript-eslint/naming-convention': {
    description: 'Follow naming conventions',
    category: 'style',
    doThis: 'Follow project naming conventions for variables, types, and interfaces',
    dontDoThis: 'Use inconsistent naming styles',
  },

  '@typescript-eslint/no-inferrable-types': {
    description: 'Omit type annotations for trivially inferred types',
    category: 'style',
    doThis: 'Let TypeScript infer simple types: const x = 5',
    dontDoThis: 'Add redundant type annotations: const x: number = 5',
  },

  '@typescript-eslint/ban-types': {
    description: 'Avoid problematic built-in types',
    category: 'type-safety',
    doThis: 'Use Record<string, unknown> instead of {}',
    dontDoThis: 'Use {}, Object, Function as types',
  },

  '@typescript-eslint/no-unsafe-assignment': {
    description: 'Avoid assigning any to typed variables',
    category: 'type-safety',
    doThis: 'Ensure type safety when assigning values',
    dontDoThis: 'Assign any values to typed variables',
  },

  '@typescript-eslint/no-unsafe-member-access': {
    description: 'Avoid accessing members of any typed values',
    category: 'type-safety',
    doThis: 'Type values before accessing their properties',
    dontDoThis: 'Access properties on any typed values',
  },

  '@typescript-eslint/no-unsafe-call': {
    description: 'Avoid calling any typed values as functions',
    category: 'type-safety',
    doThis: 'Ensure proper typing before calling functions',
    dontDoThis: 'Call any typed values as functions',
  },

  '@typescript-eslint/no-unsafe-return': {
    description: 'Avoid returning any from functions',
    category: 'type-safety',
    doThis: 'Ensure return values have proper types',
    dontDoThis: 'Return any from typed functions',
  },
}
