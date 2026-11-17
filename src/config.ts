import { z } from 'zod';

const configSchema = z.object({
    ANTHROPIC_API_KEY: z.string().trim().min(1),
    LLM_MODEL: z.string().trim().min(1),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

const result = configSchema.safeParse(process.env);

if (!result.success) {
    const fields = result.error.issues.map(issue => issue.path.join('.'));
    throw new Error(`Prüfe diese Einträge in .env: ${fields.join(', ')}`);
}

export const config = result.data;
