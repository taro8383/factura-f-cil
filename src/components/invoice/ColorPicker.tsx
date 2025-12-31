import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#0891b2', // Cyan
  '#059669', // Emerald
  '#d97706', // Amber
  '#dc2626', // Red
  '#7c3aed', // Violet
  '#2563eb', // Blue
  '#ea580c', // Orange
  '#0d9488', // Teal
  '#64748b', // Slate
];

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <Label>{t('accentColor')}</Label>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1 flex-wrap">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                color === preset ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-8 p-0.5 cursor-pointer"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#4f46e5"
            className="w-24 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
