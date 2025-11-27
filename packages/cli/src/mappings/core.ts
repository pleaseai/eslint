import type { RuleMappingDatabase } from '../eslint/types'

/**
 * Core ESLint rule mappings
 */
export const coreRuleMappings: RuleMappingDatabase = {
  // Code Quality
  'no-console': {
    description: 'Remove console statements from production code',
    category: 'code-quality',
    dontDoThis: 'Leave console.log statements in production code',
    doThis: 'Use a proper logging library or remove debug statements',
  },

  'no-debugger': {
    description: 'Remove debugger statements',
    category: 'code-quality',
    dontDoThis: 'Leave debugger statements in code',
    doThis: 'Remove debugger statements before committing',
  },

  'no-alert': {
    description: 'Avoid using alert, confirm, and prompt',
    category: 'code-quality',
    dontDoThis: 'Use alert(), confirm(), or prompt()',
    doThis: 'Use proper UI components for user interactions',
  },

  'no-unused-vars': {
    description: 'Remove unused variables',
    category: 'code-quality',
    dontDoThis: 'Leave unused variables in code',
    doThis: 'Remove or use all declared variables',
  },

  'no-undef': {
    description: 'Avoid using undefined variables',
    category: 'type-safety',
    dontDoThis: 'Reference variables that are not defined',
    doThis: 'Ensure all variables are properly declared before use',
  },

  // Best Practices
  'prefer-const': {
    description: 'Use const for variables that are never reassigned',
    category: 'code-quality',
    doThis: 'Use const by default for all variable declarations',
    dontDoThis: 'Use let when the variable is never reassigned',
    getDescriptionWithOptions: (options) => {
      const config = options[0] as { destructuring?: string } | undefined
      if (config?.destructuring === 'all') {
        return 'Use const for destructured variables only when all are never reassigned'
      }
      return 'Use const for variables that are never reassigned'
    },
  },

  'no-var': {
    description: 'Use let or const instead of var',
    category: 'code-quality',
    doThis: 'Use const for constants, let for variables that change',
    dontDoThis: 'Use var for variable declarations',
  },

  'eqeqeq': {
    description: 'Use strict equality operators (=== and !==)',
    category: 'type-safety',
    doThis: 'Always use === and !== for comparisons',
    dontDoThis: 'Use == or != which perform type coercion',
  },

  // Style
  'quotes': {
    description: 'Use consistent quote style for strings',
    category: 'style',
    getDescriptionWithOptions: (options) => {
      const style = options[0] as string | undefined
      if (style === 'single')
        return 'Use single quotes for strings'
      if (style === 'double')
        return 'Use double quotes for strings'
      if (style === 'backtick')
        return 'Use template literals for strings'
      return 'Use consistent quote style for strings'
    },
  },

  'semi': {
    description: 'Use consistent semicolon style',
    category: 'style',
    getDescriptionWithOptions: (options) => {
      const style = options[0] as string | undefined
      if (style === 'always')
        return 'Always use semicolons at the end of statements'
      if (style === 'never')
        return 'Never use semicolons (ASI)'
      return 'Use consistent semicolon style'
    },
  },

  'indent': {
    description: 'Use consistent indentation',
    category: 'style',
    getDescriptionWithOptions: (options) => {
      const indent = options[0]
      if (indent === 'tab')
        return 'Use tabs for indentation'
      if (typeof indent === 'number')
        return `Use ${indent} spaces for indentation`
      return 'Use consistent indentation'
    },
  },

  // Modern JavaScript
  'prefer-template': {
    description: 'Use template literals instead of string concatenation',
    category: 'style',
    // eslint-disable-next-line no-template-curly-in-string
    doThis: 'Use template literals: `Hello ${name}`',
    dontDoThis: 'Use string concatenation: "Hello " + name',
  },

  'prefer-arrow-callback': {
    description: 'Use arrow functions for callbacks',
    category: 'style',
    doThis: 'Use arrow functions: array.map((item) => item.value)',
    dontDoThis: 'Use function expressions: array.map(function(item) { return item.value; })',
  },

  'object-shorthand': {
    description: 'Use shorthand syntax for object methods and properties',
    category: 'style',
    doThis: 'Use shorthand: { name, getValue() {} }',
    dontDoThis: 'Use verbose syntax: { name: name, getValue: function() {} }',
  },

  'prefer-destructuring': {
    description: 'Use destructuring for object and array assignments',
    category: 'style',
    doThis: 'Use destructuring: const { name } = obj',
    dontDoThis: 'Use direct access: const name = obj.name',
  },

  // Security
  'no-eval': {
    description: 'Never use eval() - it\'s a security risk',
    category: 'security',
    dontDoThis: 'Use eval() to execute dynamic code',
    doThis: 'Use safer alternatives like JSON.parse() for data',
  },

  'no-implied-eval': {
    description: 'Avoid implied eval through setTimeout/setInterval strings',
    category: 'security',
    dontDoThis: 'Use setTimeout("code", 100)',
    doThis: 'Use setTimeout(() => { /* code */ }, 100)',
  },

  'no-new-func': {
    description: 'Avoid creating functions with the Function constructor',
    category: 'security',
    dontDoThis: 'Use new Function("a", "return a")',
    doThis: 'Use regular function declarations or arrow functions',
  },

  // Error Handling
  'no-throw-literal': {
    description: 'Throw Error objects instead of literals',
    category: 'code-quality',
    doThis: 'throw new Error("Something went wrong")',
    dontDoThis: 'throw "Something went wrong"',
  },

  'no-empty': {
    description: 'Avoid empty block statements',
    category: 'code-quality',
    dontDoThis: 'Leave empty catch blocks or if/else blocks',
    doThis: 'Add comments explaining why block is empty, or add proper logic',
  },

  // Async
  'no-async-promise-executor': {
    description: 'Avoid async function as Promise executor',
    category: 'code-quality',
    dontDoThis: 'Use new Promise(async (resolve) => {})',
    doThis: 'Use new Promise((resolve) => {}) with proper async handling',
  },

  'require-await': {
    description: 'Async functions should contain await',
    category: 'code-quality',
    dontDoThis: 'Create async functions without await',
    doThis: 'Use async only when await is needed, or return a Promise',
  },

  'no-await-in-loop': {
    description: 'Avoid await inside loops for better performance',
    category: 'performance',
    dontDoThis: 'Use await inside for/while loops',
    doThis: 'Use Promise.all() for parallel execution',
  },

  'no-return-await': {
    description: 'Don\'t return await - just return the promise',
    category: 'performance',
    dontDoThis: 'return await promise',
    doThis: 'return promise (except in try/catch)',
  },

  // Complexity
  'no-nested-ternary': {
    description: 'Avoid nested ternary operators',
    category: 'code-quality',
    dontDoThis: 'Use nested ternaries: a ? b ? c : d : e',
    doThis: 'Use if/else statements or extract to variables',
  },

  'max-depth': {
    description: 'Limit nesting depth for better readability',
    category: 'code-quality',
    doThis: 'Use early returns and extract functions to reduce nesting',
    dontDoThis: 'Create deeply nested code structures',
  },

  'complexity': {
    description: 'Keep functions simple with limited cyclomatic complexity',
    category: 'code-quality',
    doThis: 'Break complex functions into smaller, focused functions',
    dontDoThis: 'Create functions with too many branches and conditions',
  },
}
