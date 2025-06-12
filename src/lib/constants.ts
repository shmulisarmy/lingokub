
import type { WordCard, CardCategory, SentencePattern } from '@/types';
import { nanoid } from 'nanoid';

export const GRID_ROWS = 5;
export const GRID_COLS = 8;
export const INITIAL_HAND_SIZE = 14;
export const PLAYER_COUNT = 2;

export const CATEGORIES: CardCategory[] = [
  'Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun', 
  'Article', 'Preposition', 'Conjunction'
];

export const CARD_COLORS: Record<CardCategory, string> = {
  Noun: 'noun-gradient',
  Verb: 'verb-gradient',
  Adjective: 'adjective-gradient',
  Adverb: 'adverb-gradient',
  Pronoun: 'pronoun-gradient',
  Article: 'article-gradient',
  Preposition: 'preposition-gradient',
  Conjunction: 'conjunction-gradient',
  Unknown: 'default-gradient',
};

export const INITIAL_DECK: WordCard[] = [
  // Nouns
  { id: nanoid(), text: 'Apple', categories: ['Noun'] }, { id: nanoid(), text: 'Ant', categories: ['Noun'] },
  { id: nanoid(), text: 'Art', categories: ['Noun'] }, { id: nanoid(), text: 'Actor', categories: ['Noun'] },
  { id: nanoid(), text: 'Ball', categories: ['Noun'] }, { id: nanoid(), text: 'Book', categories: ['Noun'] },
  { id: nanoid(), text: 'Bear', categories: ['Noun'] }, { id: nanoid(), text: 'Boat', categories: ['Noun'] },
  { id: nanoid(), text: 'Box', categories: ['Noun'] }, { id: nanoid(), text: 'Bread', categories: ['Noun'] },
  { id: nanoid(), text: 'Cat', categories: ['Noun'] }, { id: nanoid(), text: 'Car', categories: ['Noun'] },
  { id: nanoid(), text: 'Cake', categories: ['Noun'] }, { id: nanoid(), text: 'Cloud', categories: ['Noun'] },
  { id: nanoid(), text: 'Chair', categories: ['Noun'] }, { id: nanoid(), text: 'City', categories: ['Noun'] },
  { id: nanoid(), text: 'Dog', categories: ['Noun'] }, { id: nanoid(), text: 'Door', categories: ['Noun'] },
  { id: nanoid(), text: 'Dream', categories: ['Noun'] }, { id: nanoid(), text: 'Desk', categories: ['Noun'] },
  { id: nanoid(), text: 'Day', categories: ['Noun'] }, { id: nanoid(), text: 'Duck', categories: ['Noun'] },
  { id: nanoid(), text: 'Egg', categories: ['Noun'] }, { id: nanoid(), text: 'Earth', categories: ['Noun'] },
  { id: nanoid(), text: 'Elephant', categories: ['Noun'] }, { id: nanoid(), text: 'Eye', categories: ['Noun'] },
  { id: nanoid(), text: 'Fish', categories: ['Noun'] }, { id: nanoid(), text: 'Flower', categories: ['Noun'] },
  { id: nanoid(), text: 'Friend', categories: ['Noun'] }, { id: nanoid(), text: 'Fire', categories: ['Noun'] },
  { id: nanoid(), text: 'Forest', categories: ['Noun'] }, { id: nanoid(), text: 'Farm', categories: ['Noun'] },
  { id: nanoid(), text: 'Game', categories: ['Noun'] }, { id: nanoid(), text: 'Goat', categories: ['Noun'] },
  { id: nanoid(), text: 'Glass', categories: ['Noun'] }, { id: nanoid(), text: 'Garden', categories: ['Noun'] },
  { id: nanoid(), text: 'Ghost', categories: ['Noun'] }, { id: nanoid(), text: 'Gift', categories: ['Noun'] },
  { id: nanoid(), text: 'House', categories: ['Noun'] }, { id: nanoid(), text: 'Hat', categories: ['Noun'] },
  { id: nanoid(), text: 'Hand', categories: ['Noun'] }, { id: nanoid(), text: 'Heart', categories: ['Noun'] },
  { id: nanoid(), text: 'Horse', categories: ['Noun'] }, { id: nanoid(), text: 'Hill', categories: ['Noun'] },
  { id: nanoid(), text: 'Idea', categories: ['Noun'] }, { id: nanoid(), text: 'Ink', categories: ['Noun'] },
  { id: nanoid(), text: 'Island', categories: ['Noun'] }, { id: nanoid(), text: 'Iron', categories: ['Noun'] },
  { id: nanoid(), text: 'Jam', categories: ['Noun'] }, { id: nanoid(), text: 'Jewel', categories: ['Noun'] },
  { id: nanoid(), text: 'Job', categories: ['Noun'] }, { id: nanoid(), text: 'Joke', categories: ['Noun'] },
  { id: nanoid(), text: 'Key', categories: ['Noun'] }, { id: nanoid(), text: 'King', categories: ['Noun'] },
  { id: nanoid(), text: 'Kite', categories: ['Noun'] }, { id: nanoid(), text: 'Kitchen', categories: ['Noun'] },
  { id: nanoid(), text: 'Lamp', categories: ['Noun'] }, { id: nanoid(), text: 'Leaf', categories: ['Noun'] },
  { id: nanoid(), text: 'Lion', categories: ['Noun'] }, { id: nanoid(), text: 'Lake', categories: ['Noun'] },
  { id: nanoid(), text: 'Man', categories: ['Noun'] }, { id: nanoid(), text: 'Moon', categories: ['Noun'] },
  { id: nanoid(), text: 'Mouse', categories: ['Noun'] }, { id: nanoid(), text: 'Map', categories: ['Noun'] },
  { id: nanoid(), text: 'Music', categories: ['Noun'] }, { id: nanoid(), text: 'Mountain', categories: ['Noun'] },
  { id: nanoid(), text: 'Nest', categories: ['Noun'] }, { id: nanoid(), text: 'Night', categories: ['Noun'] },
  { id: nanoid(), text: 'Nose', categories: ['Noun'] }, { id: nanoid(), text: 'Note', categories: ['Noun'] },
  { id: nanoid(), text: 'Orange', categories: ['Noun'] }, { id: nanoid(), text: 'Owl', categories: ['Noun'] },
  { id: nanoid(), text: 'Ocean', categories: ['Noun'] }, { id: nanoid(), text: 'Oil', categories: ['Noun'] },
  { id: nanoid(), text: 'Park', categories: ['Noun'] }, { id: nanoid(), text: 'Pen', categories: ['Noun'] },
  { id: nanoid(), text: 'Pig', categories: ['Noun'] }, { id: nanoid(), text: 'Pizza', categories: ['Noun'] },
  { id: nanoid(), text: 'Plant', categories: ['Noun'] }, { id: nanoid(), text: 'Path', categories: ['Noun'] },
  { id: nanoid(), text: 'Queen', categories: ['Noun'] }, { id: nanoid(), text: 'Quiet', categories: ['Noun'] }, // Also adjective
  { id: nanoid(), text: 'Quilt', categories: ['Noun'] }, { id: nanoid(), text: 'Quest', categories: ['Noun'] },
  { id: nanoid(), text: 'Rain', categories: ['Noun'] }, { id: nanoid(), text: 'Ring', categories: ['Noun'] },
  { id: nanoid(), text: 'Road', categories: ['Noun'] }, { id: nanoid(), text: 'Rock', categories: ['Noun'] },
  { id: nanoid(), text: 'Sun', categories: ['Noun'] }, { id: nanoid(), text: 'Star', categories: ['Noun'] },
  { id: nanoid(), text: 'Ship', categories: ['Noun'] }, { id: nanoid(), text: 'Shoe', categories: ['Noun'] },
  { id: nanoid(), text: 'School', categories: ['Noun'] }, { id: nanoid(), text: 'Song', categories: ['Noun'] },
  { id: nanoid(), text: 'Table', categories: ['Noun'] }, { id: nanoid(), text: 'Tree', categories: ['Noun'] },
  { id: nanoid(), text: 'Train', categories: ['Noun'] }, { id: nanoid(), text: 'Time', categories: ['Noun'] },
  { id: nanoid(), text: 'Tiger', categories: ['Noun'] }, { id: nanoid(), text: 'Town', categories: ['Noun'] },
  { id: nanoid(), text: 'Umbrella', categories: ['Noun'] }, { id: nanoid(), text: 'Uncle', categories: ['Noun'] },
  { id: nanoid(), text: 'Van', categories: ['Noun'] }, { id: nanoid(), text: 'Vase', categories: ['Noun'] },
  { id: nanoid(), text: 'Violin', categories: ['Noun'] }, { id: nanoid(), text: 'Village', categories: ['Noun'] },
  { id: nanoid(), text: 'Water', categories: ['Noun'] }, { id: nanoid(), text: 'Wind', categories: ['Noun'] },
  { id: nanoid(), text: 'Wolf', categories: ['Noun'] }, { id: nanoid(), text: 'Woman', categories: ['Noun'] },
  { id: nanoid(), text: 'World', categories: ['Noun'] }, { id: nanoid(), text: 'Window', categories: ['Noun'] },
  { id: nanoid(), text: 'Xylophone', categories: ['Noun'] },
  { id: nanoid(), text: 'Yarn', categories: ['Noun'] }, { id: nanoid(), text: 'Yak', categories: ['Noun'] },
  { id: nanoid(), text: 'Yard', categories: ['Noun'] }, { id: nanoid(), text: 'Yacht', categories: ['Noun'] },
  { id: nanoid(), text: 'Zebra', categories: ['Noun'] }, { id: nanoid(), text: 'Zoo', categories: ['Noun'] },
  { id: nanoid(), text: 'Zone', categories: ['Noun'] }, { id: nanoid(), text: 'Zero', categories: ['Noun'] },

  // Verbs
  { id: nanoid(), text: 'Ask', categories: ['Verb'] }, { id: nanoid(), text: 'Act', categories: ['Verb'] },
  { id: nanoid(), text: 'Add', categories: ['Verb'] },{ id: nanoid(), text: 'Arrive', categories: ['Verb'] },
  { id: nanoid(), text: 'Bring', categories: ['Verb'] }, { id: nanoid(), text: 'Build', categories: ['Verb'] },
  { id: nanoid(), text: 'Buy', categories: ['Verb'] }, { id: nanoid(), text: 'Begin', categories: ['Verb'] },
  { id: nanoid(), text: 'Bake', categories: ['Verb'] },
  { id: nanoid(), text: 'Call', categories: ['Verb'] }, { id: nanoid(), text: 'Come', categories: ['Verb'] },
  { id: nanoid(), text: 'Cook', categories: ['Verb'] }, { id: nanoid(), text: 'Clean', categories: ['Verb'] },
  { id: nanoid(), text: 'Climb', categories: ['Verb'] },
  { id: nanoid(), text: 'Do', categories: ['Verb'] }, { id: nanoid(), text: 'Drink', categories: ['Verb'] },
  { id: nanoid(), text: 'Drive', categories: ['Verb'] }, { id: nanoid(), text: 'Draw', categories: ['Verb'] },
  { id: nanoid(), text: 'Dance', categories: ['Verb'] },
  { id: nanoid(), text: 'Eat', categories: ['Verb'] }, { id: nanoid(), text: 'End', categories: ['Verb'] },
  { id: nanoid(), text: 'Enjoy', categories: ['Verb'] }, { id: nanoid(), text: 'Enter', categories: ['Verb'] },
  { id: nanoid(), text: 'Explain', categories: ['Verb'] },
  { id: nanoid(), text: 'Fly', categories: ['Verb'] }, { id: nanoid(), text: 'Find', categories: ['Verb'] },
  { id: nanoid(), text: 'Feel', categories: ['Verb'] }, { id: nanoid(), text: 'Fight', categories: ['Verb'] },
  { id: nanoid(), text: 'Follow', categories: ['Verb'] },
  { id: nanoid(), text: 'Go', categories: ['Verb'] }, { id: nanoid(), text: 'Get', categories: ['Verb'] },
  { id: nanoid(), text: 'Give', categories: ['Verb'] }, { id: nanoid(), text: 'Grow', categories: ['Verb'] },
  { id: nanoid(), text: 'Guess', categories: ['Verb'] },
  { id: nanoid(), text: 'Have', categories: ['Verb'] }, { id: nanoid(), text: 'Help', categories: ['Verb'] },
  { id: nanoid(), text: 'Hold', categories: ['Verb'] }, { id: nanoid(), text: 'Hear', categories: ['Verb'] },
  { id: nanoid(), text: 'Hope', categories: ['Verb'] },
  { id: nanoid(), text: 'Is', categories: ['Verb'] }, { id: nanoid(), text: 'Imagine', categories: ['Verb'] },
  { id: nanoid(), text: 'Invite', categories: ['Verb'] }, { id: nanoid(), text: 'Inform', categories: ['Verb'] },
  { id: nanoid(), text: 'Jump', categories: ['Verb'] }, { id: nanoid(), text: 'Join', categories: ['Verb'] },
  { id: nanoid(), text: 'Joke', categories: ['Verb'] }, { id: nanoid(), text: 'Judge', categories: ['Verb'] },
  { id: nanoid(), text: 'Keep', categories: ['Verb'] }, { id: nanoid(), text: 'Know', categories: ['Verb'] },
  { id: nanoid(), text: 'Kick', categories: ['Verb'] }, { id: nanoid(), text: 'Kiss', categories: ['Verb'] },
  { id: nanoid(), text: 'Like', categories: ['Verb'] }, { id: nanoid(), text: 'Look', categories: ['Verb'] },
  { id: nanoid(), text: 'Learn', categories: ['Verb'] }, { id: nanoid(), text: 'Listen', categories: ['Verb'] },
  { id: nanoid(), text: 'Live', categories: ['Verb'] },
  { id: nanoid(), text: 'Make', categories: ['Verb'] }, { id: nanoid(), text: 'Move', categories: ['Verb'] },
  { id: nanoid(), text: 'Meet', categories: ['Verb'] }, { id: nanoid(), text: 'Mean', categories: ['Verb'] },
  { id: nanoid(), text: 'Need', categories: ['Verb'] }, { id: nanoid(), text: 'Notice', categories: ['Verb'] },
  { id: nanoid(), text: 'Name', categories: ['Verb'] }, // Also Noun
  { id: nanoid(), text: 'Open', categories: ['Verb'] }, { id: nanoid(), text: 'Order', categories: ['Verb'] },
  { id: nanoid(), text: 'Offer', categories: ['Verb'] }, { id: nanoid(), text: 'Own', categories: ['Verb'] },
  { id: nanoid(), text: 'Play', categories: ['Verb'] }, { id: nanoid(), text: 'Put', categories: ['Verb'] },
  { id: nanoid(), text: 'Pass', categories: ['Verb'] }, { id: nanoid(), text: 'Pay', categories: ['Verb'] },
  { id: nanoid(), text: 'Paint', categories: ['Verb'] },
  { id: nanoid(), text: 'Quit', categories: ['Verb'] }, { id: nanoid(), text: 'Question', categories: ['Verb'] }, // Also Noun
  { id: nanoid(), text: 'Run', categories: ['Verb'] }, { id: nanoid(), text: 'Read', categories: ['Verb'] },
  { id: nanoid(), text: 'Ride', categories: ['Verb'] }, { id: nanoid(), text: 'Reply', categories: ['Verb'] },
  { id: nanoid(), text: 'Rest', categories: ['Verb'] },
  { id: nanoid(), text: 'See', categories: ['Verb'] }, { id: nanoid(), text: 'Say', categories: ['Verb'] },
  { id: nanoid(), text: 'Sing', categories: ['Verb'] }, { id: nanoid(), text: 'Sleep', categories: ['Verb'] },
  { id: nanoid(), text: 'Start', categories: ['Verb'] }, { id: nanoid(), text: 'Swim', categories: ['Verb'] },
  { id: nanoid(), text: 'Take', categories: ['Verb'] }, { id: nanoid(), text: 'Talk', categories: ['Verb'] },
  { id: nanoid(), text: 'Teach', categories: ['Verb'] }, { id: nanoid(), text: 'Tell', categories: ['Verb'] },
  { id: nanoid(), text: 'Think', categories: ['Verb'] }, { id: nanoid(), text: 'Travel', categories: ['Verb'] },
  { id: nanoid(), text: 'Use', categories: ['Verb'] }, { id: nanoid(), text: 'Understand', categories: ['Verb'] },
  { id: nanoid(), text: 'Visit', categories: ['Verb'] }, { id: nanoid(), text: 'Vote', categories: ['Verb'] },
  { id: nanoid(), text: 'Wait', categories: ['Verb'] }, { id: nanoid(), text: 'Walk', categories: ['Verb'] },
  { id: nanoid(), text: 'Want', categories: ['Verb'] }, { id: nanoid(), text: 'Watch', categories: ['Verb'] },
  { id: nanoid(), text: 'Work', categories: ['Verb'] }, { id: nanoid(), text: 'Write', categories: ['Verb'] },
  { id: nanoid(), text: 'Yell', categories: ['Verb'] }, { id: nanoid(), text: 'Yield', categories: ['Verb'] },
  { id: nanoid(), text: 'Zip', categories: ['Verb'] }, { id: nanoid(), text: 'Zoom', categories: ['Verb'] },


  // Adjectives
  { id: nanoid(), text: 'Angry', categories: ['Adjective'] }, { id: nanoid(), text: 'Able', categories: ['Adjective'] },
  { id: nanoid(), text: 'Awful', categories: ['Adjective'] },
  { id: nanoid(), text: 'Big', categories: ['Adjective'] }, { id: nanoid(), text: 'Blue', categories: ['Adjective'] },
  { id: nanoid(), text: 'Bad', categories: ['Adjective'] }, { id: nanoid(), text: 'Best', categories: ['Adjective'] },
  { id: nanoid(), text: 'Busy', categories: ['Adjective'] }, { id: nanoid(), text: 'Brave', categories: ['Adjective'] },
  { id: nanoid(), text: 'Bright', categories: ['Adjective'] },
  { id: nanoid(), text: 'Cold', categories: ['Adjective'] }, { id: nanoid(), text: 'Clean', categories: ['Adjective'] },
  { id: nanoid(), text: 'Clear', categories: ['Adjective'] }, { id: nanoid(), text: 'Cute', categories: ['Adjective'] },
  { id: nanoid(), text: 'Calm', categories: ['Adjective'] }, { id: nanoid(), text: 'Cool', categories: ['Adjective'] },
  { id: nanoid(), text: 'Dark', categories: ['Adjective'] }, { id: nanoid(), text: 'Dry', categories: ['Adjective'] },
  { id: nanoid(), text: 'Deep', categories: ['Adjective'] }, { id: nanoid(), text: 'Dead', categories: ['Adjective'] },
  { id: nanoid(), text: 'Easy', categories: ['Adjective'] }, { id: nanoid(), text: 'Empty', categories: ['Adjective'] },
  { id: nanoid(), text: 'Early', categories: ['Adjective'] }, { id: nanoid(), text: 'Evil', categories: ['Adjective'] },
  { id: nanoid(), text: 'Fast', categories: ['Adjective'] }, { id: nanoid(), text: 'Full', categories: ['Adjective'] },
  { id: nanoid(), text: 'Free', categories: ['Adjective'] }, { id: nanoid(), text: 'Fresh', categories: ['Adjective'] },
  { id: nanoid(), text: 'Fine', categories: ['Adjective'] }, { id: nanoid(), text: 'Fair', categories: ['Adjective'] },
  { id: nanoid(), text: 'Good', categories: ['Adjective'] }, { id: nanoid(), text: 'Great', categories: ['Adjective'] },
  { id: nanoid(), text: 'Green', categories: ['Adjective'] }, { id: nanoid(), text: 'Gentle', categories: ['Adjective'] },
  { id: nanoid(), text: 'Glad', categories: ['Adjective'] }, { id: nanoid(), text: 'Giant', categories: ['Adjective'] },
  { id: nanoid(), text: 'Happy', categories: ['Adjective'] }, { id: nanoid(), text: 'Hard', categories: ['Adjective'] },
  { id: nanoid(), text: 'High', categories: ['Adjective'] }, { id: nanoid(), text: 'Hot', categories: ['Adjective'] },
  { id: nanoid(), text: 'Heavy', categories: ['Adjective'] }, { id: nanoid(), text: 'Huge', categories: ['Adjective'] },
  { id: nanoid(), text: 'Kind', categories: ['Adjective'] }, { id: nanoid(), text: 'Keen', categories: ['Adjective'] },
  { id: nanoid(), text: 'Large', categories: ['Adjective'] }, { id: nanoid(), text: 'Little', categories: ['Adjective'] },
  { id: nanoid(), text: 'Long', categories: ['Adjective'] }, { id: nanoid(), text: 'Loud', categories: ['Adjective'] },
  { id: nanoid(), text: 'Low', categories: ['Adjective'] }, { id: nanoid(), text: 'Lovely', categories: ['Adjective'] },
  { id: nanoid(), text: 'Mad', categories: ['Adjective'] }, { id: nanoid(), text: 'Main', categories: ['Adjective'] },
  { id: nanoid(), text: 'Mean', categories: ['Adjective'] }, { id: nanoid(), text: 'Merry', categories: ['Adjective'] },
  { id: nanoid(), text: 'New', categories: ['Adjective'] }, { id: nanoid(), text: 'Nice', categories: ['Adjective'] },
  { id: nanoid(), text: 'Near', categories: ['Adjective'] }, { id: nanoid(), text: 'Noisy', categories: ['Adjective'] },
  { id: nanoid(), text: 'Old', categories: ['Adjective'] }, { id: nanoid(), text: 'Open', categories: ['Adjective'] },
  { id: nanoid(), text: 'Orange', categories: ['Adjective'] }, { id: nanoid(), text: 'Other', categories: ['Adjective'] },
  { id: nanoid(), text: 'Poor', categories: ['Adjective'] }, { id: nanoid(), text: 'Pretty', categories: ['Adjective'] },
  { id: nanoid(), text: 'Proud', categories: ['Adjective'] }, { id: nanoid(), text: 'Pure', categories: ['Adjective'] },
  { id: nanoid(), text: 'Quick', categories: ['Adjective'] }, { id: nanoid(), text: 'Quiet', categories: ['Adjective'] },
  { id: nanoid(), text: 'Red', categories: ['Adjective'] }, { id: nanoid(), text: 'Rich', categories: ['Adjective'] },
  { id: nanoid(), text: 'Right', categories: ['Adjective'] }, { id: nanoid(), text: 'Rough', categories: ['Adjective'] },
  { id: nanoid(), text: 'Round', categories: ['Adjective'] }, { id: nanoid(), text: 'Real', categories: ['Adjective'] },
  { id: nanoid(), text: 'Small', categories: ['Adjective'] }, { id: nanoid(), text: 'Sad', categories: ['Adjective'] },
  { id: nanoid(), text: 'Slow', categories: ['Adjective'] }, { id: nanoid(), text: 'Soft', categories: ['Adjective'] },
  { id: nanoid(), text: 'Strong', categories: ['Adjective'] }, { id: nanoid(), text: 'Sweet', categories: ['Adjective'] },
  { id: nanoid(), text: 'Sour', categories: ['Adjective'] },
  { id: nanoid(), text: 'Tall', categories: ['Adjective'] }, { id: nanoid(), text: 'Thin', categories: ['Adjective'] },
  { id: nanoid(), text: 'True', categories: ['Adjective'] }, { id: nanoid(), text: 'Tiny', categories: ['Adjective'] },
  { id: nanoid(), text: 'Tired', categories: ['Adjective'] }, { id: nanoid(), text: 'Thick', categories: ['Adjective'] },
  { id: nanoid(), text: 'Ugly', categories: ['Adjective'] }, { id: nanoid(), text: 'Unusual', categories: ['Adjective'] },
  { id: nanoid(), text: 'Vast', categories: ['Adjective'] }, { id: nanoid(), text: 'Violet', categories: ['Adjective'] },
  { id: nanoid(), text: 'Warm', categories: ['Adjective'] }, { id: nanoid(), text: 'Wet', categories: ['Adjective'] },
  { id: nanoid(), text: 'White', categories: ['Adjective'] }, { id: nanoid(), text: 'Wide', categories: ['Adjective'] },
  { id: nanoid(), text: 'Wild', categories: ['Adjective'] }, { id: nanoid(), text: 'Wise', categories: ['Adjective'] },
  { id: nanoid(), text: 'Wrong', categories: ['Adjective'] },
  { id: nanoid(), text: 'Young', categories: ['Adjective'] }, { id: nanoid(), text: 'Yellow', categories: ['Adjective'] },
  { id: nanoid(), text: 'Yummy', categories: ['Adjective'] },
  { id: nanoid(), text: 'Zany', categories: ['Adjective'] },

  // Adverbs
  { id: nanoid(), text: 'Always', categories: ['Adverb'] }, { id: nanoid(), text: 'Almost', categories: ['Adverb'] },
  { id: nanoid(), text: 'Again', categories: ['Adverb'] }, { id: nanoid(), text: 'Also', categories: ['Adverb'] },
  { id: nanoid(), text: 'Badly', categories: ['Adverb'] }, { id: nanoid(), text: 'Barely', categories: ['Adverb'] },
  { id: nanoid(), text: 'Carefully', categories: ['Adverb'] }, { id: nanoid(), text: 'Clearly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Daily', categories: ['Adverb'] }, { id: nanoid(), text: 'Deeply', categories: ['Adverb'] },
  { id: nanoid(), text: 'Early', categories: ['Adverb'] }, { id: nanoid(), text: 'Easily', categories: ['Adverb'] },
  { id: nanoid(), text: 'Enough', categories: ['Adverb'] }, { id: nanoid(), text: 'Even', categories: ['Adverb'] },
  { id: nanoid(), text: 'Fast', categories: ['Adverb'] }, { id: nanoid(), text: 'Finally', categories: ['Adverb'] },
  { id: nanoid(), text: 'Freely', categories: ['Adverb'] }, { id: nanoid(), text: 'Fully', categories: ['Adverb'] },
  { id: nanoid(), text: 'Gently', categories: ['Adverb'] }, { id: nanoid(), text: 'Gladly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Hard', categories: ['Adverb'] }, { id: nanoid(), text: 'Here', categories: ['Adverb'] },
  { id: nanoid(), text: 'Highly', categories: ['Adverb'] }, { id: nanoid(), text: 'However', categories: ['Adverb'] },
  { id: nanoid(), text: 'Inside', categories: ['Adverb'] }, { id: nanoid(), text: 'Instead', categories: ['Adverb'] },
  { id: nanoid(), text: 'Just', categories: ['Adverb'] }, { id: nanoid(), text: 'Kindly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Late', categories: ['Adverb'] }, { id: nanoid(), text: 'Later', categories: ['Adverb'] },
  { id: nanoid(), text: 'Loudly', categories: ['Adverb'] }, { id: nanoid(), text: 'Low', categories: ['Adverb'] },
  { id: nanoid(), text: 'Maybe', categories: ['Adverb'] }, { id: nanoid(), text: 'More', categories: ['Adverb'] },
  { id: nanoid(), text: 'Much', categories: ['Adverb'] }, { id: nanoid(), text: 'Madly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Near', categories: ['Adverb'] }, { id: nanoid(), text: 'Nearly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Never', categories: ['Adverb'] }, { id: nanoid(), text: 'Next', categories: ['Adverb'] },
  { id: nanoid(), text: 'Now', categories: ['Adverb'] }, { id: nanoid(), text: 'Nicely', categories: ['Adverb'] },
  { id: nanoid(), text: 'Often', categories: ['Adverb'] }, { id: nanoid(), text: 'Once', categories: ['Adverb'] },
  { id: nanoid(), text: 'Only', categories: ['Adverb'] }, { id: nanoid(), text: 'Outside', categories: ['Adverb'] },
  { id: nanoid(), text: 'Over', categories: ['Adverb'] }, { id: nanoid(), text: 'Openly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Politely', categories: ['Adverb'] }, { id: nanoid(), text: 'Poorly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Quickly', categories: ['Adverb'] }, { id: nanoid(), text: 'Quietly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Quite', categories: ['Adverb'] },
  { id: nanoid(), text: 'Rarely', categories: ['Adverb'] }, { id: nanoid(), text: 'Really', categories: ['Adverb'] },
  { id: nanoid(), text: 'Right', categories: ['Adverb'] }, { id: nanoid(), text: 'Roughly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Sadly', categories: ['Adverb'] }, { id: nanoid(), text: 'Seldom', categories: ['Adverb'] },
  { id: nanoid(), text: 'Slowly', categories: ['Adverb'] }, { id: nanoid(), text: 'So', categories: ['Adverb'] },
  { id: nanoid(), text: 'Soon', categories: ['Adverb'] }, { id: nanoid(), text: 'Still', categories: ['Adverb'] },
  { id: nanoid(), text: 'Surely', categories: ['Adverb'] }, { id: nanoid(), text: 'Silently', categories: ['Adverb'] },
  { id: nanoid(), text: 'Then', categories: ['Adverb'] }, { id: nanoid(), text: 'There', categories: ['Adverb'] },
  { id: nanoid(), text: 'Today', categories: ['Adverb'] }, { id: nanoid(), text: 'Too', categories: ['Adverb'] },
  { id: nanoid(), text: 'Truly', categories: ['Adverb'] }, { id: nanoid(), text: 'Thus', categories: ['Adverb'] },
  { id: nanoid(), text: 'Under', categories: ['Adverb'] }, { id: nanoid(), text: 'Usually', categories: ['Adverb'] },
  { id: nanoid(), text: 'Very', categories: ['Adverb'] },
  { id: nanoid(), text: 'Well', categories: ['Adverb'] }, { id: nanoid(), text: 'When', categories: ['Adverb'] },
  { id: nanoid(), text: 'Where', categories: ['Adverb'] }, { id: nanoid(), text: 'Why', categories: ['Adverb'] },
  { id: nanoid(), text: 'Wisely', categories: ['Adverb'] }, { id: nanoid(), text: 'Warmly', categories: ['Adverb'] },
  { id: nanoid(), text: 'Yesterday', categories: ['Adverb'] }, { id: nanoid(), text: 'Yet', categories: ['Adverb'] },
  { id: nanoid(), text: 'Zestily', categories: ['Adverb'] },

  // Pronouns
  { id: nanoid(), text: 'I', categories: ['Pronoun'] }, { id: nanoid(), text: 'You', categories: ['Pronoun'] },
  { id: nanoid(), text: 'He', categories: ['Pronoun'] }, { id: nanoid(), text: 'She', categories: ['Pronoun'] },
  { id: nanoid(), text: 'It', categories: ['Pronoun'] }, { id: nanoid(), text: 'We', categories: ['Pronoun'] },
  { id: nanoid(), text: 'They', categories: ['Pronoun'] }, { id: nanoid(), text: 'Me', categories: ['Pronoun'] },
  { id: nanoid(), text: 'Him', categories: ['Pronoun'] }, { id: nanoid(), text: 'Her', categories: ['Pronoun'] },
  { id: nanoid(), text: 'Us', categories: ['Pronoun'] }, { id: nanoid(), text: 'Them', categories: ['Pronoun'] },
  { id: nanoid(), text: 'My', categories: ['Pronoun'] }, { id: nanoid(), text: 'Your', categories: ['Pronoun'] }, // Possessive Adjectives/Determiners, often grouped with Pronouns in games
  { id: nanoid(), text: 'His', categories: ['Pronoun'] }, { id: nanoid(), text: 'Its', categories: ['Pronoun'] },
  { id: nanoid(), text: 'Our', categories: ['Pronoun'] }, { id: nanoid(), text: 'Their', categories: ['Pronoun'] },
  { id: nanoid(), text: 'This', categories: ['Pronoun'] }, { id: nanoid(), text: 'That', categories: ['Pronoun'] },
  { id: nanoid(), text: 'These', categories: ['Pronoun'] }, { id: nanoid(), text: 'Those', categories: ['Pronoun'] },
  { id: nanoid(), text: 'Who', categories: ['Pronoun'] }, { id: nanoid(), text: 'What', categories: ['Pronoun'] },
  
  // Articles
  { id: nanoid(), text: 'A', categories: ['Article'] }, { id: nanoid(), text: 'An', categories: ['Article'] },
  { id: nanoid(), text: 'The', categories: ['Article'] },

  // Prepositions
  { id: nanoid(), text: 'In', categories: ['Preposition'] }, { id: nanoid(), text: 'On', categories: ['Preposition'] },
  { id: nanoid(), text: 'At', categories: ['Preposition'] }, { id: nanoid(), text: 'With', categories: ['Preposition'] },
  { id: nanoid(), text: 'By', categories: ['Preposition'] }, { id: nanoid(), text: 'For', categories: ['Preposition'] },
  { id: nanoid(), text: 'From', categories: ['Preposition'] }, { id: nanoid(), text: 'To', categories: ['Preposition'] },
  { id: nanoid(), text: 'Up', categories: ['Preposition'] }, { id: nanoid(), text: 'Down', categories: ['Preposition'] },
  { id: nanoid(), text: 'Over', categories: ['Preposition'] }, { id: nanoid(), text: 'Under', categories: ['Preposition'] },
  { id: nanoid(), text: 'Near', categories: ['Preposition'] }, { id: nanoid(), text: 'About', categories: ['Preposition'] },
  { id: nanoid(), text: 'Above', categories: ['Preposition'] }, { id: nanoid(), text: 'After', categories: ['Preposition'] },
  { id: nanoid(), text: 'Along', categories: ['Preposition'] }, { id: nanoid(), text: 'Around', categories: ['Preposition'] },
  { id: nanoid(), text: 'Before', categories: ['Preposition'] }, { id: nanoid(), text: 'Behind', categories: ['Preposition'] },
  { id: nanoid(), text: 'Below', categories: ['Preposition'] }, { id: nanoid(), text: 'Beside', categories: ['Preposition'] },
  { id: nanoid(), text: 'Between', categories: ['Preposition'] }, { id: nanoid(), text: 'During', categories: ['Preposition'] },
  { id: nanoid(), text: 'Inside', categories: ['Preposition'] }, { id: nanoid(), text: 'Into', categories: ['Preposition'] },
  { id: nanoid(), text: 'Onto', categories: ['Preposition'] }, { id: nanoid(), text: 'Out', categories: ['Preposition'] },
  { id: nanoid(), text: 'Past', categories: ['Preposition'] }, { id: nanoid(), text: 'Since', categories: ['Preposition'] },
  { id: nanoid(), text: 'Through', categories: ['Preposition'] }, { id: nanoid(), text: 'Toward', categories: ['Preposition'] },
  { id: nanoid(), text: 'Until', categories: ['Preposition'] }, { id: nanoid(), text: 'Upon', categories: ['Preposition'] },


  // Conjunctions
  { id: nanoid(), text: 'And', categories: ['Conjunction'] }, { id: nanoid(), text: 'But', categories: ['Conjunction'] },
  { id: nanoid(), text: 'Or', categories: ['Conjunction'] }, { id: nanoid(), text: 'So', categories: ['Conjunction'] },
  { id: nanoid(), text: 'For', categories: ['Conjunction'] }, { id: nanoid(), text: 'Nor', categories: ['Conjunction'] },
  { id: nanoid(), text: 'Yet', categories: ['Conjunction'] }, { id: nanoid(), text: 'After', categories: ['Conjunction'] },
  { id: nanoid(), text: 'Although', categories: ['Conjunction'] }, { id: nanoid(), text: 'As', categories: ['Conjunction'] },
  { id: nanoid(), text: 'Because', categories: ['Conjunction'] }, { id: nanoid(), text: 'Before', categories: ['Conjunction'] },
  { id: nanoid(), text: 'If', categories: ['Conjunction'] }, { id: nanoid(), text: 'Once', categories: ['Conjunction'] },
  { id: nanoid(), text: 'Since', categories: ['Conjunction'] }, { id: nanoid(), text: 'Than', categories: ['Conjunction'] },
  { id: nanoid(), text: 'That', categories: ['Conjunction'] }, { id: nanoid(), text: 'Though', categories: ['Conjunction'] },
  { id: nanoid(), text: 'Unless', categories: ['Conjunction'] }, { id: nanoid(), text: 'Until', categories: ['Conjunction'] },
  { id: nanoid(), text: 'When', categories: ['Conjunction'] }, { id: nanoid(), text: 'Where', categories: ['Conjunction'] },
  { id: nanoid(), text: 'While', categories: ['Conjunction'] },
];

