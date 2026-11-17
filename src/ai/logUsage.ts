export function logUsage(operation: string, inputTokens: number, outputTokens: number) {
    console.log(`${operation}: ${inputTokens} Input-Tokens, ${outputTokens} Output-Tokens`);
}
