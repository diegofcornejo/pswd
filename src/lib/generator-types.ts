export type GeneratorTab = 'normal' | 'diceware' | 'pin' | 'apikey';

export type Separator = 'space' | 'symbol' | 'dash' | 'none';

export type NormalOptions = {
  customSymbols: string;
  excludeSimilar: boolean;
  excludeSymbols: string;
  includeLower: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUpper: boolean;
  length: number;
};

export type DicewareOptions = {
  capitalize: boolean;
  randomCapitalization: boolean;
  randomNumberBeginning: boolean;
  randomNumberEnd: boolean;
  separator: Separator;
  wordCount: number;
  wordlist: string[];
};

export type PinOptions = {
  pinLength: number;
};

export type ApiKeyFormat = 'base62' | 'hex' | 'base64url' | 'uuid';

export type ApiKeyOptions = {
  format: ApiKeyFormat;
  length: number;
  prefix: string;
};

export type GeneratorState = {
  activeTab: GeneratorTab;
  apiKey: ApiKeyOptions;
  diceware: DicewareOptions;
  normal: NormalOptions;
  pin: PinOptions;
};
