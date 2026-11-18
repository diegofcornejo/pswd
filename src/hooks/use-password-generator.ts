import { useCallback, useEffect, useMemo, useState } from 'react';

import { wordlist as defaultWordlist } from '@/data/wordlist';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { GeneratorTab } from '@/lib/generator-types';
import {
  generateApiKey,
  generateDicewarePassword,
  generateNormalPassword,
  generatePin,
} from '@/lib/password-generator';
import {
  getPasswordStrengthColor,
  resolvePasswordStrength,
} from '@/lib/password-strength';

import type { GeneratorSettings } from './use-generator-settings';

const STRENGTHLESS_TABS: GeneratorTab[] = ['pin', 'diceware', 'apikey'];

export function usePasswordGenerator(settings: GeneratorSettings) {
  const [password, setPassword] = useState('');

  const resolvedWordlist = useMemo(() => {
    const custom = settings.customWordlist
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    if (custom.length > 0) return custom;

    return defaultWordlist;
  }, [settings.customWordlist]);

  const generatePassword = useCallback(() => {
    try {
      if (settings.activeTab === 'normal') {
        setPassword(
          generateNormalPassword({
            customSymbols: settings.customSymbols,
            excludeSimilar: settings.excludeSimilar,
            excludeSymbols: settings.excludeSymbols,
            includeLower: settings.includeLower,
            includeNumbers: settings.includeNumbers,
            includeSymbols: settings.includeSymbols,
            includeUpper: settings.includeUpper,
            length: settings.length,
          }),
        );

        return;
      }

      if (settings.activeTab === 'diceware') {
        setPassword(
          generateDicewarePassword({
            capitalize: settings.capitalize,
            randomCapitalization: settings.randomCapitalization,
            randomNumberBeginning: settings.randomNumberBeginning,
            randomNumberEnd: settings.randomNumberEnd,
            separator: settings.separator,
            wordCount: settings.wordCount,
            wordlist: resolvedWordlist,
          }),
        );

        return;
      }

      if (settings.activeTab === 'apikey') {
        setPassword(
          generateApiKey({
            format: settings.apiKeyFormat,
            length: settings.apiKeyLength,
            prefix: settings.apiKeyPrefix,
          }),
        );

        return;
      }

      setPassword(generatePin({ pinLength: settings.pinLength }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to generate password.';
      alert(message);
    }
  }, [
    settings.activeTab,
    settings.length,
    settings.includeUpper,
    settings.includeLower,
    settings.includeNumbers,
    settings.includeSymbols,
    settings.excludeSimilar,
    settings.customSymbols,
    settings.excludeSymbols,
    settings.wordCount,
    settings.separator,
    settings.capitalize,
    settings.randomCapitalization,
    settings.randomNumberBeginning,
    settings.randomNumberEnd,
    settings.pinLength,
    settings.apiKeyFormat,
    settings.apiKeyLength,
    settings.apiKeyPrefix,
    resolvedWordlist,
  ]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword, settings.activeTab]);

  const debouncedPassword = useDebouncedValue(password, 350);
  const [strength, setStrength] = useState(0);

  const isStrengthVisible = !STRENGTHLESS_TABS.includes(settings.activeTab);

  useEffect(() => {
    if (debouncedPassword && isStrengthVisible) {
      setStrength(resolvePasswordStrength(debouncedPassword));
    } else {
      setStrength(0);
    }
  }, [debouncedPassword, isStrengthVisible]);

  return {
    generatePassword,
    isStrengthVisible,
    password,
    resolvedWordlist,
    strength,
    strengthColor: getPasswordStrengthColor(strength),
  };
}
