import { API_KEY_LENGTH_LIMITS } from '@/lib/generator-constants';
import type { ApiKeyFormat } from '@/lib/generator-types';
import { getApiKeyEntropyBits } from '@/lib/password-generator';

import { NumberWithSliderField, SelectField, TextField } from './fields';
import { TabPanelShell } from './tab-panel-shell';
import styles from './api-key-tab-panel.module.css';

type ApiKeyTabPanelProps = {
  format: ApiKeyFormat;
  length: number;
  onFormatChange: (value: ApiKeyFormat) => void;
  onLengthChange: (value: number) => void;
  onPrefixChange: (value: string) => void;
  prefix: string;
};

export function ApiKeyTabPanel({
  format,
  length,
  onFormatChange,
  onLengthChange,
  onPrefixChange,
  prefix,
}: ApiKeyTabPanelProps) {
  const entropy = getApiKeyEntropyBits({ format, length, prefix });

  return (
    <TabPanelShell>
      <div className={styles.fields}>
        {format !== 'uuid' && (
          <NumberWithSliderField
            id="api-key-length"
            label="Key Length:"
            max={API_KEY_LENGTH_LIMITS.max}
            min={API_KEY_LENGTH_LIMITS.min}
            value={length}
            onChange={onLengthChange}
          />
        )}

        <SelectField
          id="api-key-format"
          label="Format:"
          value={format}
          options={[
            { label: 'Base62 (A-Z, a-z, 0-9)', value: 'base62' },
            { label: 'Hex (0-9, a-f)', value: 'hex' },
            {
              label: 'Base64 URL-safe (A-Z, a-z, 0-9, -, _)',
              value: 'base64url',
            },
            { label: 'UUID v4', value: 'uuid' },
          ]}
          onChange={value => onFormatChange(value as ApiKeyFormat)}
        />

        <TextField
          id="api-key-prefix"
          label="Prefix (optional):"
          placeholder="sk_live_"
          value={prefix}
          onChange={onPrefixChange}
        />

        <p className={styles.entropy}>
          ~{entropy} bits of entropy
          {prefix.trim() && <span> (prefix not counted)</span>}
        </p>
      </div>
    </TabPanelShell>
  );
}
