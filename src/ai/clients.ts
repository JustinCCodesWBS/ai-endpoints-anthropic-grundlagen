import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { config } from '../config.ts';

const ANTHROPIC_URL = 'https://api.anthropic.com';
const MODEL_TIMEOUT_MS = 30_000;

export const model = config.LLM_MODEL;

export const aiClient = new Anthropic({
    baseURL: ANTHROPIC_URL,
    apiKey: config.ANTHROPIC_API_KEY,
    maxRetries: 0,
    timeout: MODEL_TIMEOUT_MS,
    logLevel: 'off',
});

export const openAiClient = new OpenAI({
    baseURL: ANTHROPIC_URL + '/v1/',
    apiKey: config.ANTHROPIC_API_KEY,
    maxRetries: 0,
    timeout: MODEL_TIMEOUT_MS,
    logLevel: 'off',
});
