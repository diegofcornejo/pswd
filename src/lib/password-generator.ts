import {
  getSecureRandomInt,
  getSecureRandomIntInRange,
} from '@/helpers/crypto';
import { capitalizeString } from '@/helpers/string';

import {
  BASE62,
  BASE64URL,
  HEX,
  LOWERCASE,
  NUMBERS,
  SIMILAR_CHARACTERS,
  SYMBOLS,
  UPPERCASE,
} from './generator-constants';
import type {
  ApiKeyFormat,
  ApiKeyOptions,
  DicewareOptions,
  NormalOptions,
  PinOptions,
} from './generator-types';

function stripCharacters(source: string, toExclude: string) {
  if (!toExclude) return source;

  const escaped = toExclude.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const regex = new RegExp(`[${escaped}]`, 'g');

  return source.replace(regex, '');
}

export function generateNormalPassword(options: NormalOptions): string {
  let characterSet = '';

  if (options.includeUpper) characterSet += UPPERCASE;
  if (options.includeLower) characterSet += LOWERCASE;
  if (options.includeNumbers) characterSet += NUMBERS;
  if (options.includeSymbols) characterSet += SYMBOLS;

  if (options.customSymbols) {
    characterSet += options.customSymbols;
  }

  let toExclude = '';

  if (options.excludeSimilar) {
    toExclude += SIMILAR_CHARACTERS;
  }

  if (options.excludeSymbols) {
    toExclude += options.excludeSymbols;
  }

  characterSet = stripCharacters(characterSet, toExclude);

  if (characterSet.length === 0) {
    return '';
  }

  const passwordCharacters = [];
  const charsetLength = characterSet.length;

  for (let i = 0; i < options.length; i++) {
    const randomIndex = getSecureRandomInt(charsetLength);
    passwordCharacters.push(characterSet[randomIndex]);
  }

  return passwordCharacters.join('');
}

export function generateDicewarePassword(options: DicewareOptions): string {
  if (options.wordlist.length === 0) {
    throw new Error('Wordlist is empty. Please provide a valid wordlist.');
  }

  let words: Array<string | number | undefined> = [];
  const wordlistLength = options.wordlist.length;

  for (let i = 0; i < options.wordCount; i++) {
    const index = getSecureRandomInt(wordlistLength);
    const word = options.wordlist[index];

    words.push(options.capitalize ? capitalizeString(word) : word);
  }

  if (options.randomCapitalization) {
    words = words.map(word =>
      String(word)
        .split('')
        .map(letter =>
          Math.random() > 0.5 ? letter.toLowerCase() : letter.toUpperCase(),
        )
        .join(''),
    );
  }

  if (options.randomNumberBeginning) {
    words.unshift(getSecureRandomIntInRange(100, 999));
  }

  if (options.randomNumberEnd) {
    words.push(getSecureRandomIntInRange(100, 999));
  }

  if (options.separator === 'symbol') {
    const last = words.pop();

    words = words.map(word => {
      const randomSymbol = SYMBOLS[getSecureRandomInt(SYMBOLS.length)];

      return word + randomSymbol;
    });

    words.push(last);

    return words.filter(Boolean).join('');
  }

  const separator =
    options.separator === 'space'
      ? ' '
      : options.separator === 'dash'
        ? '-'
        : '';

  return words.join(separator);
}

export function generatePin(options: PinOptions): string {
  const passwordCharacters = [];

  for (let i = 0; i < options.pinLength; i++) {
    const randomIndex = getSecureRandomInt(NUMBERS.length);
    passwordCharacters.push(NUMBERS[randomIndex]);
  }

  return passwordCharacters.join('');
}

const API_KEY_ALPHABETS: Record<Exclude<ApiKeyFormat, 'uuid'>, string> = {
  base62: BASE62,
  base64url: BASE64URL,
  hex: HEX,
};

function generateUuidV4(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);

  // RFC 9562: version 4 and variant 10xx bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'));

  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}

export function generateApiKey(options: ApiKeyOptions): string {
  const prefix = options.prefix.trim();

  if (options.format === 'uuid') {
    return prefix + generateUuidV4();
  }

  const alphabet = API_KEY_ALPHABETS[options.format];
  const keyCharacters = [];

  for (let i = 0; i < options.length; i++) {
    keyCharacters.push(alphabet[getSecureRandomInt(alphabet.length)]);
  }

  return prefix + keyCharacters.join('');
}

export function getApiKeyEntropyBits(options: ApiKeyOptions): number {
  if (options.format === 'uuid') return 122;

  const alphabet = API_KEY_ALPHABETS[options.format];

  return Math.floor(options.length * Math.log2(alphabet.length));
}
