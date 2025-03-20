import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname.replace(/^\//, '');

// Read the language context file
const filePath = join(__dirname, 'src', 'context', 'LanguageContext.tsx');
const content = readFileSync(filePath, 'utf-8');

// Simple parsing to extract the en and es translation objects
function extractTranslationKeys(content) {
  const enRegex = /en:\s*\{([\s\S]*?)\}\s*,\s*es:/;
  const esRegex = /es:\s*\{([\s\S]*?)\}\s*\}/;
  
  const enMatch = content.match(enRegex);
  const esMatch = content.match(esRegex);
  
  if (!enMatch || !esMatch) {
    console.error('Could not extract translation objects');
    return { en: [], es: [] };
  }
  
  const enContent = enMatch[1];
  const esContent = esMatch[1];
  
  // Extract keys using regex
  const keyRegex = /'([^']+)'\s*:/g;
  
  const enKeys = [];
  let enMatch2;
  while ((enMatch2 = keyRegex.exec(enContent)) !== null) {
    enKeys.push(enMatch2[1]);
  }
  
  keyRegex.lastIndex = 0; // Reset regex index
  
  const esKeys = [];
  let esMatch2;
  while ((esMatch2 = keyRegex.exec(esContent)) !== null) {
    esKeys.push(esMatch2[1]);
  }
  
  return { en: enKeys, es: esKeys };
}

// Find duplicate keys
function findDuplicates(keys) {
  const seen = {};
  const duplicates = [];
  
  for (const key of keys) {
    if (seen[key]) {
      duplicates.push(key);
    } else {
      seen[key] = true;
    }
  }
  
  return duplicates;
}

// Main execution
const { en, es } = extractTranslationKeys(content);

const enDuplicates = findDuplicates(en);
const esDuplicates = findDuplicates(es);

console.log('English duplicates:', enDuplicates);
console.log('Spanish duplicates:', esDuplicates);