export const SENTENCE_PATTERNS: SentencePattern[] = [
  // Basic patterns
  { name: "Pronoun-Verb", structure: [['Pronoun', 'Verb']] },
  { name: "Article-Noun-Verb", structure: [['Article', 'Noun', 'Verb']] },
  { name: "Noun-Verb", structure: [['Noun', 'Verb']] },
  
  // Patterns with Adjectives
  { name: "Pronoun-Verb-Adjective", structure: [['Pronoun', 'Verb', 'Adjective']] },
  { name: "Article-Adjective-Noun", structure: [['Article', 'Adjective', 'Noun']] },
  { name: "Noun-Verb-Adjective", structure: [['Noun', 'Verb', 'Adjective']] },
  { name: "Article-Noun-Verb-Adjective", structure: [['Article', 'Noun', 'Verb', 'Adjective']] },

  // Patterns with Adverbs
  { name: "Pronoun-Verb-Adverb", structure: [['Pronoun', 'Verb', 'Adverb']] },
  { name: "Noun-Verb-Adverb", structure: [['Noun', 'Verb', 'Adverb']] },
  { name: "Article-Noun-Verb-Adverb", structure: [['Article', 'Noun', 'Verb', 'Adverb']] },
  { name: "Pronoun-Adverb-Verb", structure: [['Pronoun', 'Adverb', 'Verb']] }, // e.g. I often run
  { name: "Noun-Adverb-Verb", structure: [['Noun', 'Adverb', 'Verb']] }, // e.g. Dogs often run
  
  // Patterns with Noun Objects
  { name: "Pronoun-Verb-Noun", structure: [['Pronoun', 'Verb', 'Noun']] },
  { name: "Article-Noun-Verb-Noun", structure: [['Article', 'Noun', 'Verb', 'Noun']] }, // The cat chased mice
  { name: "Noun-Verb-Noun", structure: [['Noun', 'Verb', 'Noun']] }, // Dogs chase cats
  { name: "Pronoun-Verb-Article-Noun", structure: [['Pronoun', 'Verb', 'Article', 'Noun']] }, // She has a car
  { name: "Noun-Verb-Article-Noun", structure: [['Noun', 'Verb', 'Article', 'Noun']] }, // Man bites a dog
  
  // Patterns with Prepositions
  { name: "Pronoun-Verb-Preposition-Article-Noun", structure: [['Pronoun', 'Verb', 'Preposition', 'Article', 'Noun']] }, // He ran to the park
  { name: "Noun-Verb-Preposition-Noun", structure: [['Noun', 'Verb', 'Preposition', 'Noun']] }, // Cat sleeps on bed
  { name: "Article-Noun-Verb-Preposition-Article-Noun", structure: [['Article', 'Noun', 'Verb', 'Preposition', 'Article', 'Noun']] }, // The dog ran under the table
  
  // Longer patterns
  { name: "Article-Adjective-Noun-Verb-Adverb", structure: [['Article', 'Adjective', 'Noun', 'Verb', 'Adverb']] }, // The big dog runs quickly
  { name: "Pronoun-Verb-Adjective-Noun", structure: [['Pronoun', 'Verb', 'Adjective', 'Noun']] }, // She likes red apples
  { name: "Article-Noun-Verb-Adjective-Noun", structure: [['Article', 'Noun', 'Verb', 'Adjective', 'Noun']] }, // The boy found a small toy

  // Simple imperatives
  { name: "Verb-Noun", structure: [['Verb', 'Noun']] }, // e.g. Eat food
  { name: "Verb-Pronoun", structure: [['Verb', 'Pronoun']] }, // e.g. Help them
  { name: "Verb-Adverb", structure: [['Verb', 'Adverb']] }, // e.g. Go quickly

  // Two-word sentences
  { name: "Noun-Verb", structure: [['Noun', 'Verb']] }, // Birds fly
  { name: "Pronoun-Verb", structure: [['Pronoun', 'Verb']] }, // It works

  // Patterns with conjunctions (basic) - these can get complex, keeping them simple
  { name: "Noun-Verb-Conjunction-Noun-Verb", structure: [['Noun', 'Verb', 'Conjunction', 'Noun', 'Verb']] }, // Dogs bark and cats meow
  { name: "Pronoun-Verb-Conjunction-Pronoun-Verb", structure: [['Pronoun', 'Verb', 'Conjunction', 'Pronoun', 'Verb']] }, // I run and he walks

  // More variety
  { name: "Adjective-Noun-Verb", structure: [['Adjective', 'Noun', 'Verb']] }, // e.g. Big dogs bark.
  { name: "Adverb-Adjective-Noun", structure: [['Adverb', 'Adjective', 'Noun']] }, // e.g. Very happy child. (can be part of a sentence)
  { name: "Noun-Is-Adjective", structure: [['Noun', 'Verb', 'Adjective']] }, // (Verb must be 'Is' or 'Are' typically) e.g. Sky is blue.
  { name: "Noun-Is-Noun", structure: [['Noun', 'Verb', 'Noun']] }, // (Verb must be 'Is' or 'Are' typically) e.g. Max is a dog.

  // Question fragments (might be too complex for simple validation but good for AI suggestions)
  // { name: "Question-Word-Noun-Verb", structure: [['Pronoun', 'Noun', 'Verb']] }, // e.g. What (Pronoun) time (Noun) is (Verb) it (Pronoun)?
];


export const SAME_LETTER_GROUP_MIN_LENGTH = 3;

// Ensure nanoid is installed: `npm install nanoid` or `yarn add nanoid`
// If nanoid causes issues with server components/Next.js build, a simpler unique ID generator can be used.
// For example: export const generateId = () => Math.random().toString(36).substr(2, 9);
// But nanoid is generally fine.

    