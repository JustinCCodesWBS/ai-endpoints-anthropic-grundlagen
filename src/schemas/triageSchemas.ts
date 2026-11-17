import { z } from 'zod';

export const supportInput = z.strictObject({
    text: z.string().trim().min(1).max(1000),
});

export const triageOutput = z.strictObject({
    category: z.enum(['delivery', 'returns', 'other']),
    summary: z.string(),
});
