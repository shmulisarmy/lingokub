
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, SENTENCE_PATTERNS } from '@/lib/constants';
import type { CardCategory, SentencePattern } from '@/types';
import { XIcon } from 'lucide-react';

interface DevPanelProps {
  onClose: () => void;
}

const MAX_SEARCH_TERMS = 5;

export function DevPanel({ onClose }: DevPanelProps) {
  const [searchSequence, setSearchSequence] = useState<(CardCategory | '')[]>(
    Array(MAX_SEARCH_TERMS).fill('')
  );
  const [filteredPatterns, setFilteredPatterns] = useState<SentencePattern[]>([]);

  const handleCategoryChange = (index: number, value: CardCategory | '') => {
    const newSequence = [...searchSequence];
    newSequence[index] = value;
    setSearchSequence(newSequence);
  };

  const handleSearch = useCallback(() => {
    const activeSearchPrefix = searchSequence.filter(term => term !== '');
    if (activeSearchPrefix.length === 0) {
      setFilteredPatterns(SENTENCE_PATTERNS); // Show all if search is empty
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
            return; // Add pattern once if any of its structures match
          }
        }
      }
    });
    setFilteredPatterns(matched);
  }, [searchSequence]);

  const handleReset = () => {
    setSearchSequence(Array(MAX_SEARCH_TERMS).fill(''));
    setFilteredPatterns([]);
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
              >
                <SelectTrigger id={`category-select-${index}`}>
                  <SelectValue placeholder="Any Category" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="">Any Category</SelectItem> Removed this line */}
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
            <div className="max-h-[40vh] overflow-y-auto p-2 border rounded-md bg-muted/50 space-y-1">
              {filteredPatterns.map((pattern, pIndex) => (
                <div key={pIndex} className="text-xs p-1 rounded bg-card">
                  <strong className="text-primary">{pattern.name}:</strong>
                  <ul className="list-disc list-inside ml-2">
                  {pattern.structure.map((struct, sIndex) => (
                    <li key={sIndex}>{struct.join(' - ')}</li>
                  ))}
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
