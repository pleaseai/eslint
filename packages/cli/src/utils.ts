import { access, constants } from 'node:fs/promises'

/**
 * Check if a file exists
 */
export async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK)
    return true
  }
  catch {
    return false
  }
}

/**
 * ASCII art title
 */
export const title = `
TPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPW
Q         @pleaseai/lint                    Q
Q   ESLint to AI Rules Converter            Q
ZPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP]
`
