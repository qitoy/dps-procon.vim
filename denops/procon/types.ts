import { z } from "./deps.ts";

export const testSchema = z.object({
  input: z.string(),
  output: z.string(),
  name: z.string().optional(),
});

export const contextSchema = z.object({
  contest: z.object({
    url: z.string().url(),
    name: z.string(),
  }),
  alphabet: z.string(),
}).partial();

export const problemSchema = z.object({
  url: z.string().url(),
  name: z.string().optional(),
  tests: z.array(testSchema),
  context: contextSchema,
  memoryLimit: z.number().optional(),
  timeLimit: z.number().optional(),
});

export const contestSchema = z.object({
  url: z.string().url(),
  name: z.string(),
  problems: z.array(problemSchema.omit({
    tests: true,
    memoryLimit: true,
    timeLimit: true,
  })),
});

export type Test = z.infer<typeof testSchema>;
export type Context = z.infer<typeof contextSchema>;
export type Problem = z.infer<typeof problemSchema>;
export type Contest = z.infer<typeof contestSchema>;
