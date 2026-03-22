import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('./puzzles.json', 'utf-8'));
console.log(data.puzzle001.layout);