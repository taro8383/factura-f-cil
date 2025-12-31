import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleToggle = (checked: boolean) => {
    setLanguage(checked ? 'en' : 'es');
  };

  return (
    <div className="flex items-center gap-3 bg-card border rounded-lg px-4 py-2 shadow-sm">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <Label htmlFor="language-toggle" className={`text-sm font-medium cursor-pointer ${language === 'es' ? 'text-foreground' : 'text-muted-foreground'}`}>
          ES
        </Label>
        <Switch
          id="language-toggle"
          checked={language === 'en'}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="language-toggle" className={`text-sm font-medium cursor-pointer ${language === 'en' ? 'text-foreground' : 'text-muted-foreground'}`}>
          EN
        </Label>
      </div>
    </div>
  );
};
