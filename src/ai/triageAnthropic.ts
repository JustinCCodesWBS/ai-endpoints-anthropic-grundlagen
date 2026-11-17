import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { AiResponseError } from '../errors/AiResponseError.ts';
import { triageOutput } from '../schemas/triageSchemas.ts';
import { aiClient, model } from './clients.ts';
import { logUsage } from './logUsage.ts';
import { TRIAGE_MAX_TOKENS, TRIAGE_SYSTEM } from './triageSettings.ts';

export async function triageAnthropic(text: string) {
    const modelResponse = await aiClient.messages.parse({
        model,
        max_tokens: TRIAGE_MAX_TOKENS,
        system: TRIAGE_SYSTEM,
        messages: [{ role: 'user', content: `<ticket>${text}</ticket>` }],
        // Structured Output
        output_config: { format: zodOutputFormat(triageOutput) },
    });

    logUsage('triage', modelResponse.usage.input_tokens, modelResponse.usage.output_tokens);

    if (modelResponse.stop_reason !== 'end_turn' || !modelResponse.parsed_output) {
        throw new AiResponseError('Die Kategorisierung wurde nicht vollständig erstellt.');
    }

    return modelResponse.parsed_output;
}