import type { TrpcCliMeta } from 'trpc-cli'
import process from 'node:process'
import { initTRPC } from '@trpc/server'
import { createCli } from 'trpc-cli'
import z from 'zod'
import { check } from './commands/check'
import { preview } from './commands/preview'
import { options } from './consts/options'
import { generate } from './generate'
import { initialize } from './initialize'

const t = initTRPC.meta<TrpcCliMeta>().create()

export const router = t.router({
  init: t.procedure
    .meta({
      description: 'Initialize @pleaseai/lint and generate AI rules',
    })
    .input(
      z.object({
        file: z
          .string()
          .optional()
          .describe('Target file for ESLint --print-config'),
        agents: z
          .array(z.enum(options.agents))
          .optional()
          .describe('AI tools to generate rules for'),
        quiet: z
          .boolean()
          .default(process.env.CI === 'true' || process.env.CI === '1')
          .describe('Suppress interactive prompts'),
      }),
    )
    .mutation(async ({ input }) => {
      await initialize({
        targetFile: input.file,
        agents: input.agents,
        quiet: input.quiet,
      })
    }),

  generate: t.procedure
    .meta({
      description: 'Generate AI rules from ESLint configuration',
    })
    .input(
      z.object({
        file: z
          .string()
          .optional()
          .describe('Target file for ESLint --print-config'),
        agents: z
          .array(z.enum(options.agents))
          .optional()
          .describe('AI tools to generate rules for'),
        quiet: z
          .boolean()
          .default(false)
          .describe('Suppress interactive output'),
      }),
    )
    .mutation(async ({ input }) => {
      await generate({
        targetFile: input.file,
        agents: input.agents,
        quiet: input.quiet,
      })
    }),

  preview: t.procedure
    .meta({
      description: 'Preview generated rules without writing files',
    })
    .input(
      z.object({
        file: z
          .string()
          .optional()
          .describe('Target file for ESLint --print-config'),
        agent: z
          .enum(options.agents)
          .optional()
          .describe('Preview for specific AI tool'),
      }),
    )
    .query(async ({ input }) => {
      await preview({
        targetFile: input.file,
        agent: input.agent,
      })
    }),

  check: t.procedure
    .meta({
      description: 'Check ESLint configuration status',
    })
    .query(async () => {
      await check()
    }),
})

const cli = createCli({
  router,
  name: 'pleaseai-lint',
  version: '0.0.1',
  description: 'Convert ESLint config to AI rules for coding assistants',
})

if (!process.env.TEST) {
  cli.run()
}
