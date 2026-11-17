import Anthropic from '@anthropic-ai/sdk';
import type { ErrorRequestHandler } from 'express';
import OpenAI from 'openai';
import { ZodError } from 'zod';
import { AiResponseError } from '../errors/AiResponseError.ts';

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof ZodError) {
        res.status(400).json({ message: 'Gib nur text mit 1 bis 1000 Zeichen an.' });
        return;
    }

    if (error instanceof Error && 'type' in error) {
        if (error.type === 'entity.parse.failed') {
            res.status(400).json({ message: 'Der Request-Body enthält ungültiges JSON.' });
            return;
        }
        if (error.type === 'entity.too.large') {
            res.status(413).json({ message: 'Der Request-Body ist zu groß.' });
            return;
        }
    }

    if (error instanceof Anthropic.APIError || error instanceof OpenAI.APIError) {
        console.error('Modellaufruf fehlgeschlagen', { name: error.name, status: error.status });
        res.status(502).json({ message: 'Der KI-Dienst konnte die Anfrage nicht beantworten.' });
        return;
    }

    if (error instanceof AiResponseError) {
        console.error(error.message);
        res.status(502).json({ message: error.message });
        return;
    }

    if (error instanceof Anthropic.AnthropicError) {
        console.error('Die strukturierte Modellantwort konnte nicht verarbeitet werden.');
        res.status(502).json({ message: 'Die Modellantwort war unvollständig oder ungültig.' });
        return;
    }

    console.error('Unerwarteter Serverfehler');
    res.status(500).json({ message: 'Interner Serverfehler.' });
};
