'use client';

import { useState } from 'react';
import type { WordCard, GridCell } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { getGrammarInsight, GrammarInsightInput } from '@/ai/flows/grammar-insight';
import { getSentenceSuggestions, SentenceSuggestionsInput } from '@/ai/flows/sentence-suggestions';
import { getBoardStateString, getPlayerHandString } from '@/lib/validation'; // Assuming these helpers exist
import { Loader2 } from 'lucide-react';


interface AIPanelProps {
  gameBoard: (GridCell | null)[][];
  currentHand: WordCard[];
}

export function AIPanel({ gameBoard, currentHand }: AIPanelProps) {
  const [grammarInsightOpen, setGrammarInsightOpen] = useState(false);
  const [sentenceSuggestionsOpen, setSentenceSuggestionsOpen] = useState(false);
  
  const [insightLoading, setInsightLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  
  const [grammarInput, setGrammarInput] = useState('');
  const [insightResult, setInsightResult] = useState('');
  
  const [suggestionsResult, setSuggestionsResult] = useState<string[]>([]);
  const [missingCategory, setMissingCategory] = useState('');


  const handleGetGrammarInsight = async () => {
    if (!grammarInput.trim()) {
      setInsightResult("Please enter a word sequence to analyze.");
      return;
    }
    setInsightLoading(true);
    setInsightResult('');
    try {
      const boardState = getBoardStateString(gameBoard);
      const input: GrammarInsightInput = {
        wordSequence: grammarInput,
        boardState: boardState,
      };
      const result = await getGrammarInsight(input);
      setInsightResult(result.insight);
    } catch (error) {
      console.error("Error getting grammar insight:", error);
      setInsightResult("Failed to get grammar insight. Please try again.");
    }
    setInsightLoading(false);
  };

  const handleGetSentenceSuggestions = async () => {
    if (!missingCategory.trim()) {
      setSuggestionsResult(["Please enter the category of the missing word."]);
      return;
    }
    setSuggestionsLoading(true);
    setSuggestionsResult([]);
    try {
      const boardStateForAI = gameBoard.map(row => row.map(cell => cell ? cell.text : null));
      const handForAI = currentHand.map(card => card.text);

      const input: SentenceSuggestionsInput = {
        boardState: boardStateForAI,
        hand: handForAI,
        category: missingCategory,
      };
      const result = await getSentenceSuggestions(input);
      setSuggestionsResult(result.suggestions.length > 0 ? result.suggestions : ["No suggestions found."]);
    } catch (error) {
      console.error("Error getting sentence suggestions:", error);
      setSuggestionsResult(["Failed to get sentence suggestions. Please try again."]);
    }
    setSuggestionsLoading(false);
  };

  return (
    <div className="mt-4 p-4 bg-card rounded-lg shadow-lg space-y-4 md:space-y-0 md:flex md:gap-4">
      <Dialog open={grammarInsightOpen} onOpenChange={setGrammarInsightOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">Grammar Insight</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grammar Insight</DialogTitle>
            <DialogDescription>
              Enter an invalid word sequence from the board to get an explanation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Textarea
              placeholder="e.g., Cat quickly run"
              value={grammarInput}
              onChange={(e) => setGrammarInput(e.target.value)}
              className="font-code"
            />
            <Button onClick={handleGetGrammarInsight} disabled={insightLoading} className="w-full">
              {insightLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Insight
            </Button>
            {insightResult && (
              <Card className="mt-4">
                <CardHeader><CardTitle>AI Explanation</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm font-code whitespace-pre-wrap">{insightResult}</p>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sentenceSuggestionsOpen} onOpenChange={setSentenceSuggestionsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">Sentence Suggestions</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sentence Suggestions</DialogTitle>
            <DialogDescription>
              Enter the category of word you need (e.g., Noun, Verb) to complete a sentence. AI will suggest words from your hand.
            </DialogDescription>
          </DialogHeader>
           <div className="space-y-4 py-2">
            <Textarea
              placeholder="e.g., Verb"
              value={missingCategory}
              onChange={(e) => setMissingCategory(e.target.value)}
              className="font-code"
            />
            <Button onClick={handleGetSentenceSuggestions} disabled={suggestionsLoading} className="w-full">
              {suggestionsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Suggestions
            </Button>
            {suggestionsResult.length > 0 && (
              <Card className="mt-4">
                <CardHeader><CardTitle>AI Suggestions</CardTitle></CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 font-code">
                    {suggestionsResult.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
