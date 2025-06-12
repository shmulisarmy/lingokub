'use server';

/**
 * @fileOverview Provides sentence suggestions to the player to complete valid sentences.
 *
 * - getSentenceSuggestions - A function that generates sentence suggestions.
 * - SentenceSuggestionsInput - The input type for the getSentenceSuggestions function.
 * - SentenceSuggestionsOutput - The return type for the getSentenceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentenceSuggestionsInputSchema = z.object({
  boardState: z
    .array(z.array(z.string().nullable()))
    .describe('The current state of the game board, represented as a 2D array of strings or null.'),
  hand: z.array(z.string()).describe('The player hand, represented as an array of strings.'),
  category: z.string().describe('the category of word that is missing'),
});
export type SentenceSuggestionsInput = z.infer<typeof SentenceSuggestionsInputSchema>;

const SentenceSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('Suggested words to complete the sentence.'),
});
export type SentenceSuggestionsOutput = z.infer<typeof SentenceSuggestionsOutputSchema>;

export async function getSentenceSuggestions(input: SentenceSuggestionsInput): Promise<SentenceSuggestionsOutput> {
  return sentenceSuggestionsFlow(input);
}

const sentenceSuggestionsPrompt = ai.definePrompt({
  name: 'sentenceSuggestionsPrompt',
  input: {schema: SentenceSuggestionsInputSchema},
  output: {schema: SentenceSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to help users complete sentences in a word game.

  Given the current board state, the player's hand, and the missing category, suggest words from the player's hand that can complete the sentence.

  Board State:
  {{#each boardState}}
    {{#each this}}
      {{this}} 
    {{/each}}
  {{/each}}

  Player Hand: {{hand}}

  Category of missing word: {{category}}

  Suggestions:`,
});

const sentenceSuggestionsFlow = ai.defineFlow(
  {
    name: 'sentenceSuggestionsFlow',
    inputSchema: SentenceSuggestionsInputSchema,
    outputSchema: SentenceSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await sentenceSuggestionsPrompt(input);
    return output!;
  }
);
