import type { RequestHandler } from 'express';
import { triageAnthropic } from '../ai/triageAnthropic.ts';
import { triageCompatible } from '../ai/triageCompatible.ts';
import { supportInput } from '../schemas/triageSchemas.ts';

export const triage: RequestHandler = async (req, res) => {
    const { text } = supportInput.parse(req.body);
    res.json(await triageAnthropic(text));
};

export const compatibleTriage: RequestHandler = async (req, res) => {
    const { text } = supportInput.parse(req.body);
    res.json(await triageCompatible(text));
};
