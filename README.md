# Support-API mit Anthropic

Die API ordnet Supporttickets einer Kategorie zu und fasst das Anliegen in einem Satz zusammen. Beide Endpunkte verwenden dasselbe Claude Modell und denselben Anthropic API Key.

## Setup

1. Verwende Node.js 26 und installiere die Abhängigkeiten mit `npm ci`.
2. Kopiere `.env.example` nach `.env`.
3. Trage deinen API Key bei `ANTHROPIC_API_KEY` ein. Setze `LLM_MODEL` auf das Claude Haiku 5.5.
4. Starte den Server mit `npm run dev`. Mit der Standardkonfiguration läuft er auf `http://127.0.0.1:3000`.

## Endpunkte

- `POST /ai/triage` ruft die native Anthropic API über das Anthropic SDK auf. `aiClient.messages.parse()` verarbeitet die Antwort als Structured Output.
- `POST /ai/triage-compatible` ruft Anthropic über das OpenAI SDK auf. `openAiClient.chat.completions.create()` liefert Text, den die API als JSON einliest und mit Zod prüft.

Sende an beide Endpunkte einen JSON Body mit dem Feld `text`.

```json
{
  "text": "Mein Paket ist noch nicht angekommen."
}
```

Beide Endpunkte liefern bei Erfolg HTTP 200 und dieselbe Antwortstruktur.

```json
{
  "category": "delivery",
  "summary": "Das Paket ist noch nicht angekommen."
}
```
