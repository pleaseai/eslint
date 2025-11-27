import type { RuleMappingDatabase } from '../eslint/types'

/**
 * React and JSX rule mappings
 */
export const reactRuleMappings: RuleMappingDatabase = {
  // React Core
  'react/jsx-key': {
    description: 'Provide unique key props for elements in arrays',
    category: 'react',
    doThis: 'Add unique key prop to elements in .map() or arrays',
    dontDoThis: 'Use array index as key or omit key props',
  },

  'react/jsx-no-target-blank': {
    description: 'Add rel="noopener noreferrer" to links with target="_blank"',
    category: 'security',
    doThis: 'Add rel="noopener noreferrer" when using target="_blank"',
    dontDoThis: 'Use target="_blank" without proper rel attribute',
  },

  'react/no-unescaped-entities': {
    description: 'Escape special characters in JSX text',
    category: 'react',
    doThis: 'Use HTML entities: &apos; &quot; &gt; &lt;',
    dontDoThis: 'Use unescaped quotes or special characters in JSX',
  },

  'react/jsx-no-useless-fragment': {
    description: 'Avoid unnecessary fragments',
    category: 'react',
    doThis: 'Remove fragments that wrap a single child',
    dontDoThis: 'Wrap single elements in unnecessary <> </> or <Fragment>',
  },

  'react/jsx-curly-brace-presence': {
    description: 'Use consistent curly braces in JSX',
    category: 'style',
    doThis: 'Be consistent with curly braces in JSX props',
    dontDoThis: 'Mix {\"string\"} and "string" inconsistently',
  },

  'react/self-closing-comp': {
    description: 'Use self-closing tags for components without children',
    category: 'style',
    doThis: 'Use <Component /> for components without children',
    dontDoThis: 'Use <Component></Component> when there are no children',
  },

  'react/no-array-index-key': {
    description: 'Avoid using array index as key',
    category: 'react',
    doThis: 'Use unique, stable identifiers as keys',
    dontDoThis: 'Use array index as key prop in lists',
  },

  'react/no-danger': {
    description: 'Avoid dangerouslySetInnerHTML',
    category: 'security',
    doThis: 'Use safer alternatives or sanitize HTML content',
    dontDoThis: 'Use dangerouslySetInnerHTML without careful consideration',
  },

  'react/no-deprecated': {
    description: 'Avoid deprecated React APIs',
    category: 'react',
    doThis: 'Use current React APIs and patterns',
    dontDoThis: 'Use deprecated methods like componentWillMount',
  },

  'react/no-direct-mutation-state': {
    description: 'Never mutate state directly',
    category: 'react',
    doThis: 'Use setState() or state setter from useState()',
    dontDoThis: 'Mutate this.state directly',
  },

  'react/no-unstable-nested-components': {
    description: 'Don\'t define components inside other components',
    category: 'react',
    doThis: 'Define components at module level',
    dontDoThis: 'Define components inside render or function body',
  },

  'react/function-component-definition': {
    description: 'Use consistent function component definition',
    category: 'style',
    doThis: 'Use consistent style for function components',
    dontDoThis: 'Mix arrow functions and function declarations for components',
  },

  'react/prop-types': {
    description: 'Define prop types for components',
    category: 'type-safety',
    doThis: 'Use TypeScript interfaces or PropTypes',
    dontDoThis: 'Leave props untyped',
  },

  // React Hooks
  'react-hooks/rules-of-hooks': {
    description: 'Follow the Rules of Hooks',
    category: 'react',
    doThis: 'Call hooks at the top level of function components',
    dontDoThis: 'Call hooks inside loops, conditions, or nested functions',
  },

  'react-hooks/exhaustive-deps': {
    description: 'Include all dependencies in hook dependency arrays',
    category: 'react',
    doThis: 'List all variables from component scope used in the effect',
    dontDoThis: 'Omit dependencies or suppress the warning',
  },

  // JSX Accessibility (jsx-a11y)
  'jsx-a11y/alt-text': {
    description: 'Provide alt text for images',
    category: 'react',
    doThis: 'Add meaningful alt text: <img alt="Description" />',
    dontDoThis: 'Omit alt attribute or use empty alt for meaningful images',
  },

  'jsx-a11y/anchor-is-valid': {
    description: 'Ensure anchors are valid',
    category: 'react',
    doThis: 'Use proper href or use a button for actions',
    dontDoThis: 'Use <a href="#"> or <a href="javascript:void(0)">',
  },

  'jsx-a11y/click-events-have-key-events': {
    description: 'Add keyboard handlers alongside click handlers',
    category: 'react',
    doThis: 'Add onKeyDown/onKeyUp handlers with onClick',
    dontDoThis: 'Add onClick without keyboard support',
  },

  'jsx-a11y/no-static-element-interactions': {
    description: 'Add roles to interactive non-semantic elements',
    category: 'react',
    doThis: 'Use semantic elements or add appropriate role',
    dontDoThis: 'Add click handlers to divs without role',
  },

  'jsx-a11y/label-has-associated-control': {
    description: 'Associate labels with form controls',
    category: 'react',
    doThis: 'Use htmlFor or nest input inside label',
    dontDoThis: 'Create labels without associated form controls',
  },

  'jsx-a11y/heading-has-content': {
    description: 'Ensure headings have content',
    category: 'react',
    doThis: 'Add visible content to heading elements',
    dontDoThis: 'Create empty h1-h6 elements',
  },

  'jsx-a11y/no-autofocus': {
    description: 'Avoid autofocus attribute',
    category: 'react',
    doThis: 'Use focus management with refs when needed',
    dontDoThis: 'Use autofocus attribute which can be disorienting',
  },
}
