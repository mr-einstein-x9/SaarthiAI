import * as fs from 'fs';
import { shlokas } from './lib/shlokas';

fs.writeFileSync('verses.json', JSON.stringify(shlokas, null, 2));
console.log("verses.json created");
