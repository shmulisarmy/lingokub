'use server';

/**
 * @fileOverview Grammar insight AI agent.
 *
 * - getGrammarInsight - A function that handles the process of providing grammar insights for invalid word sequences.
 * - GrammarInsightInput - The input type for the getGrammarInsight function.
 * - GrammarInsightOutput - The return type for the getGrammarInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GrammarInsightInputSchema = z.object({
  wordSequence: z
    .string()
    .describe('The invalid word sequence for which grammar insight is needed.'),
  boardState: z
    .string()
    .describe('The current state of the game board as a string.'),
});
export type GrammarInsightInput = z.infer<typeof GrammarInsightInputSchema>;

const GrammarInsightOutputSchema = z.object({
  insight: z
    .string()
    .describe('A grammatical explanation of why the word sequence is invalid, and suggestions for correction.'),
});
export type GrammarInsightOutput = z.infer<typeof GrammarInsightOutputSchema>;

export async function getGrammarInsight(input: GrammarInsightInput): Promise<GrammarInsightOutput> {
  return grammarInsightFlow(input);
}

const grammarInsightPrompt = ai.definePrompt({
  name: 'grammarInsightPrompt',
  input: {schema: GrammarInsightInputSchema},
  output: {schema: GrammarInsightOutputSchema},
  prompt: `You are a grammar expert. Given an invalid word sequence and the current state of the game board, explain why the sequence is invalid and suggest corrections.

Invalid Word Sequence: {{{wordSequence}}}
Current Board State: {{{boardState}}}`,
});

const grammarInsightFlow = ai.defineFlow(
  {
    name: 'grammarInsightFlow',
    inputSchema: GrammarInsightInputSchema,
    outputSchema: GrammarInsightOutputSchema,
  },
  async input => {
    const {output} = await grammarInsightPrompt(input);
    return output!;
  }
);
