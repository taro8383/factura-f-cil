import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FieldVisibility } from '@/types/invoice';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InvoiceFooterProps {
  notas: string;
  instruccionesPago: string;
  camposVisibles: FieldVisibility;
  onChange: (updates: { notas?: string; instruccionesPago?: string }) => void;
  onVisibilityChange: (updates: Partial<FieldVisibility>) => void;
}

export const InvoiceFooter = ({
  notas,
  instruccionesPago,
  camposVisibles,
  onChange,
  onVisibilityChange
}: InvoiceFooterProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="notas">{t('notes')} / {t('paymentTerms')}</Label>
            <button
              type="button"
              onClick={() => onVisibilityChange({ notas: !camposVisibles.notas })}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={camposVisibles.notas ? t('hideInPdf') : t('showInPdf')}
            >
              {camposVisibles.notas ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground/50" />
              )}
            </button>
          </div>
          <Textarea
            id="notas"
            value={notas}
            onChange={(e) => onChange({ notas: e.target.value })}
            placeholder={t('placeholderDescription')}
            rows={4}
            className={`resize-none ${!camposVisibles.notas ? 'opacity-50' : ''}`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="instrucciones-pago">{t('paymentInstructions')}</Label>
            <button
              type="button"
              onClick={() => onVisibilityChange({ instruccionesPago: !camposVisibles.instruccionesPago })}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={camposVisibles.instruccionesPago ? t('hideInPdf') : t('showInPdf')}
            >
              {camposVisibles.instruccionesPago ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground/50" />
              )}
            </button>
          </div>
          <Textarea
            id="instrucciones-pago"
            value={instruccionesPago}
            onChange={(e) => onChange({ instruccionesPago: e.target.value })}
            placeholder="Transferencia bancaria a la cuenta: ESXX XXXX XXXX..."
            rows={4}
            className={`resize-none ${!camposVisibles.instruccionesPago ? 'opacity-50' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};
