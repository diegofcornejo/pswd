export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const NUMBERS = '0123456789';
export const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export const SIMILAR_CHARACTERS = 'Il1O0';

export const HEX = '0123456789abcdef';
export const BASE62 = UPPERCASE + LOWERCASE + NUMBERS;
export const BASE64URL = BASE62 + '-_';

export const GENERATOR_TABS = ['normal', 'diceware', 'pin', 'apikey'] as const;

export const PASSWORD_LENGTH_LIMITS = { max: 90, min: 0 } as const;
export const WORD_COUNT_LIMITS = { max: 20, min: 0 } as const;
export const PIN_LENGTH_LIMITS = { max: 20, min: 0 } as const;
export const API_KEY_LENGTH_LIMITS = { max: 128, min: 8 } as const;

export const PASSWORD_STRENGTH_COLORS = [
  'transparent',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#65a30d',
  '#22c55e',
] as const;
