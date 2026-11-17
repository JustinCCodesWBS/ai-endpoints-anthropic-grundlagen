import { AiResponseError } from '../errors/AiResponseError.ts';
import { triageOutput } from '../schemas/triageSchemas.ts';
import { model, openAiClient } from './clients.ts';
import { logUsage } from './logUsage.ts';
import { TRIAGE_MAX_TOKENS, TRIAGE_SYSTEM } from './triageSettings.ts';

export async function triageCompatible(text: string) {
    const result = await openAiClient.chat.completions.create({
        model,
        max_tokens: TRIAGE_MAX_TOKENS,
        messages: [
            {
                role: 'system',
                content: TRIAGE_SYSTEM + ' Gib ausschließlich JSON mit den Feldern category und summary aus.',
            },
            { role: 'user', content: `<ticket>${text}</ticket>` },
        ],
    });

    if (result.usage) {
        logUsage('triage-compatible', result.usage.prompt_tokens, result.usage.completion_tokens);
    }

    const choice = result.choices[0];
    if (choice?.finish_reason !== 'stop' || !choice.message.content) {
        throw new AiResponseError('Die Kategorisierung wurde nicht vollständig erstellt.');
    }

    return parseTriageText(choice.message.content);
}

function parseTriageText(text: string) {
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch {
        throw new AiResponseError('Die Modellantwort enthält kein gültiges JSON.');
    }

    const parsed = triageOutput.safeParse(value);
    if (!parsed.success) {
        throw new AiResponseError('Die Modellantwort erfüllt das erwartete Format nicht.');
    }

    return parsed.data;
}