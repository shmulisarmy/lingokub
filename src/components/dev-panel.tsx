
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, SENTENCE_PATTERNS, INITIAL_DECK } from '@/lib/constants';
import type { CardCategory, SentencePattern, WordCard } from '@/types';
import { XIcon, SparklesIcon } from 'lucide-react';

interface DevPanelProps {
  onClose: () => void;
}

const MAX_SEARCH_TERMS = 5;

export function DevPanel({ onClose }: DevPanelProps) {
  const [searchSequence, setSearchSequence] = useState<(CardCategory | '')[]>(
    Array(MAX_SEARCH_TERMS).fill('')
  );
  const [filteredPatterns, setFilteredPatterns] = useState<SentencePattern[]>([]);
  const [selectOpenStates, setSelectOpenStates] = useState<boolean[]>(
    Array(MAX_SEARCH_TERMS).fill(false)
  );
  const [exampleSentences, setExampleSentences] = useState<Record<string, string>>({});

  const handleCategoryChange = (index: number, value: CardCategory | '') => {
    const newSequence = [...searchSequence];
    newSequence[index] = value;
    setSearchSequence(newSequence);
  };

  const handleSelectOpenChange = (index: number, isOpen: boolean) => {
    const newOpenStates = [...selectOpenStates];
    if (isOpen) {
      //? why not just do 'newOpenStates[index] = true;'
      for (let i = 0; i < newOpenStates.length; i++) {
        newOpenStates[i] = i === index;
      }
    } else {
      newOpenStates[index] = false;
    }
    setSelectOpenStates(newOpenStates);
  };

  const handleSearch = useCallback(() => {
    const activeSearchPrefix = searchSequence.filter(term => term !== '');
    if (activeSearchPrefix.length === 0) {
      setFilteredPatterns(SENTENCE_PATTERNS);
      return;
    }

    const matched: SentencePattern[] = [];
    SENTENCE_PATTERNS.forEach(pattern => {
      for (const structureRule of pattern.structure) {
        if (structureRule.length >= activeSearchPrefix.length) {
          let isMatch = true;
          for (let i = 0; i < activeSearchPrefix.length; i++) {
            if (activeSearchPrefix[i] !== structureRule[i]) {
              isMatch = false;
              break;
            }
          }
          if (isMatch) {
            matched.push(pattern);
            return; 
          }
        }
      }
    });
    setFilteredPatterns(matched);
    setExampleSentences({}); // Clear examples on new search
    setSelectOpenStates(Array(MAX_SEARCH_TERMS).fill(false)); 
  }, [searchSequence]);

  const handleReset = () => {
    setSearchSequence(Array(MAX_SEARCH_TERMS).fill(''));
    setFilteredPatterns([]);
    setExampleSentences({});
    setSelectOpenStates(Array(MAX_SEARCH_TERMS).fill(false));
  };

  const generateExample = (patternIndex: number, structureRuleIndex: number) => {
    const pattern = filteredPatterns[patternIndex];
    if (!pattern) return;
    const structureRule = pattern.structure[structureRuleIndex];
    if (!structureRule) return;

    const exampleWords: string[] = [];
    for (const category of structureRule) {
      const wordsInCategory = INITIAL_DECK.filter(card => card.categories.includes(category));
      if (wordsInCategory.length > 0) {
        const randomWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
        exampleWords.push(randomWord.text);
      } else {
        exampleWords.push(`[${category}?]`);
      }
    }
    
    setExampleSentences(prev => ({
      ...prev,
      [`${patternIndex}-${structureRuleIndex}`]: exampleWords.join(' ')
    }));
  };

  return (
    <Card className="fixed bottom-4 right-4 w-full max-w-lg z-[100] shadow-2xl bg-background/95 backdrop-blur-sm max-h-[80vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Developer Pattern Inspector</CardTitle>
          <CardDescription>Search for sentence patterns. (Cmd/Ctrl+B to toggle)</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close developer panel">
          <XIcon className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 items-end">
          {searchSequence.map((selectedCategory, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <label htmlFor={`category-select-${index}`} className="text-xs font-medium text-muted-foreground">
                Position {index + 1}
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => handleCategoryChange(index, value as CardCategory | '')}
                open={selectOpenStates[index]}
                onOpenChange={(isOpen) => handleSelectOpenChange(index, isOpen)}
              >
                <SelectTrigger id={`category-select-${index}`}>
                  <SelectValue placeholder="Any Category" />
                </SelectTrigger>
                <SelectContent className="z-[110]">
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSearch} className="flex-grow">Search Patterns</Button>
          <Button onClick={handleReset} variant="outline" className="flex-grow">Reset Search</Button>
        </div>
        
        {filteredPatterns.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-foreground">Matching Patterns ({filteredPatterns.length}):</h4>
            <div className="max-h-[35vh] overflow-y-auto p-2 border rounded-md bg-muted/50 space-y-1">
              {filteredPatterns.map((pattern, pIndex) => (
                <div key={pIndex} className="text-xs p-2 rounded bg-card mb-2 shadow">
                  <strong className="text-primary block mb-1">{pattern.name}:</strong>
                  <ul className="list-none ml-0 space-y-1">
                  {pattern.structure.map((struct, sIndex) => {
                    const exampleKey = `${pIndex}-${sIndex}`;
                    return (
                      <li key={sIndex} className="p-1 border-b border-border/50 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <span>{struct.join(' - ')}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-6 px-2 py-1 text-xs"
                            onClick={() => generateExample(pIndex, sIndex)}
                          >
                            <SparklesIcon className="mr-1 h-3 w-3" />
                            Example
                          </Button>
                        </div>
                        {exampleSentences[exampleKey] && (
                          <p className="mt-1 text-xs text-accent-foreground italic bg-accent/10 p-1 rounded">
                            Ex: {exampleSentences[exampleKey]}
                          </p>
                        )}
                      </li>
                    );
                  })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
         {filteredPatterns.length === 0 && searchSequence.some(s => s !== '') && (
             <p className="text-sm text-muted-foreground mt-4">No patterns found matching your criteria.</p>
         )}
      </CardContent>
    </Card>
  );
}


